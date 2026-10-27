/* ==========================================================================
   Postly tool landing pages (SEO). One object per page.
   tool: what Postly opens with (handled by design/deeplink.js)
   templates: template ids shown as preview images (images are generated into assets/postly/)
   ========================================================================== */
module.exports = [
  {
    slug: "youtube-thumbnail-maker", tool: "thumbnail", icon: "fa-brands fa-youtube",
    title: "Free YouTube Thumbnail Maker with AI (No Signup)",
    h1: "Free YouTube Thumbnail Maker",
    lead: "Make click-worthy YouTube thumbnails in minutes. Start from 40+ proven layouts, cut out your face with a white outline in one click, add bold text effects, and preview how it looks in the video feed before you upload.",
    keywords: "youtube thumbnail maker, free thumbnail maker, thumbnail maker online, ai thumbnail generator, youtube thumbnail template, thumbnail maker no watermark",
    templates: ["th-face-shock", "th-list-top10", "th-vs-ai", "th-money-income", "th-tut-howto", "th-min-course"],
    features: [
      ["fa-solid fa-user-astronaut", "Face cut-out + outline", "Remove the background from your photo and add the classic white outline in one click."],
      ["fa-solid fa-wand-magic-sparkles", "Thumbnail from a title", "Type your video title and AI picks a layout, writes a short hook and creates a background."],
      ["fa-solid fa-font", "Bold text effects", "Thick outline, hard shadow, neon, 3D and gold effects made for small screens."],
      ["fa-solid fa-eye", "Feed preview & A/B compare", "See your thumbnail at real feed sizes, and put two versions side by side."],
      ["fa-solid fa-gauge-high", "Thumbnail score", "Get warnings for text that is too small, low contrast or a face that is too small."],
      ["fa-brands fa-youtube", "Import from a YouTube link", "Paste any video link to pull in its title and current thumbnail, then redesign it or compare."],
      ["fa-solid fa-sun", "One-click pop & background blur", "Brighter colours and sharper detail in one tap, and blur the background so you stand out."],
      ["fa-solid fa-download", "Ready for YouTube", "Download a 1280×720 JPG that is always under YouTube's 2 MB limit."]
    ],
    steps: [["Pick a layout or type your title", "Choose a template, or let AI build one from your video title."], ["Add your face", "Upload a photo and tap Face cut-out."], ["Write a 2–4 word hook", "Big, high-contrast words that add to the title, not repeat it."], ["Preview and download", "Check it in the feed preview, then download the YouTube-ready JPG."]],
    tips: "<h2>What makes a thumbnail get clicks?</h2><p>Most viewers decide in under a second, usually on a phone where your thumbnail is only about 160 pixels wide. The thumbnails that win share a few habits: one clear subject (usually a face showing emotion), no more than four words of text, strong contrast between text and background, and one focal point such as an arrow or circle that tells the eye where to look.</p><p>Avoid repeating your title in the thumbnail. The title and thumbnail should work as a pair: the thumbnail creates curiosity, the title explains. Use Postly's thumbnail score and feed preview to check readability at small sizes before you publish, and test two versions with A/B compare.</p>",
    faqs: [["Is the YouTube thumbnail maker really free?", "Yes. Templates, text effects, face cut-out, feed preview and downloads are free with no signup and no watermark. AI features have a free daily limit."], ["What size should a YouTube thumbnail be?", "1280×720 pixels (16:9), under 2 MB, in JPG or PNG. Postly's \"Download for YouTube\" button gives you exactly that."], ["Can I remove the background from my face photo?", "Yes. Select your photo and tap Face cut-out. The background is removed in your browser and a white outline is added."], ["Can I see how my thumbnail looks before uploading?", "Yes. The feed preview shows it at desktop, sidebar and phone sizes, in light and dark mode, and you can compare two versions side by side."], ["Can I redesign the thumbnail of a video I already uploaded?", "Yes. Paste the video link under Import a YouTube video. Postly loads the title and the current thumbnail so you can score it, make better ideas from the title, or compare old and new side by side."], ["Does it work on mobile?", "Yes. Postly works in your phone's browser, with pinch-to-zoom and large touch controls."]]
  },
  {
    slug: "ad-maker", tool: "ads", icon: "fa-solid fa-bullhorn",
    title: "Free Ad Maker for Facebook, Instagram & Google Ads",
    h1: "Free Ad Creative Maker",
    lead: "Design high-converting ads for Facebook, Instagram, TikTok and Google Display in one place. Start from 34+ ad templates, resize one design into every ad size in a click, animate it, and write the ad copy with AI.",
    keywords: "ad maker, facebook ad maker, instagram ad maker, google display ad maker, ad creative maker, free ad design, banner ad maker",
    templates: ["ad-product-sneaker", "ad-offer-code", "ad-count-sale", "ad-app-feed", "ad-compare", "ad-review"],
    features: [
      ["fa-solid fa-layer-group", "Every ad size in one click", "Turn one design into a full Facebook & Instagram set or all 7 Google Display sizes."],
      ["fa-solid fa-film", "Animated ads", "Add motion and download an MP4/WebM video or GIF for Reels, Stories and display ads."],
      ["fa-solid fa-copy", "5 ad variations with AI", "Upload a product photo and description, get five ready ad versions to test."],
      ["fa-solid fa-pen-nib", "AI ad copy", "Primary text, headlines and 30-character Google Ads headlines."],
      ["fa-solid fa-mobile-screen", "Feed & Story preview", "See how your ad looks in a social feed and in Stories before you launch."],
      ["fa-solid fa-tags", "Ad-ready elements", "CTA buttons, price bursts, coupon boxes, countdowns and trust badges."],
      ["fa-solid fa-shirt", "Product mockups", "Put your design on a phone, laptop, T-shirt, mug, box, tote bag or framed poster."],
      ["fa-solid fa-images", "Carousel builder", "AI writes a swipeable carousel, or split one wide panorama design into seamless slides."]
    ],
    steps: [["Choose an ad template", "Product, offer, countdown, app, lead or review ads."], ["Add your product and offer", "Drop in your photo, price and call to action."], ["Make the full ad set", "Create all sizes for Meta or Google in one click."], ["Download and launch", "Download all sizes as a ZIP, or as an animated video."]],
    tips: "<h2>Ad creative tips that improve results</h2><p>Lead with one clear message: the product, the benefit and the offer should be readable in two seconds. Show the product big, keep the call to action on a solid button, and use the same visual style across every size so people recognise you.</p><p>Test several creatives at once. Ad platforms reward variety, so make three to five versions with different hooks (price, benefit, social proof, urgency) and let the results decide. Postly's ad variations and one-click ad sets make that quick.</p>",
    faqs: [["Which ad sizes are included?", "Facebook/Instagram feed (1080×1080, 1080×1350), Stories/Reels/TikTok (1080×1920), link ads (1200×628) and Google Display (300×250, 336×280, 728×90, 970×250, 300×600, 160×600, 320×50)."], ["Can I make animated ads?", "Yes. Add simple animations to any element and download a video (MP4 or WebM, depending on your browser) or a GIF."], ["Can AI write my ad copy?", "Yes. The AI writer creates Facebook/Instagram primary text, short headlines and Google Ads headlines under 30 characters."], ["Is there a watermark?", "No. Downloads are free and have no watermark."], ["Can I resize one ad into all sizes?", "Yes. Use \"Make Facebook & Instagram ad set\" or \"Make Google Display ad set\" in the YT & Ads panel."]]
  },
  {
    slug: "youtube-banner-maker", tool: "banner", icon: "fa-solid fa-panorama",
    title: "Free YouTube Banner & Channel Art Maker",
    h1: "YouTube Banner & Channel Kit Maker",
    lead: "Create a complete YouTube channel kit: channel banner with the safe area that shows on every device, profile picture, end screen and Shorts cover. All in matching colours and fonts.",
    keywords: "youtube banner maker, youtube channel art maker, youtube end screen template, youtube profile picture maker, shorts cover maker",
    templates: ["kit-banner-bold", "kit-endscreen", "kit-profile", "kit-shorts-cover"],
    features: [
      ["fa-solid fa-border-none", "Safe-area guides", "See exactly which part of your 2560×1440 banner shows on phones, desktops and TVs."],
      ["fa-solid fa-circle-user", "Profile picture", "An 800×800 design that looks sharp in the round crop."],
      ["fa-solid fa-display", "End screen", "1920×1080 with the video and subscribe zones marked."],
      ["fa-solid fa-mobile", "Shorts cover", "1080×1920 covers that match your channel."],
      ["fa-solid fa-swatchbook", "Brand kit", "Save your logo, colours and fonts once and reuse them."],
      ["fa-solid fa-download", "Free downloads", "PNG or JPG, no watermark, no signup."]
    ],
    steps: [["Open the channel kit", "Pick the banner, profile, end screen or Shorts cover."], ["Turn on safe zones", "Keep your name and key text inside the marked area."], ["Add your branding", "Apply your brand kit in one click."], ["Download each piece", "Upload them in YouTube Studio → Customisation."]],
    tips: "<h2>Getting your channel banner right</h2><p>YouTube shows different parts of the same 2560×1440 banner on different screens. Only the centre 1546×423 area is visible everywhere, so your channel name, upload schedule and main message must sit there. Use the outer areas for background colour and texture only.</p>",
    faqs: [["What size is a YouTube banner?", "2560×1440 pixels, with a safe area of 1546×423 in the centre that is visible on all devices."], ["What size is an end screen?", "Design it at 1920×1080. Leave the marked zones free for the video and subscribe elements you add in YouTube Studio."], ["What size is a YouTube profile picture?", "800×800 pixels. It is shown as a circle, so keep your logo in the centre."], ["Is it free?", "Yes, completely free with no watermark."]]
  },
  {
    slug: "qr-code-maker", tool: "qr", icon: "fa-solid fa-qrcode",
    title: "Free QR Code Maker for WhatsApp, Websites & Payments",
    h1: "Free QR Code Maker",
    lead: "Make a QR code for your WhatsApp number, website, phone or any text, then place it straight onto your flyer, menu, business card or poster. No signup, no expiry.",
    keywords: "qr code maker, whatsapp qr code, free qr code generator, qr code for business card, qr code for menu",
    templates: ["x-restaurant-menu", "x-card-dark", "x-price-list", "x-grand-opening"],
    features: [
      ["fa-brands fa-whatsapp", "WhatsApp QR codes", "Customers scan and land in a chat with your pre-filled message."],
      ["fa-solid fa-link", "Website & link QR codes", "Point to your shop, menu, form or social profile."],
      ["fa-solid fa-palette", "Your colours", "Pick any QR colour that still scans well."],
      ["fa-solid fa-infinity", "Never expires", "The code is static, so it keeps working forever."],
      ["fa-solid fa-print", "Print-ready", "Add it to a flyer, card or menu and download a sharp PNG or PDF."],
      ["fa-solid fa-lock", "Private", "Made in your browser. Nothing is tracked."]
    ],
    steps: [["Open Elements → QR code", "Choose WhatsApp, website, phone or text."], ["Enter your number or link", "Add an optional pre-filled WhatsApp message."], ["Place it on your design", "Resize and move it like any other element."], ["Test, then print", "Scan it with your phone camera before printing."]],
    tips: "<h2>QR code tips for print</h2><p>Print QR codes at least 2 × 2 cm on business cards and 4 × 4 cm on posters, with a white margin around them. Dark codes on a light background scan best. Always test with two different phones before you print in bulk.</p>",
    faqs: [["Do the QR codes expire?", "No. They are static codes that contain your link or number directly, so they work forever."], ["Can I make a WhatsApp QR code?", "Yes. Enter your number with country code and an optional message. Scanning opens a chat with you."], ["Is it free for business use?", "Yes."], ["Can I change the colour?", "Yes. Keep enough contrast with the background so it scans reliably."]]
  },
  {
    slug: "background-remover", tool: "bgremove", icon: "fa-solid fa-scissors",
    title: "Free Background Remover: Remove Image Background Online",
    h1: "Free Background Remover",
    lead: "Remove the background from any photo in one click, right in your browser. Your photo is not uploaded to a server. Then put your product or portrait on a new background, add an outline, or turn it into a studio product photo.",
    keywords: "background remover, remove background from image, free background remover, transparent background, product photo background",
    templates: ["ad-product-sneaker", "th-face-truth", "x-salon-offer", "ad-product-beauty"],
    features: [
      ["fa-solid fa-scissors", "One-click removal", "AI finds the subject and removes the background."],
      ["fa-solid fa-shield-halved", "Private", "Runs in your browser; your photo stays on your device."],
      ["fa-solid fa-image", "Transparent PNG", "Download with a transparent background."],
      ["fa-solid fa-box-open", "Studio product photos", "Put your product on a studio, marble or nature scene with AI."],
      ["fa-solid fa-user-astronaut", "Outline & glow", "Add the sticker-style outline used in thumbnails."],
      ["fa-solid fa-eraser", "Magic eraser", "Paint over unwanted objects to remove them."]
    ],
    steps: [["Upload your photo", "Drag it in or tap Uploads."], ["Tap Remove BG", "The first time downloads the AI model (about 40 MB)."], ["Add a new background", "Colour, photo, AI scene or keep it transparent."], ["Download", "PNG transparent, PNG or JPG."]],
    tips: "<h2>Getting clean cut-outs</h2><p>Use a photo with good light and a clear difference between the subject and the background. Hair and fine edges come out best when the photo is sharp. For products, shoot on a plain surface and fill most of the frame.</p>",
    faqs: [["Is my photo uploaded?", "No. Background removal runs in your browser, so the photo stays on your device."], ["Is it free?", "Yes, with no limit and no watermark."], ["Can I download a transparent PNG?", "Yes. Choose Download → PNG transparent."], ["Why is the first use slow?", "The AI model (about 40 MB) downloads once. After that it is much faster."]]
  },
  {
    slug: "instagram-post-maker", tool: "instagram", icon: "fa-brands fa-instagram",
    title: "Free Instagram Post, Story & Reel Cover Maker",
    h1: "Instagram Post & Story Maker",
    lead: "Design Instagram posts, carousels, Stories and Reel covers with ready templates, free photos and icons, and AI captions and hashtags. Share straight to Instagram or WhatsApp from your phone.",
    keywords: "instagram post maker, instagram story maker, reel cover maker, instagram carousel maker, social media post maker",
    templates: ["x-new-arrivals", "x-giveaway", "x-reel-food", "x-quote-motivation", "x-summer-sale", "x-thank-you"],
    features: [
      ["fa-solid fa-table-cells-large", "Ready templates", "Sales, quotes, giveaways, announcements and Reel covers."],
      ["fa-solid fa-images", "Seamless carousels", "Design one long image and split it into 3–5 swipeable slides."],
      ["fa-solid fa-hashtag", "AI captions & hashtags", "Write captions and hashtag sets in seconds."],
      ["fa-solid fa-share-nodes", "Share from your phone", "Send the design straight to Instagram or WhatsApp."],
      ["fa-regular fa-images", "Free photos & icons", "Search thousands of free photos and 200,000+ icons."],
      ["fa-solid fa-swatchbook", "Brand kit", "Keep every post in your colours and fonts."]
    ],
    steps: [["Pick a size", "Post (1:1), portrait (4:5), Story or Reel cover (9:16)."], ["Choose a template", "Or start blank."], ["Make it yours", "Photos, text, colours, logo."], ["Share or download", "Share directly on mobile, or download PNG/JPG."]],
    tips: "<h2>Instagram design basics</h2><p>Portrait posts (1080×1350) take up more of the feed than squares. Keep text away from the bottom of Stories and Reel covers, where buttons and captions appear; Postly's safe zones show you where.</p>",
    faqs: [["What size is an Instagram post?", "1080×1080 (square) or 1080×1350 (portrait). Stories and Reels are 1080×1920."], ["Can I make carousel posts?", "Yes. Use the carousel builder to design across 3–5 slides and download them separately."], ["Can I share directly to Instagram?", "On most phones, yes: tap Share and pick Instagram."]]
  },
  {
    slug: "eid-card-maker", tool: "eid", icon: "fa-solid fa-moon",
    title: "Free Eid Mubarak Card & Post Maker (Urdu + English)",
    h1: "Eid Mubarak Card Maker",
    lead: "Make beautiful Eid ul Fitr and Eid ul Adha greetings, Ramadan posts and Jumma Mubarak designs with Urdu and English text, Islamic arches, crescents and gold styles. Free, in your browser.",
    keywords: "eid card maker, eid mubarak card, eid mubarak post, ramadan post maker, jumma mubarak design, eid greeting card urdu",
    templates: ["x-eid-fitr", "x-eid-adha", "x-ramadan-kareem", "x-jumma", "x-eid-sale", "x-iftar-deal"],
    features: [
      ["fa-solid fa-language", "Urdu & English fonts", "Noto Nastaliq Urdu and Amiri for beautiful Urdu and Arabic text."],
      ["fa-solid fa-mosque", "Islamic designs", "Arches, crescents, stars and gold-on-green styles."],
      ["fa-solid fa-mobile-screen", "WhatsApp status size", "Ready 1080×1920 designs for status and Stories."],
      ["fa-solid fa-tags", "Eid sale posts", "Templates for Eid collections, deals and iftar offers."],
      ["fa-solid fa-image", "AI images", "Create a custom Eid scene from a short description."],
      ["fa-solid fa-share-nodes", "Share instantly", "Send to WhatsApp family groups straight from your phone."]
    ],
    steps: [["Pick an Eid template", "Eid ul Fitr, Eid ul Adha, Ramadan or Jumma."], ["Add your names or shop name", "Edit any Urdu or English text."], ["Choose colours", "Gold, green, navy or your brand colours."], ["Share", "Download or share to WhatsApp."]],
    tips: "<h2>Ideas for Eid designs</h2><p>Personal greetings work best with family names and a short dua. For businesses, combine the greeting with your logo and an Eid offer, and post it a few days before Eid as well as on the day.</p>",
    faqs: [["Can I write in Urdu?", "Yes. Urdu text is typed right-to-left with Nastaliq fonts."], ["Is there a WhatsApp status size?", "Yes, 1080×1920 templates are included."], ["Is it free?", "Yes, with no watermark."]]
  },
  {
    slug: "wedding-card-maker", tool: "wedding", icon: "fa-solid fa-heart",
    title: "Free Wedding Card Maker: Shaadi, Mehndi, Walima Invitations",
    h1: "Wedding Invitation Card Maker",
    lead: "Design elegant shaadi, nikah, mehndi, barat and walima invitations with Urdu and English text. Print them or send digital invites on WhatsApp.",
    keywords: "wedding card maker, shaadi card design, wedding invitation maker, mehndi card, walima invitation, nikah card",
    templates: ["x-shaadi-card", "x-mehndi", "x-walima", "x-barat", "x-nikah", "x-save-the-date"],
    features: [
      ["fa-solid fa-ring", "Every event", "Nikah, mehndi, barat, walima, engagement and save-the-date."],
      ["fa-solid fa-language", "Urdu & English", "Bismillah headers and bilingual details."],
      ["fa-solid fa-print", "Print-ready", "High-resolution PNG and PDF for printing, or order prints from us."],
      ["fa-brands fa-whatsapp", "Digital invites", "Share as an image on WhatsApp."],
      ["fa-solid fa-palette", "Elegant styles", "Cream and gold, maroon and gold, green mehndi."],
      ["fa-solid fa-layer-group", "Matching set", "Make all event cards in one project as pages."]
    ],
    steps: [["Choose the event", "Pick a template."], ["Add names, date and venue", "Edit the text in Urdu or English."], ["Make the set", "Duplicate pages for each function."], ["Print or share", "Download PDF, order prints, or share on WhatsApp."]],
    tips: "<h2>Wedding card checklist</h2><p>Include the names of both families, date, time, venue with city, and an RSVP number. Keep fonts to two at most. For printing, download the PDF and confirm the paper size with your printer.</p>",
    faqs: [["Can I print the cards?", "Yes. Download a PDF, or use \"Order prints\" to get them printed through us."], ["Can I make cards for all events?", "Yes. Add each event as a page and download them together."], ["Is it free?", "Yes."]]
  },
  {
    slug: "flyer-maker", tool: "flyer", icon: "fa-solid fa-file-image",
    title: "Free Flyer & Poster Maker for Small Businesses",
    h1: "Flyer & Poster Maker",
    lead: "Make flyers and posters for sales, admissions, grand openings, events and services. A4 print-ready designs with QR codes, then download a PDF or order prints.",
    keywords: "flyer maker, poster maker, free flyer design, admission flyer, sale flyer, event poster maker",
    templates: ["x-admissions", "x-grand-opening", "x-free-camp", "x-plots-booking", "x-webinar", "x-hiring"],
    features: [
      ["fa-solid fa-file-pdf", "Print-ready PDF", "A4 and custom sizes, multi-page PDF."],
      ["fa-solid fa-qrcode", "QR codes", "Add a WhatsApp or website QR to every flyer."],
      ["fa-solid fa-table-cells-large", "Business templates", "Admissions, clinics, real estate, salons, gyms and more."],
      ["fa-solid fa-print", "Order prints", "Send your design to us for printing on WhatsApp."],
      ["fa-solid fa-swatchbook", "Brand kit", "Your logo and colours in one click."],
      ["fa-solid fa-share-nodes", "Share online too", "Post the same flyer on WhatsApp and Facebook."]
    ],
    steps: [["Pick a flyer template", "Or start with an A4 page."], ["Add your details", "Offer, contact, QR code, map."], ["Check it", "Zoom in to proofread."], ["Download PDF or order prints", "Ready for any printer."]],
    tips: "<h2>Flyers that get responses</h2><p>One headline, one offer, one call to action. Put your phone number and a QR code where they are easy to find, and keep at least 5 mm of space from the edges for printing.</p>",
    faqs: [["What size is A4 in pixels?", "Postly uses 1240×1754 for A4 at 150 DPI, which prints sharply for most flyers."], ["Can I get it printed?", "Yes. Use \"Order prints\" and we confirm the price on WhatsApp."], ["Is it free?", "Yes."]]
  },
  {
    slug: "restaurant-menu-maker", tool: "menu", icon: "fa-solid fa-utensils",
    title: "Free Restaurant Menu Maker with QR Code",
    h1: "Restaurant & Cafe Menu Maker",
    lead: "Create restaurant and cafe menus, deal posters and price lists. Add a QR code for online orders on WhatsApp, and download for print or sharing.",
    keywords: "menu maker, restaurant menu maker, cafe menu design, menu card maker, price list maker, qr code menu",
    templates: ["x-restaurant-menu", "x-cafe-menu", "x-burger-deal", "x-pizza-offer", "x-iftar-deal", "x-salon-price"],
    features: [
      ["fa-solid fa-list", "Menu layouts", "Dotted price lists that stay aligned."],
      ["fa-solid fa-qrcode", "Order QR code", "Customers scan to order on WhatsApp."],
      ["fa-solid fa-burger", "Deal posters", "Burger, pizza, iftar and combo deal templates."],
      ["fa-solid fa-layer-group", "Multi-page menus", "Add pages for each section and download one PDF."],
      ["fa-solid fa-image", "Food photos", "Free photos or your own."],
      ["fa-solid fa-print", "Print or share", "PDF for print, PNG for WhatsApp and Instagram."]
    ],
    steps: [["Pick a menu template", "Restaurant, cafe or deal poster."], ["Edit items and prices", "Each row has a name and a price."], ["Add a QR code", "WhatsApp ordering in one scan."], ["Download", "PDF for print, PNG for social."]],
    tips: "<h2>Menu design tips</h2><p>Group items into clear sections, keep prices aligned on the right, and highlight two or three best-sellers. Update prices in Postly and re-download; no need to redesign.</p>",
    faqs: [["Can I make a multi-page menu?", "Yes. Add pages and download one PDF."], ["Can customers order with a QR code?", "Yes. Add a WhatsApp QR code with a pre-filled order message."], ["Is it free?", "Yes."]]
  },
  {
    slug: "business-card-maker", tool: "card", icon: "fa-solid fa-address-card",
    title: "Free Business Card Maker (Visiting Card Design)",
    h1: "Business Card Maker",
    lead: "Design professional visiting cards with your logo, contact details and a QR code. Download print-ready files or order printing.",
    keywords: "business card maker, visiting card design, free business card maker, visiting card online, qr code business card",
    templates: ["x-card-dark", "x-card-blue", "x-card-green", "x-card-gold"],
    features: [
      ["fa-solid fa-id-card", "Card templates", "Clean, modern designs for any profession."],
      ["fa-solid fa-qrcode", "QR code", "Link to WhatsApp, your website or your portfolio."],
      ["fa-solid fa-swatchbook", "Your branding", "Logo, colours and fonts from your brand kit."],
      ["fa-solid fa-file-pdf", "Print-ready", "High-resolution PNG and PDF."],
      ["fa-solid fa-print", "Order prints", "Get 500 or 1,000 cards printed through us."],
      ["fa-solid fa-copy", "Front and back", "Use two pages for both sides."]
    ],
    steps: [["Pick a card", "Choose a style."], ["Add your details", "Name, role, phone, email, address."], ["Add your logo and QR", "From your brand kit."], ["Download or order prints", "PDF for any printer."]],
    tips: "<h2>Business card essentials</h2><p>Name, role, one phone number, one email and your logo are enough. A QR code to WhatsApp or your website saves space. Keep text at least 3 mm from the edge.</p>",
    faqs: [["What size is a business card?", "Postly uses 1050×600 pixels (3.5×2 inches at 300 DPI)."], ["Can I make both sides?", "Yes. Add a second page for the back."], ["Is it free?", "Yes."]]
  },
  {
    slug: "ai-image-generator", tool: "aiimage", icon: "fa-solid fa-image",
    title: "Free AI Image Generator: Text to Image Online",
    h1: "AI Image Generator",
    lead: "Describe what you want and AI creates the image. Use it as a background, a product scene or an illustration, then add text and download. Free daily credits, no signup.",
    keywords: "ai image generator, text to image, free ai image generator, ai art generator, ai background generator",
    templates: ["x-eid-fitr", "th-react-nature", "ad-product-dark", "x-quote-dark"],
    features: [
      ["fa-solid fa-wand-magic-sparkles", "Text to image", "Photo, illustration, 3D, Islamic art, watercolour and flat styles."],
      ["fa-solid fa-panorama", "Backgrounds", "Set any result as your design background in one tap."],
      ["fa-solid fa-box-open", "Product scenes", "Put your product on an AI studio scene."],
      ["fa-solid fa-pen-nib", "AI writer", "Headlines, captions and hashtags to go with the image."],
      ["fa-solid fa-ruler-combined", "Right size", "Images match your design's shape automatically."],
      ["fa-solid fa-gift", "Free daily credits", "Use AI every day at no cost."]
    ],
    steps: [["Open AI → Text to image", "Pick a style."], ["Describe the image", "Subject, mood, colours, light."], ["Use it", "Add it to your design or set it as the background."], ["Add text and download", "Finish in the editor."]],
    tips: "<h2>Writing better prompts</h2><p>Describe the subject, the setting, the light and the style: \"a crescent moon over a white mosque, golden evening light, soft clouds, realistic photo\". Leave text out of the prompt and add it in Postly instead; AI images are bad at spelling.</p>",
    faqs: [["Is it free?", "Yes, with a free daily limit per visitor."], ["Can I use the images commercially?", "Check the terms of the AI provider for your use case; Postly does not add restrictions."], ["Why is there no text in my image?", "Add text in the editor; it stays sharp and editable."]]
  }
];
