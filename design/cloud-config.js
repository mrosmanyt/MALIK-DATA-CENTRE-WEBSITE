// Postly accounts, cloud saves, Pro plan and client approval links (Supabase).
// Before this works, run supabase/postly-setup.sql once in Supabase → SQL Editor.
// Only the PUBLISHABLE key goes here (it is safe in the browser). Never put a secret/service key here.
window.POSTLY_CLOUD = {
  enabled: false,   // keep OFF until the store's orders/products tables only allow admin accounts (see chat)
  url: "https://fxlqaqocsszrbdyrcdgj.supabase.co",
  key: "sb_publishable_yulV5o_-xOxCXW_oItHH5A_yCvKjziy",
  whatsapp: "923445739206",                 // Pro payments and questions go here
  price: { monthly: "$3 / Rs 799 a month", yearly: "$24 / Rs 5,999 a year" },
  limits: { free: { designs: 10, reviews: 1, ai: 20 }, pro: { designs: 300, reviews: "Unlimited", ai: 100 } }
};
