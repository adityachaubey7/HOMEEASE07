/**
 * HomeEase seed catalog.
 * Shared by the React client (mock API) and the Express server (Mongo seed script),
 * so both sides agree on document shapes. Ids are stable strings; Mongo will keep
 * them in a `slug`/`code` field alongside its own ObjectId.
 */

export const cities = [
  { id: 'delhi-ncr', name: 'Delhi NCR', areas: ['Saket', 'Vasant Kunj', 'Dwarka', 'Gurugram Sec 54', 'Noida Sec 62', 'Rohini'] },
  { id: 'mumbai', name: 'Mumbai', areas: ['Andheri West', 'Bandra', 'Powai', 'Thane', 'Chembur'] },
  { id: 'bengaluru', name: 'Bengaluru', areas: ['Indiranagar', 'HSR Layout', 'Whitefield', 'Koramangala', 'Jayanagar'] },
  { id: 'hyderabad', name: 'Hyderabad', areas: ['Gachibowli', 'Banjara Hills', 'Kondapur', 'Madhapur'] },
  { id: 'pune', name: 'Pune', areas: ['Baner', 'Kothrud', 'Viman Nagar', 'Hinjewadi'] },
  { id: 'chennai', name: 'Chennai', areas: ['Adyar', 'Anna Nagar', 'Velachery', 'OMR'] },
];

export const categories = [
  {
    id: 'cleaning', name: 'Home cleaning', short: 'Cleaning', icon: 'spray', tone: 'mint',
    tagline: 'Deep cleaning with machines, eco-safe chemicals and a 3-step quality check.',
    rating: 4.81, bookings: 2.4e6, earliest: 'Today, 2:00 PM', group: 'home',
    sections: [
      { id: 'full-home', title: 'Full home' },
      { id: 'bathroom-kitchen', title: 'Bathroom & kitchen' },
      { id: 'furniture', title: 'Sofa & carpet' },
    ],
  },
  {
    id: 'ac-appliances', name: 'AC & appliance repair', short: 'AC & appliances', icon: 'snow', tone: 'sky',
    tagline: 'Service, gas refill and repair with genuine spares and a 30-day warranty.',
    rating: 4.77, bookings: 3.1e6, earliest: 'Today, 4:00 PM', group: 'repair',
    sections: [
      { id: 'ac-service', title: 'AC service' },
      { id: 'ac-repair', title: 'AC repair & gas' },
      { id: 'appliances', title: 'Other appliances' },
    ],
  },
  {
    id: 'electrician', name: 'Electrician', short: 'Electrician', icon: 'bolt', tone: 'sun',
    tagline: 'Fans, switches, lights and wiring fixed by licensed electricians.',
    rating: 4.79, bookings: 1.6e6, earliest: 'Today, 1:30 PM', group: 'repair',
    sections: [
      { id: 'fans-lights', title: 'Fans & lights' },
      { id: 'switches-wiring', title: 'Switches & wiring' },
    ],
  },
  {
    id: 'plumber', name: 'Plumber', short: 'Plumber', icon: 'tap', tone: 'sky',
    tagline: 'Leaks, blockages and fittings sorted on the first visit.',
    rating: 4.76, bookings: 1.3e6, earliest: 'Today, 1:00 PM', group: 'repair',
    sections: [
      { id: 'taps-leaks', title: 'Taps & leaks' },
      { id: 'drains-toilets', title: 'Drains & toilets' },
    ],
  },
  {
    id: 'carpenter', name: 'Carpenter', short: 'Carpenter', icon: 'saw', tone: 'clay',
    tagline: 'Furniture assembly, door and hinge repairs, shelves and custom fittings.',
    rating: 4.74, bookings: 7.8e5, earliest: 'Tomorrow, 9:00 AM', group: 'repair',
    sections: [
      { id: 'assembly', title: 'Furniture assembly' },
      { id: 'doors-fittings', title: 'Doors & fittings' },
    ],
  },
  {
    id: 'painting', name: 'Painting & waterproofing', short: 'Painting', icon: 'roller', tone: 'rose',
    tagline: 'Supervised painting with furniture covering, fixed timelines and cleanup.',
    rating: 4.72, bookings: 2.1e5, earliest: 'Tomorrow, 10:00 AM', group: 'home',
    sections: [
      { id: 'rooms', title: 'Rooms & walls' },
      { id: 'waterproofing', title: 'Waterproofing' },
    ],
  },
  {
    id: 'pest-control', name: 'Pest control', short: 'Pest control', icon: 'bug', tone: 'leaf',
    tagline: 'Odourless, child-safe treatments with a free follow-up visit.',
    rating: 4.75, bookings: 6.4e5, earliest: 'Tomorrow, 8:00 AM', group: 'home',
    sections: [
      { id: 'general', title: 'Cockroach & ants' },
      { id: 'specialised', title: 'Termite & bed bugs' },
    ],
  },
  {
    id: 'salon-women', name: 'Salon for women', short: 'Salon for women', icon: 'comb', tone: 'rose',
    tagline: 'Waxing, facials and mani-pedi with single-use kits and branded products.',
    rating: 4.85, bookings: 5.2e6, earliest: 'Today, 3:00 PM', group: 'beauty',
    sections: [
      { id: 'waxing', title: 'Waxing' },
      { id: 'facials', title: 'Facials & cleanups' },
      { id: 'mani-pedi', title: 'Manicure & pedicure' },
    ],
  },
  {
    id: 'mens-grooming', name: 'Grooming for men', short: 'Men’s grooming', icon: 'razor', tone: 'clay',
    tagline: 'Haircuts, beard styling and massages without the salon queue.',
    rating: 4.82, bookings: 2.9e6, earliest: 'Today, 2:30 PM', group: 'beauty',
    sections: [
      { id: 'hair-beard', title: 'Haircut & beard' },
      { id: 'massage', title: 'Massage' },
    ],
  },
];

const s = (id, categoryId, sectionId, name, price, mrp, durationMins, rating, reviewCount, includes, extra = {}) => ({
  id, categoryId, sectionId, name, price, mrp, durationMins, rating, reviewCount, includes, ...extra,
});

export const services = [
  // Cleaning
  s('full-home-deep', 'cleaning', 'full-home', 'Full home deep cleaning (2 BHK)', 4599, 5499, 360, 4.83, 182000,
    ['Floors scrubbed with a rotary machine', 'Kitchen degreasing incl. cabinet exteriors', 'Bathrooms descaled and disinfected', 'Windows, grills and fans wiped'],
    { popular: true, perUnit: '₹2,300 per BHK', excludes: ['Wall washing', 'Inside of appliances'] }),
  s('full-home-3bhk', 'cleaning', 'full-home', 'Full home deep cleaning (3 BHK)', 5999, 7299, 420, 4.82, 96000,
    ['Everything in the 2 BHK clean', 'Team of 3 professionals', 'Balcony and utility area included'], { perUnit: '₹2,000 per BHK' }),
  s('move-in-clean', 'cleaning', 'full-home', 'Move-in / move-out cleaning', 3999, 4499, 300, 4.78, 41000,
    ['Empty-home deep clean', 'Cupboards cleaned inside and out', 'Paint and cement stain removal']),
  s('bathroom-clean', 'cleaning', 'bathroom-kitchen', 'Intense bathroom cleaning', 499, 599, 75, 4.81, 412000,
    ['Hard-water stain removal on tiles and fittings', 'Toilet, sink and drain disinfection', 'Exhaust fan and mirror wipe'], { popular: true }),
  s('kitchen-clean', 'cleaning', 'bathroom-kitchen', 'Kitchen deep cleaning', 1499, 1799, 180, 4.79, 133000,
    ['Chimney exterior and hob degreasing', 'Cabinets cleaned inside', 'Tiles, slab and sink descaled']),
  s('sofa-clean', 'cleaning', 'furniture', 'Sofa shampooing (5 seats)', 899, 1099, 90, 4.84, 228000,
    ['Dry vacuum to lift dust and hair', 'Shampoo and wet extraction', 'Dries in 4–6 hours'], { perUnit: '₹180 per seat' }),
  s('carpet-clean', 'cleaning', 'furniture', 'Carpet deep cleaning', 649, 799, 60, 4.77, 52000,
    ['Up to 50 sq ft', 'Foam shampoo and extraction', 'Stain pre-treatment']),

  // AC & appliances
  s('ac-foam-jet', 'ac-appliances', 'ac-service', 'Foam-jet AC service', 599, 699, 60, 4.76, 3000000,
    ['Indoor unit deep clean with foam and jet spray', 'Outdoor unit rinse', 'Drain pipe and tray cleared', 'Cooling check before and after'],
    { popular: true, perUnit: 'Split or window', excludes: ['Gas refill', 'Spare parts'] }),
  s('ac-foam-jet-2', 'ac-appliances', 'ac-service', 'Foam-jet AC service (2 ACs)', 1098, 1398, 120, 4.76, 3000000,
    ['Same service for two units', 'One visit, one professional'], { perUnit: '₹549 per AC' }),
  s('ac-repair', 'ac-appliances', 'ac-repair', 'AC check-up & repair', 299, 349, 45, 4.73, 873000,
    ['Diagnosis of cooling, noise or leakage issues', 'Written quote before any repair', 'Visit fee adjusted in the final bill']),
  s('ac-gas', 'ac-appliances', 'ac-repair', 'Gas leak fix & refill', 2999, 3299, 150, 4.77, 111000,
    ['Leak test with nitrogen', 'Brazing of leak points', 'Refill by weight', 'Pressure and temperature check']),
  s('washer-repair', 'ac-appliances', 'appliances', 'Washing machine repair', 299, 349, 60, 4.71, 264000,
    ['Front & top load', 'Drum, motor and board diagnosis', 'Quote before repair']),
  s('fridge-repair', 'ac-appliances', 'appliances', 'Refrigerator repair', 299, 349, 60, 4.72, 198000,
    ['Single & double door', 'Cooling and compressor check', 'Quote before repair']),
  s('ro-service', 'ac-appliances', 'appliances', 'Water purifier service', 449, 549, 45, 4.74, 156000,
    ['Filter and membrane check', 'TDS test before and after', 'Tank sanitisation']),

  // Electrician
  s('fan-install', 'electrician', 'fans-lights', 'Ceiling fan installation', 149, 199, 30, 4.81, 312000,
    ['Fitting with existing hook', 'Regulator connection', 'Balance check'], { popular: true }),
  s('fan-repair', 'electrician', 'fans-lights', 'Fan repair (slow / noisy)', 179, 229, 40, 4.77, 141000,
    ['Capacitor and bearing check', 'Parts charged at fixed rates']),
  s('light-install', 'electrician', 'fans-lights', 'Light & chandelier installation', 199, 249, 45, 4.8, 88000,
    ['Up to 3 light points', 'Chandelier under 10 kg']),
  s('switchboard', 'electrician', 'switches-wiring', 'Switchboard repair', 99, 129, 20, 4.78, 254000,
    ['Switch or socket replacement', 'Loose connection fix']),
  s('mcb', 'electrician', 'switches-wiring', 'MCB / fuse replacement', 249, 299, 30, 4.76, 47000,
    ['Fault tracing', 'MCB fitting (part extra)']),
  s('inverter', 'electrician', 'switches-wiring', 'Inverter installation', 449, 549, 60, 4.74, 39000,
    ['Battery and inverter wiring', 'Load test']),

  // Plumber
  s('tap-repair', 'plumber', 'taps-leaks', 'Tap repair or replacement', 129, 169, 30, 4.77, 286000,
    ['Leaking or loose taps', 'Washer and spindle replacement'], { popular: true }),
  s('pipe-leak', 'plumber', 'taps-leaks', 'Pipe leakage fix', 249, 299, 45, 4.74, 102000,
    ['Visible pipe leaks', 'Joint sealing and clamps']),
  s('basin-install', 'plumber', 'taps-leaks', 'Wash basin installation', 499, 599, 60, 4.76, 33000,
    ['Fixing and sealing', 'Waste pipe connection']),
  s('drain-block', 'plumber', 'drains-toilets', 'Drain blockage removal', 199, 249, 40, 4.75, 174000,
    ['Machine-assisted unclogging', 'Kitchen, bathroom or balcony drains']),
  s('flush-repair', 'plumber', 'drains-toilets', 'Flush tank repair', 249, 299, 40, 4.73, 81000,
    ['Running or weak flush', 'Internal fittings replaced (parts extra)']),

  // Carpenter
  s('bed-assembly', 'carpenter', 'assembly', 'Bed assembly', 599, 699, 90, 4.78, 64000,
    ['Single, queen or king', 'Hydraulic beds included'], { popular: true }),
  s('wardrobe-assembly', 'carpenter', 'assembly', 'Wardrobe assembly', 899, 999, 120, 4.75, 38000,
    ['Up to 3 doors', 'Leveling and door alignment']),
  s('door-repair', 'carpenter', 'doors-fittings', 'Door repair', 249, 299, 45, 4.73, 71000,
    ['Hinges, handles and alignment', 'Jammed or sagging doors']),
  s('curtain-rod', 'carpenter', 'doors-fittings', 'Curtain rod installation', 199, 249, 30, 4.79, 112000,
    ['Up to 2 rods', 'Drilling and anchoring']),
  s('shelf-install', 'carpenter', 'doors-fittings', 'Wall shelf installation', 149, 199, 30, 4.77, 57000,
    ['Up to 3 shelves', 'Level-checked fixing']),

  // Painting
  s('room-paint', 'painting', 'rooms', 'Room painting (1 room)', 6499, 7499, 1440, 4.72, 48000,
    ['Up to 400 sq ft wall area', 'Putty touch-up and 2 coats', 'Furniture covered and moved back', 'Site supervisor on day one'], { popular: true }),
  s('full-home-paint', 'painting', 'rooms', 'Full home painting consultation', 0, 0, 45, 4.74, 26000,
    ['Free site visit and colour advice', 'Fixed quote with timeline', 'Pay only when you book'], { quote: true }),
  s('texture-wall', 'painting', 'rooms', 'Accent / texture wall', 3499, 3999, 480, 4.7, 9100,
    ['One wall up to 120 sq ft', 'Choice of 40 textures']),
  s('roof-waterproof', 'painting', 'waterproofing', 'Terrace waterproofing', 0, 0, 60, 4.69, 6800,
    ['Moisture inspection', 'Quote by area', '5-year warranty on coating'], { quote: true }),
  s('bathroom-waterproof', 'painting', 'waterproofing', 'Bathroom leakage treatment', 2499, 2999, 240, 4.68, 7400,
    ['Grout and joint sealing', 'Chemical injection (no tile breaking)']),

  // Pest control
  s('cockroach', 'pest-control', 'general', 'Cockroach & ant control', 999, 1199, 60, 4.76, 301000,
    ['Odourless gel treatment', 'Kitchen, bathrooms and drains', 'Free follow-up within 30 days'], { popular: true, perUnit: 'For a 2 BHK' }),
  s('mosquito', 'pest-control', 'general', 'Mosquito & fly control', 799, 949, 45, 4.71, 58000,
    ['Indoor fogging', 'Larvicide in water points']),
  s('termite', 'pest-control', 'specialised', 'Termite treatment', 2999, 3499, 180, 4.72, 44000,
    ['Drill-fill-seal method', '1-year warranty']),
  s('bedbugs', 'pest-control', 'specialised', 'Bed bug control', 1599, 1899, 90, 4.7, 37000,
    ['Two treatments, 14 days apart', 'Mattress and furniture joints']),

  // Salon women
  s('wax-full', 'salon-women', 'waxing', 'Full arms + full legs (Rica)', 799, 899, 60, 4.86, 1200000,
    ['Rica roll-on wax', 'Underarms included', 'Single-use spatulas and strips'], { popular: true }),
  s('wax-face', 'salon-women', 'waxing', 'Face waxing', 249, 299, 20, 4.83, 410000,
    ['Upper lip, chin and sides', 'Peel-off wax']),
  s('facial-glow', 'salon-women', 'facials', 'Hydra glow facial', 1499, 1799, 75, 4.85, 320000,
    ['Cleanse, exfoliate, extract', 'Hydrating serum and mask', 'Suitable for all skin types']),
  s('cleanup', 'salon-women', 'facials', 'Express cleanup', 599, 699, 40, 4.82, 210000,
    ['Cleanse, scrub and pack', 'Ideal before an event']),
  s('mani-pedi', 'salon-women', 'mani-pedi', 'Classic mani-pedi', 999, 1199, 90, 4.84, 280000,
    ['Soak, scrub and massage', 'Cuticle care', 'Nail paint of your choice']),

  // Men's grooming
  s('haircut-men', 'mens-grooming', 'hair-beard', 'Haircut', 299, 349, 30, 4.83, 1700000,
    ['Wash, cut and style', 'Disposable cape and towel'], { popular: true }),
  s('haircut-beard', 'mens-grooming', 'hair-beard', 'Haircut + beard styling', 449, 499, 45, 4.84, 980000,
    ['Haircut', 'Beard trim and shape-up', 'Hot towel finish']),
  s('kids-haircut', 'mens-grooming', 'hair-beard', 'Kids haircut (under 12)', 199, 249, 25, 4.8, 210000,
    ['Patient, kid-friendly professionals']),
  s('massage-men', 'mens-grooming', 'massage', 'Deep tissue massage (60 min)', 1299, 1499, 60, 4.81, 340000,
    ['Full body', 'Choice of oil', 'Massage table brought along']),
  s('head-massage', 'mens-grooming', 'massage', 'Head & shoulder massage', 399, 449, 30, 4.79, 120000,
    ['Warm oil head massage', 'Neck and shoulder release']),
];

export const professionals = [
  { id: 'pro-ravi', name: 'Ravi Kumar', categoryIds: ['ac-appliances'], rating: 4.92, jobs: 3420, years: 9, area: 'South Delhi', languages: ['Hindi', 'English'], tone: 'sky',
    bio: 'AC specialist trained on split and inverter units from all major brands. Known for clear quotes and tidy work areas.',
    skills: ['Inverter AC diagnosis', 'Gas leak brazing', 'Foam-jet servicing'], badges: ['Top rated', 'Background verified', 'Vaccinated'] },
  { id: 'pro-sunita', name: 'Sunita Sharma', categoryIds: ['cleaning'], rating: 4.95, jobs: 2180, years: 7, area: 'Dwarka', languages: ['Hindi'], tone: 'mint',
    bio: 'Leads a three-person deep-cleaning team. Every job ends with a room-by-room walkthrough with the customer.',
    skills: ['Machine floor scrubbing', 'Kitchen degreasing', 'Hard-water stain removal'], badges: ['Top rated', 'Background verified', 'Team lead'] },
  { id: 'pro-imran', name: 'Imran Qureshi', categoryIds: ['plumber'], rating: 4.88, jobs: 2950, years: 11, area: 'Noida', languages: ['Hindi', 'Urdu'], tone: 'sky',
    bio: 'Plumber with a decade of residential experience. Carries a drain machine and common spares to finish most jobs in one visit.',
    skills: ['Concealed leak tracing', 'Drain machine', 'Sanitary fittings'], badges: ['Background verified', 'Fast arrival'] },
  { id: 'pro-anil', name: 'Anil Verma', categoryIds: ['electrician'], rating: 4.9, jobs: 3810, years: 12, area: 'Gurugram', languages: ['Hindi', 'English'], tone: 'sun',
    bio: 'Licensed electrician. Methodical about safety: mains off, tested twice, and every connection insulated.',
    skills: ['Fan and light fitting', 'MCB and DB work', 'Inverter wiring'], badges: ['Top rated', 'Licensed', 'Background verified'] },
  { id: 'pro-meena', name: 'Meena Joshi', categoryIds: ['salon-women'], rating: 4.96, jobs: 4120, years: 8, area: 'Vasant Kunj', languages: ['Hindi', 'English'], tone: 'rose',
    bio: 'Certified beautician with a gentle hand for waxing and facials. Uses only sealed, single-use kits.',
    skills: ['Rica waxing', 'Hydra facials', 'Bridal prep'], badges: ['Top rated', 'Certified', 'Background verified'] },
  { id: 'pro-harish', name: 'Harish Rawat', categoryIds: ['carpenter'], rating: 4.86, jobs: 1640, years: 14, area: 'Rohini', languages: ['Hindi'], tone: 'clay',
    bio: 'Furniture assembly and repair for flat-pack and solid wood. Brings his own drill, levels and fixings.',
    skills: ['Flat-pack assembly', 'Door alignment', 'Wall mounting'], badges: ['Background verified', 'Own tools'] },
  { id: 'pro-farhan', name: 'Farhan Ali', categoryIds: ['mens-grooming'], rating: 4.91, jobs: 2870, years: 6, area: 'Saket', languages: ['Hindi', 'English'], tone: 'clay',
    bio: 'Barber trained in classic and modern cuts. Sets up a clean station with disposable capes on every visit.',
    skills: ['Fades and tapers', 'Beard sculpting', 'Head massage'], badges: ['Top rated', 'Background verified'] },
  { id: 'pro-deepak', name: 'Deepak Singh', categoryIds: ['painting'], rating: 4.84, jobs: 610, years: 15, area: 'Delhi NCR', languages: ['Hindi'], tone: 'rose',
    bio: 'Painting supervisor who plans each room, covers furniture properly and checks every coat before sign-off.',
    skills: ['Putty and primer prep', 'Texture finishes', 'Waterproofing'], badges: ['Supervisor', 'Background verified'] },
  { id: 'pro-kavya', name: 'Kavya Nair', categoryIds: ['pest-control'], rating: 4.87, jobs: 1290, years: 5, area: 'Dwarka', languages: ['English', 'Hindi', 'Malayalam'], tone: 'leaf',
    bio: 'Trained in integrated pest management with government-approved, odourless chemicals.',
    skills: ['Gel baiting', 'Termite drill-fill', 'Bed bug treatment'], badges: ['Certified', 'Background verified'] },
  { id: 'pro-pooja', name: 'Pooja Rana', categoryIds: ['cleaning'], rating: 4.89, jobs: 1520, years: 4, area: 'Saket', languages: ['Hindi'], tone: 'mint',
    bio: 'Specialist in bathroom and kitchen deep cleans. Patient with tough limescale and grease.',
    skills: ['Descaling', 'Chimney exterior cleaning', 'Sofa shampooing'], badges: ['Background verified'] },
];

export const reviews = [
  { id: 'r1', categoryId: 'ac-appliances', proId: 'pro-ravi', serviceId: 'ac-foam-jet', author: 'Nikhil M.', area: 'Saket', rating: 5, date: '2026-10-06', text: 'Ravi covered the wall and floor before starting, showed me the dirty water from the coil, and the AC is noticeably colder now.' },
  { id: 'r2', categoryId: 'ac-appliances', proId: 'pro-ravi', serviceId: 'ac-gas', author: 'Aditi R.', area: 'Vasant Kunj', rating: 5, date: '2026-10-02', text: 'Found the leak in the outdoor unit in ten minutes. Price was exactly what the app showed.' },
  { id: 'r3', categoryId: 'ac-appliances', proId: 'pro-ravi', serviceId: 'ac-repair', author: 'Mohit K.', area: 'Malviya Nagar', rating: 4, date: '2026-09-27', text: 'Good diagnosis and honest quote. Arrived 15 minutes late but called ahead.' },
  { id: 'r4', categoryId: 'cleaning', proId: 'pro-sunita', serviceId: 'full-home-deep', author: 'Shreya P.', area: 'Dwarka', rating: 5, date: '2026-10-07', text: 'Kitchen tiles look new. The team walked me through every room at the end and redid one window I pointed out.' },
  { id: 'r5', categoryId: 'cleaning', proId: 'pro-pooja', serviceId: 'bathroom-clean', author: 'Rahul D.', area: 'Saket', rating: 5, date: '2026-10-04', text: 'Hard-water stains I had given up on are gone. Took about 70 minutes.' },
  { id: 'r6', categoryId: 'cleaning', proId: 'pro-sunita', serviceId: 'sofa-clean', author: 'Fatima S.', area: 'Okhla', rating: 4, date: '2026-09-30', text: 'Sofa came out clean, though it took most of the day to dry. Worth it.' },
  { id: 'r7', categoryId: 'plumber', proId: 'pro-imran', serviceId: 'drain-block', author: 'Karan V.', area: 'Noida Sec 62', rating: 5, date: '2026-10-05', text: 'Kitchen drain had been blocked for a week. Fixed in 20 minutes with a machine, no mess.' },
  { id: 'r8', categoryId: 'electrician', proId: 'pro-anil', serviceId: 'fan-install', author: 'Ananya G.', area: 'Gurugram Sec 54', rating: 5, date: '2026-10-08', text: 'Installed two fans and fixed a loose switch for free. Very careful with safety.' },
  { id: 'r9', categoryId: 'salon-women', proId: 'pro-meena', serviceId: 'wax-full', author: 'Priya T.', area: 'Vasant Kunj', rating: 5, date: '2026-10-06', text: 'Hygienic and quick. Everything was opened from sealed packs in front of me.' },
  { id: 'r10', categoryId: 'salon-women', proId: 'pro-meena', serviceId: 'facial-glow', author: 'Sana K.', area: 'Saket', rating: 5, date: '2026-09-29', text: 'Booked her again for the third time. My skin felt great for days.' },
  { id: 'r11', categoryId: 'mens-grooming', proId: 'pro-farhan', serviceId: 'haircut-beard', author: 'Arjun B.', area: 'Saket', rating: 5, date: '2026-10-03', text: 'Better fade than my usual salon, and no waiting. Cleaned up every hair afterwards.' },
  { id: 'r12', categoryId: 'carpenter', proId: 'pro-harish', serviceId: 'bed-assembly', author: 'Vivek N.', area: 'Rohini', rating: 5, date: '2026-10-01', text: 'Assembled a hydraulic king bed solo in just over an hour. Rock solid.' },
  { id: 'r13', categoryId: 'painting', proId: 'pro-deepak', serviceId: 'room-paint', author: 'Meera J.', area: 'Dwarka', rating: 4, date: '2026-09-25', text: 'Finish is excellent and they kept to the 2-day timeline. Small paint spot on the switchboard, cleaned when I asked.' },
  { id: 'r14', categoryId: 'pest-control', proId: 'pro-kavya', serviceId: 'cockroach', author: 'Rohan C.', area: 'Dwarka', rating: 5, date: '2026-10-04', text: 'No smell at all and we have not seen a cockroach since. Follow-up visit already scheduled.' },
  { id: 'r15', categoryId: 'electrician', proId: 'pro-anil', serviceId: 'mcb', author: 'Ishita L.', area: 'Gurugram', rating: 4, date: '2026-09-22', text: 'Traced a tripping MCB to a faulty geyser point. Clear explanation.' },
  { id: 'r16', categoryId: 'plumber', proId: 'pro-imran', serviceId: 'tap-repair', author: 'Neha A.', area: 'Noida', rating: 5, date: '2026-09-28', text: 'Replaced three taps and checked the others without being asked.' },
];

export const faqs = {
  common: [
    { q: 'Are HomeEase professionals verified?', a: 'Every professional passes ID and address verification, a police background check and a skills test before their first job. You can see their rating, jobs completed and reviews before the visit.' },
    { q: 'What is HomeEase Cover?', a: 'Every booking includes up to ₹10,000 of damage protection and a free revisit if something isn’t right within the warranty period for that service.' },
    { q: 'Can I reschedule or cancel?', a: 'Yes. Rescheduling is free any time. Cancelling is free until 3 hours before your slot; after that a ₹100 fee goes to the professional for their travel.' },
    { q: 'Do I pay before or after the service?', a: 'Your choice. Pay online when you book, or pay the professional by UPI or card after the job is done.' },
  ],
  'ac-appliances': [
    { q: 'Is gas refill included in the AC service?', a: 'No. Servicing cleans the unit and checks pressure. If gas is low, the professional will show you the reading and quote the refill separately.' },
    { q: 'Are spare parts extra?', a: 'Yes, at fixed rates published in the app. Nothing is replaced without your approval.' },
  ],
  cleaning: [
    { q: 'Do I need to provide anything?', a: 'Only water and electricity. The team brings machines, chemicals, ladders and cloths.' },
    { q: 'How long does a full home clean take?', a: 'About 6 hours for a 2 BHK with a team of two to three professionals.' },
  ],
};

export const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export const coupons = [
  { code: 'EASE100', label: '₹100 off on orders above ₹999', minOrder: 999, flat: 100 },
  { code: 'FIRST15', label: '15% off your first booking, up to ₹250', minOrder: 0, pct: 15, maxOff: 250 },
];

/** Rooms used by the "Shop by room" explorer. */
export const rooms = [
  { id: 'kitchen', name: 'Kitchen', serviceIds: ['kitchen-clean', 'drain-block', 'cockroach', 'ro-service', 'fridge-repair'] },
  { id: 'living', name: 'Living room', serviceIds: ['sofa-clean', 'fan-install', 'room-paint', 'curtain-rod', 'ac-foam-jet'] },
  { id: 'bathroom', name: 'Bathroom', serviceIds: ['bathroom-clean', 'tap-repair', 'flush-repair', 'bathroom-waterproof'] },
  { id: 'bedroom', name: 'Bedroom', serviceIds: ['ac-foam-jet', 'bed-assembly', 'wardrobe-assembly', 'light-install', 'bedbugs'] },
];
