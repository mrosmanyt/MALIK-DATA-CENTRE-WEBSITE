# Naye pages kaise update karein

Saare tool pages, comparisons, policies aur services pages **auto-generate** hote hain.

## Qeemat ya naya plan badalna
1. `index.js` mein `TOOLS_DATABASE` mein price / plan badlein (jaise pehle karte the).
2. Terminal mein website folder kholein aur chalayein:
   ```
   node build-pages.js
   ```
3. Saare tool pages, `tools/` list, homepage guides, `sitemap.xml` aur `llms.txt` nayi qeematon ke saath ban jayenge. Phir git push / Vercel deploy karein.

## Text badalna
- Tool pages ka text (intro, "Best for", "What's included", FAQs): `site-content/families.js`
- Comparisons, FAQ page, services pages: `site-content/pages-content.js`
- Refund, delivery, about, contact pages: `build-pages.js` (section "TRUST & POLICY PAGES")

## Naya tool page
`families.js` mein ek naya block banayein aur `ids` mein `index.js` wali catalog id(s) daalein, phir `node build-pages.js` chalayein.

Generated folders (`tools/`, `comparisons/`, `about-us/` wagera) ko haath se edit na karein, kyunke agli build mein woh dobara likh diye jayenge.
