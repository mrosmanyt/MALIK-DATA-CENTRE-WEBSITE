-- =====================================================================
-- Postly Design Studio: accounts, cloud saves, Pro plan, client approval links
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- It only creates new "postly_" tables and functions. It does not touch the
-- store's existing tables or the place_order function.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- profiles (one per user, created automatically) ----------
create table if not exists public.postly_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  pro_until timestamptz,
  created_at timestamptz not null default now()
);
alter table public.postly_profiles enable row level security;
drop policy if exists "postly profile: read own" on public.postly_profiles;
create policy "postly profile: read own" on public.postly_profiles for select using (auth.uid() = id);
-- no insert/update/delete policies: users can't change their own plan

create or replace function public.postly_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.postly_profiles (id, email) values (new.id, new.email) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists postly_on_auth_user on auth.users;
create trigger postly_on_auth_user after insert on auth.users for each row execute function public.postly_new_user();
-- users who signed up before this script
insert into public.postly_profiles (id, email) select id, email from auth.users on conflict (id) do nothing;

-- is this user Pro right now?
create or replace function public.postly_is_pro(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.postly_profiles p where p.id = uid and p.plan = 'pro' and (p.pro_until is null or p.pro_until > now()));
$$;

-- ---------- cloud designs ----------
create table if not exists public.postly_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default 'Untitled design',
  data jsonb not null,          -- { pages: [...], cur: 0 }
  thumb text,                   -- small JPEG data URL
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists postly_designs_user on public.postly_designs (user_id, updated_at desc);
alter table public.postly_designs enable row level security;
drop policy if exists "postly designs: own" on public.postly_designs;
create policy "postly designs: own" on public.postly_designs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- limits: Free = 10 designs of up to 4 MB, Pro = 300 designs of up to 20 MB
create or replace function public.postly_design_limits() returns trigger
language plpgsql security definer set search_path = public as $$
declare pro boolean := public.postly_is_pro(new.user_id); n int;
begin
  if octet_length(new.data::text) + coalesce(octet_length(new.thumb), 0) > (case when pro then 20 else 4 end) * 1024 * 1024 then
    raise exception 'POSTLY_TOO_BIG: this design is too large for your plan' using errcode = 'P0001';
  end if;
  if tg_op = 'INSERT' then
    select count(*) into n from public.postly_designs where user_id = new.user_id;
    if n >= (case when pro then 300 else 10 end) then
      raise exception 'POSTLY_LIMIT: design limit reached for your plan' using errcode = 'P0001';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists postly_design_limits on public.postly_designs;
create trigger postly_design_limits before insert or update on public.postly_designs for each row execute function public.postly_design_limits();

-- ---------- Pro upgrade requests (paid on WhatsApp, activated by you) ----------
create table if not exists public.postly_pro_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  email text,
  plan text not null check (plan in ('monthly', 'yearly')),
  note text,
  status text not null default 'pending' check (status in ('pending', 'done', 'rejected')),
  created_at timestamptz not null default now()
);
alter table public.postly_pro_requests enable row level security;
drop policy if exists "postly pro req: read own" on public.postly_pro_requests;
create policy "postly pro req: read own" on public.postly_pro_requests for select using (auth.uid() = user_id);
drop policy if exists "postly pro req: add own" on public.postly_pro_requests;
create policy "postly pro req: add own" on public.postly_pro_requests for insert with check (auth.uid() = user_id and status = 'pending');

-- Run this yourself (SQL Editor) after you receive the payment:
--   select public.postly_activate_pro('customer@email.com', 30);    -- 30 days (monthly)
--   select public.postly_activate_pro('customer@email.com', 365);   -- yearly
create or replace function public.postly_activate_pro(user_email text, days int) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid; until timestamptz;
begin
  select id into uid from auth.users where lower(email) = lower(user_email);
  if uid is null then return 'No account with that email'; end if;
  insert into public.postly_profiles (id, email) values (uid, user_email) on conflict (id) do nothing;
  update public.postly_profiles
     set plan = 'pro', pro_until = greatest(coalesce(pro_until, now()), now()) + make_interval(days => days)
   where id = uid returning pro_until into until;
  update public.postly_pro_requests set status = 'done' where user_id = uid and status = 'pending';
  return 'Pro active until ' || to_char(until, 'YYYY-MM-DD');
end $$;
revoke all on function public.postly_activate_pro(text, int) from public, anon, authenticated;
-- the admin panel's server (service role) may run it
do $$ begin if exists (select 1 from pg_roles where rolname = 'service_role') then grant execute on function public.postly_activate_pro(text, int) to service_role; end if; end $$;

-- ---------- client approval links ----------
create table if not exists public.postly_reviews (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(12), 'hex'),
  title text not null default 'Design for review',
  pages jsonb not null,         -- array of JPEG data URLs (previews only, not the editable design)
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  decided_by text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);
alter table public.postly_reviews enable row level security;
drop policy if exists "postly reviews: own" on public.postly_reviews;
create policy "postly reviews: own" on public.postly_reviews for all using (auth.uid() = owner) with check (auth.uid() = owner);

-- Free = 1 active link, Pro = unlimited; previews up to 8 MB (Free) / 25 MB (Pro)
create or replace function public.postly_review_limits() returns trigger
language plpgsql security definer set search_path = public as $$
declare pro boolean := public.postly_is_pro(new.owner); n int;
begin
  if octet_length(new.pages::text) > (case when pro then 25 else 8 end) * 1024 * 1024 then
    raise exception 'POSTLY_TOO_BIG: review is too large' using errcode = 'P0001';
  end if;
  if tg_op = 'INSERT' and not pro then
    select count(*) into n from public.postly_reviews where owner = new.owner and expires_at > now() and status = 'pending';
    if n >= 1 then raise exception 'POSTLY_REVIEW_LIMIT: Free plan has 1 open approval link' using errcode = 'P0001'; end if;
  end if;
  return new;
end $$;
drop trigger if exists postly_review_limits on public.postly_reviews;
create trigger postly_review_limits before insert or update on public.postly_reviews for each row execute function public.postly_review_limits();

create table if not exists public.postly_review_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.postly_reviews (id) on delete cascade,
  name text not null,
  page int not null default 0,
  x real, y real,               -- pin position, 0..1 of the page (optional)
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists postly_review_comments_review on public.postly_review_comments (review_id, created_at);
alter table public.postly_review_comments enable row level security;
drop policy if exists "postly comments: owner reads" on public.postly_review_comments;
create policy "postly comments: owner reads" on public.postly_review_comments for select
  using (exists (select 1 from public.postly_reviews r where r.id = review_id and r.owner = auth.uid()));
drop policy if exists "postly comments: owner deletes" on public.postly_review_comments;
create policy "postly comments: owner deletes" on public.postly_review_comments for delete
  using (exists (select 1 from public.postly_reviews r where r.id = review_id and r.owner = auth.uid()));

-- the client (no account) only works through these three functions, using the secret link token
create or replace function public.postly_get_review(t text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('title', r.title, 'pages', r.pages, 'status', r.status, 'decided_by', r.decided_by, 'decided_at', r.decided_at, 'created_at', r.created_at,
    'comments', coalesce((select json_agg(json_build_object('name', c.name, 'page', c.page, 'x', c.x, 'y', c.y, 'body', c.body, 'created_at', c.created_at) order by c.created_at)
                          from public.postly_review_comments c where c.review_id = r.id), '[]'::json))
  from public.postly_reviews r where r.token = t and r.expires_at > now();
$$;

create or replace function public.postly_add_comment(t text, who text, pg int, px real, py real, msg text) returns boolean
language plpgsql security definer set search_path = public as $$
declare rid uuid; n int;
begin
  select id into rid from public.postly_reviews where token = t and expires_at > now();
  if rid is null then return false; end if;
  if length(trim(coalesce(msg, ''))) = 0 or length(msg) > 1000 or length(coalesce(who, '')) > 60 then return false; end if;
  select count(*) into n from public.postly_review_comments where review_id = rid;
  if n >= 300 then return false; end if;
  insert into public.postly_review_comments (review_id, name, page, x, y, body)
  values (rid, coalesce(nullif(trim(who), ''), 'Client'), greatest(0, pg), case when px between 0 and 1 then px end, case when py between 0 and 1 then py end, trim(msg));
  return true;
end $$;

create or replace function public.postly_decide(t text, who text, decision text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if decision not in ('approved', 'changes') then return false; end if;
  update public.postly_reviews set status = decision, decided_by = left(coalesce(nullif(trim(who), ''), 'Client'), 60), decided_at = now()
   where token = t and expires_at > now();
  return found;
end $$;

grant execute on function public.postly_get_review(text) to anon, authenticated;
grant execute on function public.postly_add_comment(text, text, int, real, real, text) to anon, authenticated;
grant execute on function public.postly_decide(text, text, text) to anon, authenticated;
grant execute on function public.postly_is_pro(uuid) to authenticated;
