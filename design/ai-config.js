/* ==========================================================================
   Postly Design Studio — AI settings (the only file you need to edit)

   mode "direct": the browser talks to Pollinations.ai with a PUBLISHABLE key.
     1. Sign in at https://enter.pollinations.ai (free)
     2. Create an "App key" (starts with pk_) and allow your domain
        www.malikdatacentre.store
     3. Paste it below as `key`. A pk_ key is made to be public; never put an
        sk_ (secret) key in this file.

   mode "proxy": the browser talks to /api/ai on your own Vercel site, which
     keeps a SECRET key on the server. Use this when you want higher limits
     or a paid provider:
     1. Vercel → your project → Settings → Environment Variables
        POLLINATIONS_API_KEY = sk_...   (or OPENAI_API_KEY = sk-...)
     2. Change mode below to "proxy" and redeploy.
   ========================================================================== */
window.MDC_AI_CONFIG = {
  mode: "direct",                       // "direct" or "proxy"
  base: "https://gen.pollinations.ai",  // Pollinations API
  key: "",                              // pk_... publishable key (direct mode only)
  textModel: "openai",                  // text model name on Pollinations
  imageModel: "flux",                   // image model name on Pollinations
  proxyUrl: "/api/ai",                  // used in proxy mode
  dailyLimit: 20                        // AI uses per visitor per day (counted in their browser)
};
