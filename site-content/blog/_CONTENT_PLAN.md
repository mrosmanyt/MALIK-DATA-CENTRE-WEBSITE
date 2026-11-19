# Blog content plan

Future daily runs publish the next **5** rows with status `todo`, in order: all `P1` before `P2`, then `P3`. After a post is live, move that row into **Published** and do not reuse its target keyword. One post, one primary keyword.

Rules the validator enforces (`node scripts/validate.js`):

- File name `YYYY-MM-DD-slug.md`. Front matter matches the template in `_TEMPLATE.md`. No `draft: true` on posts that should go live.
- At most **5** published posts on the same calendar date. 2026-11-17 and 2026-11-19 are the exceptions (10 each): a Pakistan set plus a worldwide set on the same day.
- Body 700–3,500 words (aim 1,200–2,000). Title 25–75 characters. Description 110–170 characters. Answer box 25–80 words. 3–10 keywords.
- Every `Rs` amount must be a price or original price in `index.js`. Official prices are written as `PKR … (official)` or `$… (official)` and linked.
- `tools:` values are family slugs from `site-content/families.js`. At least two internal links and a `## FAQ` with two questions.
- Do not hand-edit `blog/*.html`, `sitemap.xml`, `llms.txt` or `blog/feed.xml`. Run `node build-pages.js`.

Language: the site translates in the browser (English, Urdu, Hindi, Bangla, Nepali, Arabic, Pashto, Tamil, Punjabi, Italian, Turkish, Uzbek, Spanish, Afrikaans, German, Polish, Irish, Hungarian, Russian, French, Chinese, Japanese, Korean). Posts stay English in Markdown. Do not add machine-translated copies or fake hreflang URLs.

## Published

| Date | Slug | Target keyword | Tools |
|---|---|---|---|
| 2026-09-21 | chatgpt-vs-super-grok-pakistan-guide | chatgpt vs super grok pakistan | chatgpt-go, super-grok, gemini-pro |
| 2026-09-21 | canva-pro-vs-adobe-creative-cloud | canva pro vs adobe creative cloud | canva-pro, adobe-creative-cloud |
| 2026-09-21 | is-it-safe-to-buy-cheap-ai-subscriptions-pakistan | is it safe to buy cheap ai subscriptions | (store-wide) |
| 2026-09-21 | capcut-pro-review | capcut pro review 2026 | capcut-pro |
| 2026-10-25 | buy-ai-tools-pakistan-without-credit-card | buy ai tools pakistan without credit card | chatgpt-go, gemini-pro, canva-pro |
| 2026-10-26 | buy-ai-tools-without-credit-card-worldwide | buy ai tools without credit card | chatgpt-go, gemini-pro |
| 2026-10-27 | how-to-activate-canva-pro-on-your-own-email | how to activate canva pro on your own email | canva-pro |
| 2026-10-28 | chatgpt-go-vs-gemini-pro-for-students-pakistan | chatgpt go vs gemini pro for students | chatgpt-go, gemini-pro |
| 2026-10-29 | best-ai-tools-for-freelancers-pakistan-fiverr-upwork | best ai tools for freelancers pakistan | chatgpt-go, canva-pro, grammarly-pro |
| 2026-10-30 | private-vs-shared-vs-invitation-ai-accounts-pakistan | private vs shared ai account pakistan | (access types) |
| 2026-11-02 | chatgpt-go-price-in-pakistan | chatgpt go price in pakistan | chatgpt-go |
| 2026-11-03 | how-to-activate-windows-11-pro-with-retail-key | how to activate windows 11 pro retail key | windows-pro-key |
| 2026-11-04 | capcut-pro-vs-adobe-premiere-pro-for-reels-pakistan | capcut pro vs premiere pro for reels | capcut-pro, adobe-creative-cloud |
| 2026-11-05 | best-ai-tools-for-university-students-pakistan | best ai tools for university students pakistan | gemini-pro, grammarly-pro, quillbot |
| 2026-11-06 | how-to-spot-fake-ai-subscription-seller-pakistan | fake ai subscription seller pakistan | chatgpt-go, canva-pro |
| 2026-11-14 | cursor-pro-price-in-pakistan | cursor pro price in pakistan | cursor-pro |
| 2026-11-14 | elevenlabs-price-in-pakistan | elevenlabs price in pakistan | elevenlabs-creator |
| 2026-11-14 | youtube-premium-price-in-pakistan | youtube premium price in pakistan | youtube-premium |
| 2026-11-14 | linkedin-premium-price-in-pakistan | linkedin premium price in pakistan | linkedin-premium |
| 2026-11-14 | best-ai-tools-for-youtubers-pakistan | best ai tools for youtubers pakistan | vidiq-max, capcut-pro, canva-pro |
| 2026-11-15 | grammarly-pro-price-in-pakistan | grammarly pro price in pakistan | grammarly-pro, quillbot |
| 2026-11-15 | quillbot-premium-price-in-pakistan | quillbot premium price in pakistan | quillbot, grammarly-pro |
| 2026-11-15 | gamma-pro-price-in-pakistan | gamma pro price in pakistan | gamma-pro, canva-pro |
| 2026-11-15 | coursera-plus-price-in-pakistan | coursera plus price in pakistan | coursera-plus, linkedin-premium |
| 2026-11-15 | nordvpn-vs-surfshark-pakistan | nordvpn vs surfshark pakistan | nordvpn, surfshark-vpn |
| 2026-11-16 | heygen-price-in-pakistan | heygen price in pakistan | heygen, elevenlabs-creator |
| 2026-11-16 | kling-ai-price-in-pakistan | kling ai price in pakistan | kling-ai, higgsfield |
| 2026-11-16 | adobe-creative-cloud-price-in-pakistan | adobe creative cloud price in pakistan | adobe-creative-cloud, canva-pro |
| 2026-11-16 | capcut-pro-price-in-pakistan | capcut pro price in pakistan | capcut-pro |
| 2026-11-16 | gemini-pro-price-in-pakistan | gemini pro price in pakistan | gemini-pro, google-ai-ultra |
| 2026-11-17 | google-ai-ultra-price-in-pakistan | google ai ultra price in pakistan | google-ai-ultra, gemini-pro |
| 2026-11-17 | super-grok-price-in-pakistan | super grok price in pakistan | super-grok, chatgpt-go |
| 2026-11-17 | replit-core-price-in-pakistan | replit core price in pakistan | replit-core, cursor-pro |
| 2026-11-17 | lovable-pro-price-in-pakistan | lovable pro price in pakistan | lovable-pro, cursor-pro |
| 2026-11-17 | notion-business-price-in-pakistan | notion business price in pakistan | notion-business, gamma-pro |
| 2026-11-17 | best-ai-tools-to-buy-in-pakistan-2026 | best ai tools to buy in pakistan | chatgpt-go, gemini-pro, capcut-pro |
| 2026-11-17 | chatgpt-go-vs-gemini-pro-vs-supergrok-pakistan | chatgpt plus vs gemini pro vs supergrok pakistan | chatgpt-go, gemini-pro, super-grok |
| 2026-11-17 | cheapest-ai-tools-for-students-in-pakistan | cheapest ai tools for students pakistan | gemini-pro, canva-pro, chatgpt-go |
| 2026-11-17 | where-to-buy-ai-tools-online-2026 | where to buy ai tools online | capcut-pro, super-grok, lovable-pro |
| 2026-11-17 | buy-claude-api-keys-and-ai-subscriptions | buy claude api keys | claude-api-tokens, codex-api |
| 2026-11-19 | higgsfield-price-in-pakistan | higgsfield price in pakistan | higgsfield, kling-ai |
| 2026-11-19 | picsart-pro-price-in-pakistan | picsart pro price in pakistan | picsart-pro, canva-pro |
| 2026-11-19 | zoom-pro-price-in-pakistan | zoom pro price in pakistan | zoom-pro, microsoft-office-365 |
| 2026-11-19 | microsoft-365-price-in-pakistan | microsoft 365 price in pakistan | microsoft-office-365, windows-pro-key |
| 2026-11-19 | envato-price-in-pakistan | envato elements price in pakistan | envato, storyblocks |
| 2026-11-19 | best-ai-tools-for-small-shops-in-pakistan | best ai tools for small shops in pakistan | canva-pro, chatgpt-go, capcut-pro |
| 2026-11-19 | buy-muse-ai-tokens-online | buy muse ai tokens | muse-ai, chatgpt-go |
| 2026-11-19 | buy-warp-build-online | buy warp build online | warp-build, cursor-pro |
| 2026-11-19 | cheap-adobe-express-subscription | cheap adobe express subscription | adobe-express, canva-pro, adobe-creative-cloud |
| 2026-11-19 | buy-udemy-personal-plan-online | buy udemy online | udemy, coursera-plus |

The four 2026-09-21 rows are hand-written HTML, not Markdown. Do not regenerate them by pasting over those files.

## Backlog

Status stays `todo` until a daily run publishes the piece. Prefer a tool that still has no dedicated post.

| Pri | Status | Target keyword | Working title | Tools | Angle |
|---|---|---|---|---|---|
| P2 | todo | how to use vidiq for a new youtube channel | How to Use vidIQ on a New YouTube Channel in Pakistan | vidiq-max, youtube-premium | Keyword workflow. Boost vs Max. No ranking promise. |
| P2 | todo | how to activate youtube premium on your email | How to Activate YouTube Premium on Your Own Email | youtube-premium | Step-through after the price post. TV apps and family limits. |
| P2 | todo | how to use elevenlabs for a faceless channel | How to Use ElevenLabs for a Faceless YouTube Channel | elevenlabs-creator, capcut-pro | Script, generate, edit. Consent for cloning. |
| P2 | todo | how to use cursor pro for a client project | How to Use Cursor Pro on a Freelance Code Project | cursor-pro | Usage pool, diffs, secrets. Not a repeat of the price table. |
| P2 | todo | how to write linkedin inmail that gets a reply | How to Write a LinkedIn InMail That Gets a Reply | linkedin-premium, grammarly-pro | Five Career credits. No "guaranteed jobs". |
| P2 | todo | artlist price in pakistan | Artlist Pro Price in Pakistan for YouTube Music | artlist, capcut-pro | Claims and where the licence lives. |
| P2 | todo | n8n starter price in pakistan | n8n Starter Price in Pakistan for WhatsApp and CRM Workflows | n8n-starter, gumloop-pro | When to buy the seat vs hire the automation service. |
| P2 | todo | claude api tokens price in pakistan | Claude API Token Price in Pakistan: What 10M Tokens Means | claude-api-tokens, chatgpt-go | Developers only. Not a chat login. |
| P2 | todo | manus ai price in pakistan | Manus Pro Price in Pakistan: When an Agent Beats a Chatbot | manus-ai, genspark | 12-month private account. Research tasks, not a second ChatGPT. |
| P3 | todo | genspark plus price in pakistan | Genspark Plus Price in Pakistan for Slides and Research | genspark, gamma-pro | One-month agent workspace. |
| P3 | todo | ideogram plus for youtube thumbnails | Ideogram Plus for Thumbnails: When Canva Is Not Enough | ideogram, canva-pro | Text-in-image. YouTuber post only mentions it. |
| P3 | todo | storyblocks vs envato for b-roll | Storyblocks vs Envato for YouTube B-roll in Pakistan | storyblocks, envato | One-month unlimited vs the wider library. |
| P3 | todo | surfshark vpn price in pakistan | Surfshark VPN Price in Pakistan on a Shared Account | surfshark-vpn, nordvpn | Budget VPN. What not to do on a shared login. |
| P3 | todo | hma vpn price in pakistan | HMA VPN Key Price in Pakistan: Yearly Licence | hma-vpn, nordvpn | Key delivery vs email activation. |
| P3 | todo | amazon prime video price in pakistan | Amazon Prime Video Price in Pakistan: 6-Month Private Profile | amazon-prime-video, youtube-premium | What a private profile means. |
| P3 | todo | dreamface price in pakistan | DreamFace Price in Pakistan: Talking Photos vs HeyGen | dreamface, heygen | Monthly vs yearly. Fun content vs client work. |
| P3 | todo | wispr flow price in pakistan | Wispr Flow Pro Price in Pakistan for Dictation | wispr-flow, grammarly-pro | 12-month plan. Test the language on free first. |
| P3 | todo | gumloop pro price in pakistan | Gumloop Pro Price in Pakistan for No-Code Scraping | gumloop-pro, n8n-starter | Who should pick n8n instead. |
| P3 | todo | best ai video tools in pakistan 2026 | Best AI Video Tools in Pakistan: Kling, Higgsfield, CapCut, HeyGen | kling-ai, higgsfield, heygen, capcut-pro | Pick by output: clip, avatar, edit. |
| P3 | todo | buy framer pro online | Buy Framer Pro Online for a Marketing Site | framer | 12-month ready-made account. Not Lovable. |
| P3 | todo | buy bolt new pro online | Buy Bolt.new Pro Online: Prompt to a Web App | bolt-new, lovable-pro | 12-month ready-made. Compare with Cursor only at a high level. |
| P3 | todo | buy render credits online | Buy Render Credits Online: What the $50 Coupon Means | render | $50 is the credit size. Quote the PKR price only. |
| P3 | todo | cheap edx subscription | Cheap edX Premium: A Year of Courses Online | edx, coursera-plus | Rs 400 year vs Coursera. Certificates follow the course. |

Next run starts at **How to Use vidIQ on a New YouTube Channel in Pakistan**. The 2026-11-19 batch skipped the how-to queue so it could publish six Pakistan price and shop posts plus four worldwide buy posts. Do not reuse those ten keywords.
