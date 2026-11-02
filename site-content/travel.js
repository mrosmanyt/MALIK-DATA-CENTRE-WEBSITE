/* ==========================================================================
   MALIK TOURS: travel & tourism packages and services (by MALIK DATA CENTRE)
   Every tour gets its own page at /travel/<slug>/ and a card on /travel/.
   Bookings and questions go to WhatsApp +92 348 9057646.

   To change a price or add a tour: edit this file, then run  node build-pages.js
   Photos come from Pexels (free to use): put the photo's number in `photo`.
   ========================================================================== */

const STD_EXCLUDED = "Any service, meal, activity, entrance fee, transport, personal expense or item not listed as included is not part of the package and may cost extra.";

const TOURS = [
  {
    slug: "azerbaijan-baku-group-tour",
    title: "Azerbaijan Group Tour: Baku, 4 Nights / 5 Days",
    short: "Azerbaijan (Baku) Group Tour",
    category: "single",
    countries: ["Azerbaijan"],
    cities: ["Baku"],
    price: 250000,
    duration: "4 Nights / 5 Days",
    stays: [["Azerbaijan (Baku)", "4 Nights / 5 Days"]],
    departure: "25 November 2026",
    group: "Group tour",
    photo: 8964358, photoAlt: "Baku skyline with the Flame Towers",
    intro: "A 5-day group tour of Baku, the capital of Azerbaijan, departing on 25 November 2026. Late November brings cool weather and smaller crowds, a good time to explore the old city, the Caspian seafront and the Flame Towers. The tour includes a guided Baku city tour with free time to explore, shop and eat, and travel with a friendly group with expert guidance.",
    included: ["Azerbaijan visa", "Return air tickets", "4 nights hotel accommodation", "Daily breakfast", "Baku city tour", "Airport transfers (arrival and departure)"],
    excluded: ["Lunches and dinners", "Optional tours (Gobustan, Absheron Peninsula, Shahdag, Gabala) unless booked separately", "Entry tickets to attractions not in the itinerary", "Personal expenses, shopping, tips and laundry", "Travel insurance", "Extra baggage or services not listed"],
    keywords: "azerbaijan tour package from pakistan, baku group tour, baku tour november 2026, azerbaijan visa and tour"
  },
  {
    slug: "uzbekistan-luxury-tour-4-days",
    title: "4 Days Luxury Uzbekistan Tour with Visa & Flights",
    short: "Uzbekistan Luxury Tour (4 Days)",
    category: "single",
    countries: ["Uzbekistan"],
    cities: ["Tashkent"],
    price: 170000,
    duration: "3 Nights / 4 Days",
    stays: [["Uzbekistan", "3 Nights / 4 Days"]],
    departure: "Last week of November",
    group: "Group tour",
    photo: 32037572, photoAlt: "Historic madrasa with blue tiles in Bukhara, Uzbekistan",
    intro: "A complete, hassle-free Uzbekistan holiday at a special price: golden domes, turquoise tiles and Silk Road heritage. Late November brings crisp autumn weather and fall colours, ideal for sightseeing and photography. Visa, flights, hotel and a guided Tashkent city tour are included. Seats are limited.",
    included: ["Uzbekistan visa processing", "Return air ticket from Pakistan", "Hotel accommodation for the full stay", "Daily breakfast", "Guided city tour of Tashkent", "Airport pick and drop"],
    excluded: [STD_EXCLUDED],
    keywords: "uzbekistan tour package from pakistan, tashkent tour, uzbekistan visa and flights, 4 days uzbekistan tour"
  },
  {
    slug: "uzbekistan-tashkent-samarkand-bukhara",
    title: "Uzbekistan Group Tour: Tashkent, Samarkand & Bukhara",
    short: "Uzbekistan: Tashkent, Samarkand & Bukhara",
    category: "single",
    countries: ["Uzbekistan"],
    cities: ["Tashkent", "Samarkand", "Bukhara"],
    price: 200000,
    duration: "Ask for dates",
    stays: [["Uzbekistan", "Tashkent, Samarkand & Bukhara"]],
    departure: "Ask on WhatsApp for the next departure",
    group: "40 to 60 people",
    photo: 19473641, photoAlt: "Historic madrasa in Uzbekistan",
    intro: "Explore the Silk Road cities of Uzbekistan: modern Tashkent, the blue-tiled squares of Samarkand and the old town of Bukhara. A fully arranged group tour with visa, return tickets, a 4-star hotel with breakfast, airport transfers and a Tashkent city tour.",
    included: ["Visa", "Return ticket", "4-star hotel with breakfast", "Airport transfers", "City tour of Tashkent"],
    excluded: [STD_EXCLUDED],
    keywords: "uzbekistan tour package, tashkent samarkand bukhara tour, uzbekistan group tour from pakistan"
  },
  {
    slug: "sri-lanka-thailand-combo-tour",
    title: "Sri Lanka & Thailand Combo Group Tour",
    short: "Sri Lanka & Thailand Combo",
    category: "two",
    countries: ["Sri Lanka", "Thailand"],
    cities: ["Colombo (transit)", "Bangkok", "Pattaya"],
    price: 410000,
    duration: "Thailand 3 Nights / 4 Days",
    stays: [["Sri Lanka", "Transit"], ["Thailand", "3 Nights / 4 Days"]],
    departure: "Ask on WhatsApp for the next departure",
    group: "40 to 60 people",
    photo: 31017817, photoAlt: "Street scene in downtown Bangkok, Thailand",
    intro: "A two-country group tour from Pakistan: transit through Colombo, Sri Lanka, then Bangkok and Pattaya in Thailand. Visas, round-trip tickets, 4-star hotels with breakfast, airport transfers and a Thailand city tour are included.",
    included: ["Visas", "Round-trip tickets", "4-star hotels", "Breakfast", "Airport transfers", "City tour in Thailand"],
    excluded: [STD_EXCLUDED],
    keywords: "sri lanka thailand tour package from pakistan, bangkok pattaya group tour, thailand tour package"
  },
  {
    slug: "sri-lanka-thailand-malaysia-tour",
    title: "Sri Lanka, Thailand & Malaysia Grand Asia Group Tour",
    short: "Sri Lanka, Thailand & Malaysia",
    category: "three",
    countries: ["Sri Lanka", "Thailand", "Malaysia"],
    cities: ["Colombo", "Bangkok", "Pattaya", "Kuala Lumpur", "Genting Highlands"],
    price: 510000,
    duration: "Thailand 4–5 Days + Malaysia 4 Days",
    stays: [["Sri Lanka", "Transit"], ["Thailand", "4 or 5 Days"], ["Malaysia", "4 Days"]],
    departure: "Ask on WhatsApp for the next departure",
    group: "40 to 60 people",
    photo: 13029918, photoAlt: "Petronas Twin Towers in Kuala Lumpur, Malaysia",
    intro: "A three-country Grand Asia group tour: Sri Lanka in transit, 4 to 5 days in Thailand (Bangkok and Pattaya) and 4 days in Malaysia (Kuala Lumpur and Genting Highlands). Visas, round-trip tickets, 4-star hotels with breakfast, airport transfers and city tours in Thailand and Malaysia are included.",
    included: ["Visas", "Round-trip tickets", "4-star hotel with breakfast", "Airport transfers", "City tour in Thailand & Malaysia"],
    excluded: [STD_EXCLUDED],
    keywords: "sri lanka thailand malaysia tour package from pakistan, grand asia group tour 2026, kuala lumpur bangkok tour"
  },
  {
    slug: "grand-asia-4-countries-tour",
    title: "Sri Lanka, Thailand, Malaysia & Singapore Grand Group Tour",
    short: "Grand Asia: 4 Countries",
    category: "four",
    countries: ["Sri Lanka", "Thailand", "Malaysia", "Singapore"],
    cities: ["Colombo", "Bangkok", "Kuala Lumpur", "Genting Highlands", "Marina Bay", "Sentosa Island"],
    price: 650000,
    duration: "Thailand 4–5 + Malaysia 4 + Singapore 3 Days",
    stays: [["Sri Lanka", "Transit"], ["Thailand", "4 to 5 Days"], ["Malaysia", "4 Days"], ["Singapore", "3 Days"]],
    departure: "Ask on WhatsApp for the next departure",
    group: "40 to 60 people",
    photo: 37182570, photoAlt: "Merlion fountain and Singapore skyline",
    intro: "Our Grand Asia group tour across four countries: Sri Lanka in transit, Thailand, Malaysia and Singapore, from Bangkok to Kuala Lumpur, Genting Highlands, Marina Bay and Sentosa Island. Visas, round-trip tickets, 4-star hotels with breakfast, airport transfers and city tours in Thailand, Malaysia and Singapore are included.",
    included: ["Visas", "Round-trip ticket", "4-star hotel with breakfast", "Airport transfers", "City tours in Thailand, Malaysia & Singapore"],
    excluded: [STD_EXCLUDED],
    keywords: "sri lanka thailand malaysia singapore tour package from pakistan, grand asia group tour, singapore tour package"
  },
  {
    slug: "grand-asia-luxury-5-countries-tour",
    title: "Sri Lanka, Thailand, Malaysia, Singapore & Maldives Grand Luxury Group Tour",
    short: "Grand Asia Luxury: 5 Countries with Maldives",
    category: "five",
    countries: ["Sri Lanka", "Thailand", "Malaysia", "Singapore", "Maldives"],
    cities: ["Colombo", "Bangkok", "Kuala Lumpur", "Singapore", "Maldives"],
    price: 750000,
    duration: "Thailand 4–5 + Malaysia 4 + Singapore 3 + Maldives 3 Days",
    stays: [["Sri Lanka", "Transit"], ["Thailand", "4 to 5 Days"], ["Malaysia", "4 Days"], ["Singapore", "3 Days"], ["Maldives", "3 Days"]],
    departure: "Ask on WhatsApp for the next departure",
    group: "40 to 60 people",
    photo: "/assets/tours/maldives-overwater-villas.webp", photoAlt: "Over-water villas in the Maldives",
    intro: "Our grand escorted circuit across five countries: Sri Lanka in transit, then Thailand, Malaysia, Singapore and 3 days in the Maldives. Visas, round-trip tickets, 4-star hotels with breakfast, airport transfers and city tours in Thailand, Malaysia and Singapore are included.",
    included: ["Visas", "Round-trip tickets", "4-star hotels with breakfast", "Airport transfers", "City tours in Thailand, Malaysia & Singapore"],
    excluded: [STD_EXCLUDED],
    keywords: "maldives tour package from pakistan, sri lanka thailand malaysia singapore maldives tour, grand asia luxury group tour 2026"
  }
];

const CATEGORIES = [
  { id: "single", label: "Single Country Tours", tag: "One destination, fully escorted" },
  { id: "two", label: "Two Countries Tours", tag: "Two nations, one itinerary" },
  { id: "three", label: "Three Countries Tours", tag: "A longer regional circuit" },
  { id: "four", label: "Four Countries Tours", tag: "Multi-country group departure" },
  { id: "five", label: "Five Countries Tours", tag: "The grand escorted circuit" }
];

const SERVICES = [
  {
    slug: "visit-visa-consultancy",
    title: "Visit Visa Consultancy (All Countries)",
    short: "Visit Visas",
    icon: "fa-solid fa-passport",
    photo: 7876786, photoAlt: "Passport and travel documents",
    intro: "We prepare visit visa files from Pakistan for the UK, USA, Canada, Australia, Schengen countries, Japan, the Gulf and popular tourist destinations: from profile assessment and a country-specific checklist to the application form, appointment and a pre-interview briefing.",
    sections: [
      ["Countries we cover", [
        "United Kingdom: standard visitor, family and business visits",
        "United States: B1/B2 visitor visa (5-year multiple entry)",
        "Schengen / Europe: France, Italy, Germany, Spain, Netherlands and other Schengen states",
        "Canada (validity depends on your passport validity) and Australia",
        "Gulf / Middle East: UAE, Saudi Arabia, Qatar, Oman (fast processing guidance)",
        "Turkey, Azerbaijan, Malaysia, Thailand, Georgia and Japan (visit, e-visa or sticker visa support)"
      ]],
      ["What's included", [
        "Profile assessment of travel history, funds, employment and purpose",
        "Country-specific document checklist",
        "Cover letter and invitation / sponsorship review",
        "Itinerary, hotel and ticket guidance, as the embassy requires",
        "Application form filling and appointment help",
        "Pre-interview briefing where interviews apply",
        "Follow-up until a decision is issued"
      ]],
      ["Documents you'll usually need", [
        "Passport and CNIC",
        "Bank statements and proof of funds",
        "Sponsorship letter or invitation (if any)",
        "Travel history and purpose of travel",
        "Proof of ties to Pakistan (job, business, family, property)",
        "Itinerary, hotel booking, flight reservation and travel insurance (for Schengen)"
      ]]
    ],
    steps: [["Profile assessment", "Tell us the country, travel dates and number of applicants."], ["Checklist", "We send your country-specific document checklist the same day."], ["File preparation", "Cover letter, sponsorship review, itinerary, hotel and ticket guidance."], ["Application", "Form filling and appointment booking."], ["Interview briefing", "Where an interview applies."], ["Follow-up", "We stay with you until a decision is issued."]],
    notes: ["No honest agency can guarantee a visa: the embassy decides. We make sure your file is complete and consistent.", "First-time applicants need stronger proof of funds and ties to Pakistan.", "Linked applications can be prepared for spouses, children and parents."]
  },
  {
    slug: "air-tickets",
    title: "International & Domestic Air Tickets",
    short: "Air Tickets",
    icon: "fa-solid fa-plane-departure",
    photo: 28555348, photoAlt: "Airplane wing above the clouds",
    intro: "Cheap international and domestic air tickets from Pakistan: one-way, return and multi-city, group blocks and Umrah-season seats, with fare comparison and after-sales help.",
    sections: [
      ["What we book", [
        "One-way, return and multi-city tickets",
        "Umrah and Hajj-season seats",
        "Group blocks for 10+ passengers",
        "Infant / child fares and student discounts, where airlines allow",
        "Domestic legs (ISB–KHI, ISB–LHE, northern connections) to join international departures"
      ]],
      ["Our service", [
        "Fare comparison and date-change advice",
        "We check connection times, baggage, visa-on-arrival rules and change penalties before you pay",
        "For visa cases: a reservation for your file first, then a confirmed ticket after approval",
        "After-sales help with date changes, cancellations and re-issues",
        "Corporate and group clients: one invoice, passenger list control and a dedicated coordinator"
      ]]
    ],
    steps: [["Send your trip", "Destination, dates and number of passengers on WhatsApp."], ["Get live fares", "We reply with the best options and fare rules."], ["Book & pay", "We issue your e-ticket after payment."]],
    notes: []
  },
  {
    slug: "hotel-booking",
    title: "International Hotel Booking",
    short: "Hotel Booking",
    icon: "fa-solid fa-hotel",
    photo: 2017802, photoAlt: "Hotel room with a sea view",
    intro: "Hotel bookings from Pakistan for Azerbaijan, Turkey, Malaysia & Singapore, Thailand, Saudi Arabia (Makkah and Madinah), UAE, UK, Europe, Maldives, Sri Lanka and more, with confirmed vouchers.",
    sections: [
      ["What's included", [
        "Confirmed hotel vouchers",
        "Breakfast, as contracted with the hotel",
        "Twin, double, triple and quad family rooms, connecting rooms, sea-view or city-view rooms",
        "4-star and 5-star group allotments, family suites and group bookings",
        "Hotel names, nights and addresses kept consistent across your visa file, e-ticket and voucher"
      ]],
      ["Good to know", [
        "For Umrah, hotels are chosen by distance to the Haram, not by looks.",
        "We send 2–3 options with breakfast details, location and the best available rate."
      ]]
    ],
    steps: [["Send your stay", "Destination, check-in and check-out dates and number of rooms."], ["Choose", "We send 2–3 hotel options with the best available rate."], ["Confirm", "Pay and receive your confirmed voucher."]],
    notes: []
  },
  {
    slug: "usa-visa-interview-preparation",
    title: "USA Visa Interview Preparation (B1/B2 Coaching)",
    short: "USA Interview Prep",
    icon: "fa-solid fa-user-tie",
    photo: 921259, photoAlt: "Desk prepared for an interview",
    intro: "One-to-one coaching for your US B1/B2 visa interview in Pakistan: a file review, a consulate-style mock interview and a question bank built for your profile. Sessions in Islamabad, Rawalpindi or online.",
    sections: [
      ["What's included", [
        "File review comparing your DS-160, documents and your story",
        "Personal mock interview in consulate style: standing, short answers and follow-up questions",
        "Question bank for your profile: first-time traveller, student, businessman or previous refusal",
        "Guidance on presenting your ties to Pakistan: job, business, family, property and return travel",
        "Consulate-day briefing: the Islamabad embassy process, what to bring and what to leave at home"
      ]],
      ["Who it's for", [
        "First-time applicants",
        "Applicants with a previous refusal",
        "Families (each adult is interviewed)",
        "Applicants whose sponsor lives in the USA"
      ]]
    ],
    steps: [["Message us", "Send your interview date and city on WhatsApp."], ["Get your list", "We send a pre-session document list."], ["Rehearse", "Your mock interview session, in person or online."]],
    notes: ["The goal is short, consistent answers, not memorised speeches.", "You are interviewed alone: no agent can attend the embassy interview.", "No one can guarantee approval: the consular officer decides."]
  },
  {
    slug: "azerbaijan-trc-investment",
    title: "Azerbaijan TRC & Investment Services",
    short: "Azerbaijan TRC",
    icon: "fa-solid fa-building-columns",
    photo: 15851838, photoAlt: "Flag of Azerbaijan on a building in Baku",
    intro: "Help for Pakistani clients planning a Temporary Residence Card (TRC), property purchase or business in Azerbaijan: the right visa, travel, hotel near your meetings and introductions to licensed local lawyers and property consultants.",
    sections: [
      ["What's included", [
        "An Azerbaijan visa suited to your purpose (visit visa or another category we advise)",
        "Return tickets and a 4-star hotel near your meetings",
        "Introductions to licensed local lawyers and property consultants (you contract them directly)",
        "Translation and a document checklist for your Pakistan-issued papers (CNIC, degrees, bank letters, company documents)",
        "Airport transfers and a Pakistan desk for follow-up"
      ]],
      ["About the TRC", [
        "A TRC is a residence permit tied to a legal basis such as work, family, study, entrepreneurship, or qualifying investment or property.",
        "TRC rules, document lists and investment thresholds change, so always check current Azerbaijani law.",
        "We do not sell a \"passport for cash\" product."
      ]]
    ],
    steps: [["Tell us your goal", "Residence, property or business: message us on WhatsApp."], ["Get a plan", "We outline the visa type, travel dates and a suggested Baku itinerary."], ["Travel & meet", "Visa, flights, hotel and meetings with licensed local professionals."]],
    notes: []
  },
  {
    slug: "business-registration-pakistan",
    title: "Business Registration in Pakistan (Company Formation)",
    short: "Business Registration",
    icon: "fa-solid fa-briefcase",
    photo: 15116664, photoAlt: "Business documents on a desk",
    intro: "Company formation made simple: sole proprietorship, partnership or private limited company registration in Pakistan, with trade-name reservation, filing support and NTN / tax registration guidance. For new entrepreneurs, overseas Pakistanis, travel and trading businesses and investors.",
    sections: [
      ["What's included", [
        "Structure guidance: sole proprietorship, partnership or private limited company",
        "Trade-name reservation and availability check",
        "Document checklist (CNIC, photos, letterhead, office address, digital signatures if required)",
        "Filing support with the relevant authority",
        "NTN / tax registration after incorporation",
        "Post-registration guidance, such as a bank account letter",
        "A handover pack with certificates, logins and next steps"
      ]],
      ["Good to know", [
        "Government fees are always separate and official, never hidden in our price.",
        "Business consultancy and startup advice are available too."
      ]]
    ],
    steps: [["Send the name & city", "Your proposed company name and city on WhatsApp."], ["Choose the structure", "We recommend a structure and send the document list."], ["Registration", "We file with you, then complete NTN / tax registration and hand everything over."]],
    notes: []
  }
];

const GROUP_INCLUDED = ["Return airfare", "Visa assistance", "Twin-sharing hotel rooms", "Daily breakfast", "Airport transfers", "Sightseeing as per itinerary", "A dedicated operations desk in Pakistan"];
const BOOKING_STEPS = [
  ["Choose a tour", "Pick a destination or a 2–5 country package below."],
  ["Confirm month & travellers", "Tell us your departure month and number of passengers on WhatsApp."],
  ["Lock your seats", "Pay the booking token to reserve your seats."],
  ["Send passport copies", "We start your visa and ticketing."],
  ["Get your joining kit", "Hotels, flight times, a packing list and emergency numbers."]
];
const FAQS = [
  ["Is the price per person?", "The price shown is the advertised package price. Message us on WhatsApp with your travel month, number of travellers and room sharing, and we will confirm the exact per-person price in writing before you pay."],
  ["What is usually included in a group tour?", "Return airfare, visa assistance, twin-sharing hotel rooms, daily breakfast, airport transfers and sightseeing as per the itinerary. Some tours add meals, theme-park tickets or cable cars, as listed on each tour page."],
  ["Can you arrange a private tour for my family?", "Yes. Seat-in-coach and private-group options are available for families of 8 or more. Tell us your dates and destination for a custom package."],
  ["Which documents do I need to book?", "Passport copies to start your visa and ticketing. For visit visas we send a country-specific checklist the same day."],
  ["How do I book?", "Choose a tour, message us on WhatsApp at +92 348 9057646, confirm your month and number of travellers, then pay the booking token to lock your seats."]
];

module.exports = { BRAND: "MALIK TOURS", WHATSAPP: "923489057646", PHONE: "+92 348 9057646", TOURS, CATEGORIES, SERVICES, GROUP_INCLUDED, BOOKING_STEPS, FAQS };
