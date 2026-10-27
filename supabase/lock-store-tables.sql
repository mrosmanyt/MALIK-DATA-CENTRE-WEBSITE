-- =====================================================================
-- Lock the store's orders + products tables to the admin panel's server.
--
-- WHY: the old admin panel let ANY signed-in Supabase account read orders
-- (customer names and WhatsApp numbers) and change product prices. The new
-- admin panel reads them on the server with SUPABASE_SERVICE_ROLE_KEY, so
-- normal accounts don't need access any more.
--
-- RUN THIS ONLY AFTER:
--   1. SUPABASE_SERVICE_ROLE_KEY is added in Vercel and the site redeployed, and
--   2. the new admin panel → Orders shows your orders.
-- Then place one small test order on the website to check checkout still works.
--
-- Checkout keeps working: it uses the place_order function. The script first
-- checks that place_order runs with its owner's rights (SECURITY DEFINER) and
-- stops without changing anything if it doesn't.
-- =====================================================================

do $$
declare p record; definer boolean;
begin
  select bool_and(prosecdef) into definer from pg_proc where proname = 'place_order' and pronamespace = 'public'::regnamespace;
  if definer is distinct from true then
    raise exception 'STOPPED: place_order is not SECURITY DEFINER, so locking the tables could break checkout. Nothing was changed. Send this message to your developer.';
  end if;

  alter table public.orders enable row level security;
  alter table public.products enable row level security;

  -- orders: remove every rule that lets browser users read, change or delete orders
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'orders' loop
    execute format('drop policy %I on public.orders', p.policyname);
  end loop;

  -- products: keep public READ rules (prices are public), remove rules that allow changes
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'products' and cmd in ('UPDATE', 'DELETE', 'INSERT', 'ALL') loop
    execute format('drop policy %I on public.products', p.policyname);
  end loop;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'products' and cmd = 'SELECT') then
    execute 'create policy "products are public to read" on public.products for select using (true)';
  end if;

  raise notice 'Done: orders are now only visible to the admin panel server; product prices can only be changed by the admin panel.';
end $$;

-- Check the result (should list only the products read rule):
select tablename, policyname, cmd, roles from pg_policies where tablename in ('orders', 'products');
