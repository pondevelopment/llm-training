export interface ScenarioStep {
  id: number;
  title: string;
  icon: string;
  description: string;
  toolUsed?: string;
  toolIcon?: string;
  reasoning: string;
  dataReturned: string[];
  insights?: string[];
  duration: string;
}

// Scenario 1: Customer buying the right bike
export const buyingBikeScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Customer Needs',
    icon: '👤',
    description: 'Agent analyzes customer requirements and constraints',
    reasoning: 'Customer said: "I need a bike for my 30-minute commute, I\'m 5\'6", budget is $1200, and I need to carry a laptop." Agent must understand use case, body measurements, budget, and cargo needs.',
    dataReturned: [
      '📋 Customer profile:',
      '• Use case: Daily commuting (30 min each way)',
      '• Height: 5\'6" (need 52-54cm frame)',
      '• Budget: $1,200 maximum',
      '• Cargo: Must carry laptop safely',
      '• Priorities: Reliability, comfort, weatherproof'
    ],
    duration: '2s'
  },
  {
    id: 2,
    title: 'Search Product Catalog',
    icon: '🔍',
    toolUsed: 'Product Search API',
    toolIcon: '🔧',
    description: 'Agent queries product database with customer criteria',
    reasoning: 'Need bikes with commuter features: fender mounts, rack compatibility, appropriate frame size, within budget.',
    dataReturned: [
      '🔍 Found 8 matching bikes:',
      '• Trek FX 2 Disc - $849 (54cm) ✓',
      '• Specialized Sirrus 3.0 - $950 (S) ✓',
      '• Giant Escape 3 Disc - $750 (M) ✓',
      '• Cannondale Quick 4 - $825 (52cm) ✓',
      '• Liv Alight 2 Disc - $750 (S) ✓',
      '• Marin Fairfax 2 - $800 (54cm) ✓',
      '• Priority Continuum Onyx - $999 (M) ✓',
      '• Brooklyn Bicycle Co. Franklin - $675 (M) ✓'
    ],
    insights: ['8 bikes match budget', 'All have proper frame size', 'Price range: $675-$999'],
    duration: '3s'
  },
  {
    id: 3,
    title: 'Check Commuter Features',
    icon: '📊',
    toolUsed: 'Product Details API',
    toolIcon: '📊',
    description: 'Agent verifies essential commuter specifications',
    reasoning: 'Customer needs laptop carrying capability. Must check for rack mounts, fender mounts, and tire clearance for all-weather riding.',
    dataReturned: [
      '📊 Feature comparison:',
      '• Trek FX 2: Fender✓, Rack✓, 35mm tires, Disc brakes',
      '• Specialized Sirrus: Fender✓, Rack✓, 32mm tires, Disc brakes',
      '• Giant Escape: Fender✓, Rack✓, 38mm tires, Disc brakes',
      '• Cannondale Quick: Fender✓, Rack✓, 32mm tires, Disc brakes',
      '• Liv Alight: Fender✓, Rack✓, 35mm tires, Disc brakes',
      '• Marin Fairfax: Fender✓, Rack✓, 38mm tires, Disc brakes',
      '• Priority Continuum: Fender✓, Rack✓, 38mm tires, Belt drive!',
      '• Brooklyn Franklin: Fender✓, Rack✓, 35mm tires, Rim brakes ⚠️'
    ],
    insights: ['All bikes support rack/fenders', 'Priority has low-maintenance belt drive', 'Brooklyn has rim brakes (less ideal for rain)'],
    duration: '4s'
  },
  {
    id: 4,
    title: 'Check Local Availability',
    icon: '🏪',
    toolUsed: 'Inventory System',
    toolIcon: '📦',
    description: 'Agent checks which bikes are in stock nearby',
    reasoning: 'Customer wants to test ride before buying. Need to check local store inventory and availability.',
    dataReturned: [
      '🏪 Local stock (Amsterdam Central):',
      '• Trek FX 2 Disc (54cm): In stock ✅',
      '• Specialized Sirrus (S): In stock ✅',
      '• Giant Escape (M): Out of stock ❌',
      '• Cannondale Quick (52cm): In stock ✅',
      '• Liv Alight (S): In stock ✅',
      '• Marin Fairfax (54cm): Limited (1 left) ⚠️',
      '• Priority Continuum (M): Order only (5-7 days) ⏳',
      '• Brooklyn Franklin (M): In stock ✅'
    ],
    insights: ['5 bikes available for immediate test ride', 'Priority requires 5-7 day wait', 'Marin only 1 unit left'],
    duration: '3s'
  },
  {
    id: 5,
    title: 'Deliver Personalized Recommendation',
    icon: '✨',
    description: 'Agent synthesizes all data into tailored suggestions',
    reasoning: 'Combine features, budget, availability, and customer priorities to rank best options with clear reasoning.',
    dataReturned: [
      '🏆 Top 3 Recommendations for Your Commute:',
      '',
      '1️⃣ **Trek FX 2 Disc** - $849 ⭐ Best Overall',
      '   ✓ Perfect 54cm frame for 5\'6"',
      '   ✓ Wide 35mm tires (comfortable + puncture resistant)',
      '   ✓ Disc brakes (reliable in rain)',
      '   ✓ Rack mounts (add $45 rack for laptop pannier)',
      '   ✓ IN STOCK at Amsterdam Central - test ride today!',
      '   → Total with rack: $894 (well under budget)',
      '',
      '2️⃣ **Specialized Sirrus 3.0** - $950',
      '   ✓ Lightweight aluminum frame',
      '   ✓ Smooth-riding 32mm tires',
      '   ✓ Reliable Shimano components',
      '   ✓ IN STOCK - available now',
      '   → Slightly higher price, but premium feel',
      '',
      '3️⃣ **Priority Continuum Onyx** - $999 💡 Innovative',
      '   ✓ Belt drive = NO chain maintenance!',
      '   ✓ Internal gear hub (shifts while stopped)',
      '   ✓ Perfect for daily commuting',
      '   ⏳ 5-7 day delivery (worth the wait)',
      '   → Best long-term value (virtually maintenance-free)',
      '',
      '💡 **My Recommendation:**',
      'Start with the **Trek FX 2 Disc**. It hits all your needs,',
      'is $350 under budget, and you can test ride TODAY.',
      'Add a rear rack ($45) and weatherproof pannier ($65)',
      'for your laptop - total setup: $959.',
      '',
      '➡️ **Next Step:**',
      'Book test ride at Amsterdam Central (15 min slots available)',
      'Bring: Your usual commute bag to test fit with setup'
    ],
    duration: '2s'
  }
];

// Scenario 2: Product Comparison Workflow
export const productComparisonScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Receive Comparison Request',
    icon: '🎯',
    description: 'User needs to compare bikes for their specific needs',
    reasoning: 'User asked: "Compare women\'s road bikes under $2000 for a 5\'4" commuter." Agent needs to search products, filter by criteria, and compare specs.',
    dataReturned: [
      '📋 Requirements identified:',
      '• Category: Women\'s road bikes',
      '• Budget: Under $2000',
      '• Height: 5\'4" (need 48-50cm frame)',
      '• Use case: Commuting (need fenders, lights compatibility)'
    ],
    duration: '2s'
  },
  {
    id: 2,
    title: 'Search Product Database',
    icon: '🛍️',
    toolUsed: 'Product Search API',
    toolIcon: '🛍️',
    description: 'Agent queries product database with filters',
    reasoning: 'Need to find bikes that match the specific criteria: women\'s geometry, price range, and frame size.',
    dataReturned: [
      '🚴 Found 6 matching bikes:',
      '• Trek Domane AL 2 Women\'s - $1,299 (50cm)',
      '• Specialized Dolce Elite - $1,499 (48cm)',
      '• Giant Avail AR 3 - $1,850 (XS)',
      '• Liv Avail 2 - $1,200 (XS)',
      '• Cannondale Synapse Disc - $1,599 (48cm)',
      '• Bianchi Via Nirone - $1,750 (50cm)'
    ],
    insights: ['6 bikes match criteria', 'Price range: $1,200-$1,850', 'All have appropriate frame sizes'],
    duration: '3s'
  },
  {
    id: 3,
    title: 'Get Detailed Specifications',
    icon: '📊',
    toolUsed: 'Product Details API',
    toolIcon: '📊',
    description: 'Agent fetches full specs for comparison',
    reasoning: 'User needs commuter features. Must check: geometry (stack/reach), fender mounts, rack compatibility, tire clearance.',
    dataReturned: [
      '🔍 Detailed specs retrieved:',
      '• Trek Domane: Stack 563mm, Reach 368mm, Fender✓, Rack✓, 32mm tires',
      '• Specialized Dolce: Stack 571mm, Reach 365mm, Fender✓, Rack✗, 28mm tires',
      '• Giant Avail: Stack 558mm, Reach 370mm, Fender✓, Rack✓, 32mm tires',
      '• Liv Avail 2: Stack 558mm, Reach 370mm, Fender✓, Rack✓, 35mm tires',
      '• Cannondale Synapse: Stack 568mm, Reach 367mm, Fender✓, Rack✓, 35mm tires',
      '• Bianchi Via Nirone: Stack 560mm, Reach 372mm, Fender✓, Rack✗, 28mm tires'
    ],
    insights: ['4 bikes have rack mounts', 'Liv & Cannondale have widest tire clearance', 'All have fender mounts'],
    duration: '4s'
  },
  {
    id: 4,
    title: 'Check Reviews & Ratings',
    icon: '⭐',
    toolUsed: 'Review Aggregator',
    toolIcon: '⭐',
    description: 'Agent aggregates user reviews for real-world feedback',
    reasoning: 'Specs are important, but real user experiences matter for commuting reliability.',
    dataReturned: [
      '⭐ Review summary (4+ stars only):',
      '• Trek Domane: 4.6★ (89 reviews) - "Comfortable, reliable"',
      '• Specialized Dolce: 4.3★ (45 reviews) - "Good value"',
      '• Giant Avail: 4.7★ (102 reviews) - "Best for price"',
      '• Liv Avail 2: 4.8★ (156 reviews) - "Perfect commuter setup"',
      '• Cannondale Synapse: 4.5★ (78 reviews) - "Smooth ride"',
      '• Bianchi Via Nirone: 4.2★ (34 reviews) - "Stylish, but firm"'
    ],
    insights: ['Liv Avail 2 has highest rating', 'Giant Avail best value rating', 'Bianchi has fewer reviews'],
    duration: '3s'
  },
  {
    id: 5,
    title: 'Generate Comparison Table',
    icon: '✨',
    description: 'Agent synthesizes all data into actionable recommendation',
    reasoning: 'Combine specs, compatibility, reviews, and price to rank bikes for this specific use case.',
    dataReturned: [
      '🏆 Top 3 Recommendations for 5\'4" Commuter:',
      '',
      '1️⃣ **Liv Avail 2** - $1,200 ⭐ Best Overall',
      '   ✓ Women\'s-specific geometry (Stack 558mm)',
      '   ✓ Rack & fender mounts',
      '   ✓ Wide tire clearance (35mm) for comfort',
      '   ✓ Highest rating (4.8★, 156 reviews)',
      '   ✓ Most affordable option',
      '',
      '2️⃣ **Cannondale Synapse Disc** - $1,599',
      '   ✓ Relaxed geometry (Stack 568mm) - very comfortable',
      '   ✓ Rack & fender mounts',
      '   ✓ Wide tire clearance (35mm)',
      '   ✓ Disc brakes for all-weather stopping',
      '',
      '3️⃣ **Trek Domane AL 2** - $1,299 ⭐ Runner-up',
      '   ✓ Endurance geometry (Stack 563mm)',
      '   ✓ Rack & fender mounts',
      '   ✓ Trek reliability & warranty',
      '   ✓ Good tire clearance (32mm)',
      '',
      '❌ Not Recommended:',
      '• Specialized Dolce: No rack mounts',
      '• Bianchi Via Nirone: No rack mounts, fewer reviews'
    ],
    duration: '2s'
  }
];

// Scenario 3: Booking Test Ride Workflow
export const bookingTestRideScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Test Ride Request',
    icon: '🚴',
    description: 'Customer wants to test ride specific bikes before buying',
    reasoning: 'Customer says: "I\'m interested in the Trek FX 2 Disc and Specialized Sirrus, can I test ride them this weekend in Amsterdam?" Need to understand preferences and constraints.',
    dataReturned: [
      '📝 Customer request details:',
      '• Bikes of interest: Trek FX 2 Disc, Specialized Sirrus',
      '• Location: Amsterdam area',
      '• Timeframe: This weekend (Sat/Sun)',
      '• Customer note: "First time buying, nervous about sizing"'
    ],
    duration: '1s'
  },
  {
    id: 2,
    title: 'Find Nearby Stores',
    icon: '📍',
    toolUsed: 'Store Locator',
    toolIcon: '🏪',
    description: 'Agent searches for stores with test ride programs',
    reasoning: 'Need to find stores within Amsterdam area that offer test rides and are open weekends.',
    dataReturned: [
      '🏪 Stores with test ride programs (Amsterdam):',
      '• **Amsterdam Central** - 2.1 km',
      '  📍 Stationsplein 12',
      '  🕐 Sat: 9am-6pm, Sun: 10am-5pm',
      '  ✅ Test ride program available',
      '',
      '• **Amsterdam West** - 4.3 km',
      '  📍 Kinkerstraat 89',
      '  🕐 Sat: 10am-6pm, Sun: Closed',
      '  ✅ Test ride program available',
      '',
      '• **Amsterdam Zuid** - 5.7 km',
      '  📍 Beethovenstraat 45',
      '  🕐 Sat: 9am-7pm, Sun: 11am-5pm',
      '  ✅ Test ride program available'
    ],
    insights: ['3 stores nearby', 'Central & Zuid open Sunday', 'West closed Sunday'],
    duration: '2s'
  },
  {
    id: 3,
    title: 'Check Bike Availability',
    icon: '🔍',
    toolUsed: 'Inventory System',
    toolIcon: '📦',
    description: 'Agent checks which stores have test bikes in stock',
    reasoning: 'Customer wants to test Trek FX 2 Disc and Specialized Sirrus. Need to verify which stores have demo bikes available.',
    dataReturned: [
      '🚲 Test bike availability:',
      '',
      '**Amsterdam Central:**',
      '• Trek FX 2 Disc (54cm demo) - ✅ Available',
      '• Specialized Sirrus (M demo) - ✅ Available',
      '• Both bikes in stock for test rides',
      '',
      '**Amsterdam Zuid:**',
      '• Trek FX 2 Disc (54cm demo) - ✅ Available',
      '• Specialized Sirrus (M demo) - ❌ Out on test ride',
      '• Only Trek available',
      '',
      '**Amsterdam West:**',
      '• Trek FX 2 Disc (54cm demo) - ❌ No demo',
      '• Specialized Sirrus (M demo) - ✅ Available',
      '• Only Specialized available'
    ],
    insights: ['Central has both bikes', 'Zuid has Trek only', 'West has Specialized only'],
    duration: '3s'
  },
  {
    id: 4,
    title: 'Check Appointment Slots',
    icon: '📅',
    toolUsed: 'Booking System',
    toolIcon: '📅',
    description: 'Agent checks available time slots at best store',
    reasoning: 'Amsterdam Central is best option (both bikes available, open both days). Check appointment availability.',
    dataReturned: [
      '📅 Available slots at Amsterdam Central:',
      '',
      '**Saturday:**',
      '• 10:00 AM - ✅ Available (Expert: Mike)',
      '• 11:00 AM - ❌ Booked',
      '• 1:00 PM - ✅ Available (Expert: Sarah)',
      '• 3:00 PM - ✅ Available (Expert: Mike)',
      '• 4:00 PM - ❌ Booked',
      '',
      '**Sunday:**',
      '• 11:00 AM - ✅ Available (Expert: Lisa)',
      '• 1:00 PM - ✅ Available (Expert: Tom)',
      '• 2:00 PM - ✅ Available (Expert: Lisa)',
      '• 3:00 PM - ✅ Available (Expert: Sarah)'
    ],
    insights: ['8 slots available', 'Saturday morning best', '4 bike experts on staff'],
    duration: '2s'
  },
  {
    id: 5,
    title: 'Book Appointment & Confirm',
    icon: '✅',
    description: 'Agent completes booking and sends confirmation',
    reasoning: 'Customer prefers Saturday morning. Book 10 AM slot at Central store with both bikes reserved. Send confirmation with prep tips.',
    dataReturned: [
      '✅ **Test Ride Booked!**',
      '',
      '📋 **Details:**',
      '• Date: Saturday, Jan 20',
      '• Time: 10:00 AM (60-minute session)',
      '• Location: Amsterdam Central',
      '  📍 Stationsplein 12, 1012 AB Amsterdam',
      '',
      '🚴 **Bikes Reserved:**',
      '• Trek FX 2 Disc (54cm) - $849',
      '• Specialized Sirrus (M) - $950',
      '',
      '👨‍🔧 **Bike Expert: Mike**',
      '• 8 years experience',
      '• Commuter bike specialist',
      '• Will help with sizing & fit',
      '',
      '📝 **What to bring:**',
      '• Comfortable clothes',
      '• Valid ID (required for test rides)',
      '• Your usual work bag/backpack (to test cargo)',
      '',
      '💡 **Pro tip:** We\'ll start with a sizing check, then ride both bikes on our 2km test loop. Feel free to ask any questions!',
      '',
      '📧 Confirmation sent to your email',
      '📲 SMS reminder 1 day before'
    ],
    duration: '2s'
  }
];

// Scenario 4: Getting Support & Warranty Workflow
export const gettingSupportScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Customer Issue',
    icon: '🔧',
    description: 'Customer has a problem with their recently purchased bike',
    reasoning: 'Customer says: "I bought a Trek FX 2 Disc 3 months ago and the rear brake is squeaking loudly. Is this covered by warranty?" Need to diagnose issue and check coverage.',
    dataReturned: [
      '📝 Customer issue details:',
      '• Bike: Trek FX 2 Disc',
      '• Purchase date: 3 months ago',
      '• Problem: Rear brake squeaking loudly',
      '• Question: Warranty coverage?',
      '• Customer concern: "Not sure if I did something wrong"'
    ],
    duration: '1s'
  },
  {
    id: 2,
    title: 'Search Knowledge Base',
    icon: '📚',
    toolUsed: 'Knowledge Base',
    toolIcon: '🔍',
    description: 'Agent searches for common brake issues and solutions',
    reasoning: 'Brake squeak is common. Check knowledge base for causes, fixes, and whether it\'s a warranty issue.',
    dataReturned: [
      '📚 Knowledge base results for "disc brake squeak":',
      '',
      '**Common Causes:**',
      '• Contaminated brake pads (oil, dirt, grease)',
      '• Glazed brake pads (from overheating)',
      '• Misaligned brake caliper',
      '• Rotor contamination',
      '• New pad break-in period',
      '',
      '**Quick Fixes:**',
      '• Clean rotor with isopropyl alcohol',
      '• Re-align brake caliper',
      '• Sand brake pads to remove glaze',
      '',
      '**Warranty Coverage:**',
      '• Defective brake components: ✅ Covered',
      '• Normal wear and tear: ❌ Not covered',
      '• Contamination from improper use: ❌ Not covered'
    ],
    insights: ['Usually fixable issue', 'May need inspection to determine cause', 'Warranty depends on root cause'],
    duration: '2s'
  },
  {
    id: 3,
    title: 'Check Warranty Status',
    icon: '🛡️',
    toolUsed: 'Warranty System',
    toolIcon: '🔧',
    description: 'Agent verifies customer purchase and warranty coverage',
    reasoning: 'Need to confirm purchase details, warranty period, and what\'s covered.',
    dataReturned: [
      '🛡️ Warranty information:',
      '',
      '**Purchase Details:**',
      '• Order #: 48291',
      '• Date: October 15, 2024',
      '• Product: Trek FX 2 Disc (54cm)',
      '• Store: Amsterdam Central',
      '',
      '**Warranty Coverage:**',
      '• Frame: 2 years ✅ Active',
      '• Components: 1 year ✅ Active',
      '• Brake system: 1 year ✅ Active',
      '• Normal wear parts: 30 days (expired)',
      '',
      '**Status:** Brake system covered until Oct 15, 2025',
      '**Note:** If issue is defective part, fully covered. If contamination/wear, may incur service fee.'
    ],
    insights: ['Still under warranty', 'Brake system covered', 'Diagnosis needed to determine coverage'],
    duration: '2s'
  },
  {
    id: 4,
    title: 'Find Nearest Service Center',
    icon: '🔧',
    toolUsed: 'Service Locator',
    toolIcon: '🔍',
    description: 'Agent finds authorized repair shops in customer area',
    reasoning: 'Customer purchased from Amsterdam Central. Find nearby service centers with availability.',
    dataReturned: [
      '🔧 Authorized service centers (Amsterdam):',
      '',
      '**Amsterdam Central (Original Store)**',
      '📍 Stationsplein 12',
      '📞 +31 20 123 4567',
      '🕐 Mon-Fri: 9am-7pm, Sat: 9am-6pm',
      '⚡ Next available: Tomorrow 2pm',
      '✅ Trek certified technician',
      '',
      '**Amsterdam Zuid Service Center**',
      '📍 Beethovenstraat 45',
      '📞 +31 20 765 4321',
      '🕐 Mon-Sat: 10am-6pm',
      '⚡ Next available: Today 4pm (same day!)',
      '✅ Trek certified technician',
      '',
      '**Bike Repair Express (Mobile)**',
      '🚐 Mobile service (comes to you)',
      '📞 +31 6 1234 5678',
      '⚡ Next available: Friday 10am',
      '⚠️ Not Trek certified (may affect warranty)'
    ],
    insights: ['Zuid has same-day availability', 'Central store tomorrow', 'Mobile service not certified'],
    duration: '3s'
  },
  {
    id: 5,
    title: 'Provide Solution & Book Service',
    icon: '✅',
    description: 'Agent delivers personalized solution and schedules appointment',
    reasoning: 'Zuid service center has same-day availability and Trek certified tech. Book appointment and provide guidance.',
    dataReturned: [
      '✅ **Here\'s Your Solution:**',
      '',
      '✅ **Good News:** Your brake system is still under warranty!',
      '',
      '**What Happens Next:**',
      '1. Trek certified technician will inspect your brakes',
      '2. If defective part: Free repair under warranty',
      '3. If contamination: Quick cleaning ($25) or pad replacement ($45)',
      '4. Typical repair time: 30-60 minutes',
      '',
      '✅ **Appointment Booked:**',
      '• Location: Amsterdam Zuid Service Center',
      '  📍 Beethovenstraat 45',
      '• Time: Today at 4:00 PM ⚡ Same day!',
      '• Technician: Hans (Trek certified, 12 years exp)',
      '',
      '📝 **What to Bring:**',
      '• Your bike',
      '• Order confirmation email (or just mention order #48291)',
      '• ID',
      '',
      '💡 **Pro Tip:** In the meantime, avoid using the rear brake if possible. The squeak won\'t damage anything, but contamination can spread.',
      '',
      '💰 **Cost Estimate:**',
      '• If warranty issue: $0',
      '• If needs cleaning: ~$25',
      '• If needs new pads: ~$45',
      '',
      '📧 Confirmation sent to your email',
      '📞 Service center will call if they finish earlier',
      '',
      '❓ **More Questions?** Reply anytime or call Hans directly at +31 20 765 4321'
    ],
    duration: '2s'
  }
];

// Scenario 5: Finding Perfect Accessories Workflow
export const findingAccessoriesScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Accessory Needs',
    icon: '🛍️',
    description: 'Customer just bought a bike and needs the right accessories',
    reasoning: 'Customer says: "I just bought the Trek FX 2 Disc for commuting. What accessories do I need to get started?" Need to understand use case and recommend compatible items.',
    dataReturned: [
      '📝 Customer context:',
      '• Bike: Trek FX 2 Disc (54cm)',
      '• Use case: Daily 30-min commute',
      '• Needs: Carry laptop, ride in all weather',
      '• Budget: "Whatever makes sense for safety and convenience"',
      '• First-time commuter'
    ],
    duration: '1s'
  },
  {
    id: 2,
    title: 'Search Compatible Products',
    icon: '🔍',
    toolUsed: 'Product Search API',
    toolIcon: '🔍',
    description: 'Agent finds accessories compatible with Trek FX 2 Disc',
    reasoning: 'Need to find items that fit this specific bike model and meet commuting needs (lights, rack, fenders, lock).',
    dataReturned: [
      '✅ Compatible accessories found:',
      '',
      '**Essential Safety:**',
      '• Kryptonite Evolution Mini-7 Lock - $70 ⭐ 4.7★',
      '• Bontrager Ion 200 Front Light - $45 ⭐ 4.6★',
      '• Bontrager Flare RT Rear Light - $60 ⭐ 4.8★',
      '',
      '**Weather Protection:**',
      '• Planet Bike Cascadia Fenders (700c) - $45 ✅ Fits perfectly',
      '• SKS Bluemels Fenders - $55 (premium option)',
      '',
      '**Cargo Solutions:**',
      '• Bontraker BackRack Disc (Trek-specific) - $55 ✅ Direct fit',
      '• Ortlieb Back-Roller Classic Pannier - $180 ⭐ Waterproof',
      '• Thule Pack \'n Pedal Pannier - $150 (budget option)',
      '',
      '**Nice to Have:**',
      '• Bell Drifter Helmet - $40',
      '• Trek Commuter Gloves - $25',
      '• Topeak Mini 20 Pro Tool - $35'
    ],
    insights: ['12 compatible products', 'Trek-specific rack for perfect fit', 'Waterproof pannier for laptop'],
    duration: '3s'
  },
  {
    id: 3,
    title: 'Check Customer Reviews',
    icon: '⭐',
    toolUsed: 'Review Aggregator',
    toolIcon: '⭐',
    description: 'Agent reads reviews from actual commuters',
    reasoning: 'Reviews reveal real-world performance for commuting use case.',
    dataReturned: [
      '⭐ Top-rated for commuters:',
      '',
      '**Kryptonite Evolution Mini-7** (4.7★, 2,340 reviews)',
      '💬 "Survived 3 years of NYC street parking"',
      '💬 "Small enough to carry, strong enough to trust"',
      '⚠️ "Cable sold separately for front wheel"',
      '',
      '**Bontrager Flare RT Rear Light** (4.8★, 1,890 reviews)',
      '💬 "Visible in broad daylight, amazing battery"',
      '💬 "ANT+ connectivity is awesome with Garmin"',
      '',
      '**Ortlieb Back-Roller Classic** (4.7★, 3,120 reviews)',
      '💬 "100% waterproof, laptop stayed dry in downpour"',
      '💬 "Easy on/off mounting, super reliable"',
      '💬 "Pricey but worth it - had mine 5 years"',
      '',
      '**Planet Bike Cascadia Fenders** (4.4★, 567 reviews)',
      '💬 "Good value, easy install on Trek FX"',
      '⚠️ "Rattled a bit until I tightened everything"'
    ],
    insights: ['Lock needs wheel cable', 'Rear light is customer favorite', 'Ortlieb worth the premium'],
    duration: '3s'
  },
  {
    id: 4,
    title: 'Check Availability & Pricing',
    icon: '💰',
    toolUsed: 'Inventory System',
    toolIcon: '🔍',
    description: 'Agent checks stock and calculates bundle discount',
    reasoning: 'Customer wants to get started quickly. Check Amsterdam Central inventory and see if bundle discount applies.',
    dataReturned: [
      '📦 Availability at Amsterdam Central:',
      '✅ All items in stock!',
      '',
      '💰 Pricing breakdown:',
      '• Kryptonite Lock + Cable: $70 + $15 = $85',
      '• Bontrager Front Light: $45',
      '• Bontrager Rear Light: $60',
      '• Planet Bike Fenders: $45',
      '• Bontrager Rack: $55',
      '• Ortlieb Pannier: $180',
      '• Bell Helmet: $40',
      '• Mini Tool: $35',
      '─────────────────────',
      '**Subtotal:** $545',
      '',
      '🎉 **Commuter Bundle Discount:**',
      '• Buy 5+ accessories: 15% off',
      '• Your discount: -$82',
      '─────────────────────',
      '**Total:** $463'
    ],
    insights: ['Everything in stock', '15% bundle savings', '$82 discount applied'],
    duration: '2s'
  },
  {
    id: 5,
    title: 'Recommend Personalized Bundle',
    icon: '✅',
    description: 'Agent delivers curated accessory package with setup tips',
    reasoning: 'Customer is first-time commuter. Prioritize safety and convenience. Recommend essential bundle plus optional upgrades.',
    dataReturned: [
      '✅ **Your Complete Commuter Setup:**',
      '',
      '🎯 **Essential Bundle** ($378 after discount)',
      'Everything you need to commute safely:',
      '',
      '🔒 **Security:**',
      '• Kryptonite Evolution Mini-7 + Cable: $85',
      '  → Locks frame & both wheels',
      '  → Rated "Gold" security level',
      '',
      '💡 **Visibility:**',
      '• Bontrager Ion 200 Front (200 lumens): $45',
      '• Bontrager Flare RT Rear (90 lumens): $60',
      '  → Rechargeable, 10+ hour battery',
      '  → Legally compliant for night riding',
      '',
      '☔ **Weather Protection:**',
      '• Planet Bike Cascadia Fenders: $45',
      '  → Keeps you & bike clean in rain',
      '  → Perfect fit for 700c wheels',
      '',
      '🎒 **Cargo:**',
      '• Bontraker BackRack Disc: $55',
      '• Ortlieb Back-Roller Classic: $180',
      '  → 100% waterproof for laptop',
      '  → 20L capacity (perfect for commute)',
      '  → Quick-release mounting',
      '',
      '➕ **Highly Recommended** (+$75)',
      '• Bell Drifter Helmet: $40',
      '• Topeak Mini Tool: $35',
      '',
      '💰 **Bundle Total:** $463 (save $82!)',
      '📍 **Pickup:** Amsterdam Central (in stock)',
      '🔧 **Free installation:** We\'ll mount everything for you',
      '⏱️ **Setup time:** 30 minutes',
      '',
      '💡 **Pro Tips:**',
      '1. We\'ll adjust lights to optimal angles',
      '2. Show you quick-release pannier technique',
      '3. Demonstrate proper lock positioning',
      '4. Test ride with full setup before you leave',
      '',
      '🎁 **Bonus:** Free waterproof phone mount ($25 value) with bundle purchase!',
      '',
      '📅 Ready to pick up? Book installation appointment or buy online.'
    ],
    duration: '2s'
  }
];

// Scenario 6: Getting Company Information Workflow
export const gettingCompanyInfoScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Customer Questions',
    icon: '❓',
    description: 'Customer has general questions about the store',
    reasoning: 'Customer asks: "What\'s your return policy? Also, are you open on Sundays? I might want to return something I bought last month." Multiple questions need answers.',
    dataReturned: [
      '📝 Customer questions identified:',
      '1. What is the return policy?',
      '2. What are the store hours (specifically Sundays)?',
      '3. Can they return a purchase from last month?',
      '',
      '🎯 Context clues:',
      '• Customer made purchase ~30 days ago',
      '• Wants to know Sunday availability',
      '• Uncertain about return eligibility'
    ],
    duration: '1s'
  },
  {
    id: 2,
    title: 'Search Return Policy',
    icon: '↩️',
    toolUsed: 'Knowledge Base',
    toolIcon: '🔍',
    description: 'Agent finds return policy details',
    reasoning: 'Need to provide accurate return policy including timeframe, conditions, and process.',
    dataReturned: [
      '↩️ Return Policy Details:',
      '',
      '**Return Window:**',
      '• Bikes: 30 days from purchase',
      '• Accessories: 60 days from purchase',
      '• E-bikes: 14 days (battery safety)',
      '',
      '**Conditions:**',
      '✅ Must have:',
      '• Original receipt or order number',
      '• Minimal use (light test riding OK)',
      '• All original packaging & parts',
      '• No damage or modifications',
      '',
      '❌ Non-returnable:',
      '• Custom-built bikes',
      '• Clearance/final sale items',
      '• Worn helmets (safety)',
      '• Items without tags/packaging',
      '',
      '**Refund Method:**',
      '• Full refund to original payment method',
      '• Processing time: 3-5 business days',
      '• Shipping costs non-refundable (online orders)'
    ],
    insights: ['30-day window for bikes', 'Must be minimal use', 'Need receipt/order number'],
    duration: '2s'
  },
  {
    id: 3,
    title: 'Check Store Hours',
    icon: '🔧',
    toolUsed: 'Store Information System',
    toolIcon: '🏪',
    description: 'Agent retrieves store hours for all locations',
    reasoning: 'Customer specifically asked about Sunday hours. Provide complete schedule.',
    dataReturned: [
      '🕒 Store Hours (All Locations):',
      '',
      '**Amsterdam Central**',
      '📍 Stationsplein 12',
      '• Mon-Fri: 9:00 AM - 7:00 PM',
      '• Saturday: 9:00 AM - 6:00 PM',
      '• Sunday: 10:00 AM - 5:00 PM ✅',
      '',
      '**Amsterdam West**',
      '📍 Kinkerstraat 89',
      '• Mon-Fri: 10:00 AM - 6:00 PM',
      '• Saturday: 10:00 AM - 6:00 PM',
      '• Sunday: Closed ❌',
      '',
      '**Amsterdam Zuid**',
      '📍 Beethovenstraat 45',
      '• Mon-Sat: 9:00 AM - 7:00 PM',
      '• Sunday: 11:00 AM - 5:00 PM ✅',
      '',
      '🎄 **Holiday Hours:**',
      '• Reduced hours on public holidays',
      '• Closed Dec 25-26, Jan 1'
    ],
    insights: ['Central & Zuid open Sundays', 'West closed Sundays', 'Central has longest hours'],
    duration: '2s'
  },
  {
    id: 4,
    title: 'Verify Purchase History',
    icon: '🔧',
    toolUsed: 'Order System',
    toolIcon: '🔍',
    description: 'Agent checks customer\'s recent purchases',
    reasoning: 'Customer mentioned purchase "last month." Need to verify if it\'s within return window and what was bought.',
    dataReturned: [
      '🔍 Recent purchase found:',
      '',
      '**Order #47823**',
      '• Date: December 15, 2024',
      '• Days ago: 28 days ✅ (within 30-day window)',
      '• Location: Amsterdam Central',
      '',
      '**Items purchased:**',
      '• Cannondale Quick 4 (M) - $825',
      '• Kryptonite Lock - $65',
      '• Bell Helmet - $40',
      '',
      '**Return eligibility:**',
      '• Bike: ✅ Eligible (2 days left in return window)',
      '• Lock: ✅ Eligible (accessories have 60-day window)',
      '• Helmet: ⚠️ Only if unused & sealed (safety item)',
      '',
      '**Next steps if returning:**',
      '• Bring bike & accessories to original store',
      '• Bring receipt/order confirmation',
      '• Staff will inspect condition',
      '• Refund processed same day if approved'
    ],
    insights: ['Still within return window', 'Only 2 days left for bike', 'Helmet must be unused'],
    duration: '3s'
  },
  {
    id: 5,
    title: 'Provide Complete Answer',
    icon: '✅',
    description: 'Agent delivers personalized response with all information',
    reasoning: 'Customer asked multiple questions. Provide comprehensive answer with specific details about their purchase and clear next steps.',
    dataReturned: [
      '✅ **Here\'s Everything You Need to Know:**',
      '',
      '↩️ **Your Return Status:**',
      '',
      '**Good news!** Your December 15th purchase is still eligible for return, but you need to act quickly:',
      '',
      '• Cannondale Quick 4: ✅ **Eligible until Jan 14** (2 days left!)',
      '• Kryptonite Lock: ✅ Eligible until Feb 13',
      '• Bell Helmet: ⚠️ Only if unused & in sealed packaging',
      '',
      '**What you need to bring:**',
      '• The bike & accessories',
      '• Your receipt or order #47823',
      '• Original packaging (if you have it)',
      '',
      '🕐 **Sunday Store Hours:**',
      '',
      '**Open this Sunday:**',
      '• Amsterdam Central: 10 AM - 5 PM ✅',
      '  📍 Stationsplein 12 (where you bought it)',
      '• Amsterdam Zuid: 11 AM - 5 PM ✅',
      '  📍 Beethovenstraat 45',
      '',
      '**Closed Sunday:**',
      '• Amsterdam West',
      '',
      '⚡ **Recommended Action Plan:**',
      '',
      'Since you only have 2 days left for the bike return:',
      '',
      '1. **This Sunday** (if possible):',
      '   → Visit Amsterdam Central: 10 AM - 5 PM',
      '   → Bring bike, receipt, and accessories',
      '   → Staff will inspect & process return',
      '   → Refund in 3-5 business days',
      '',
      '2. **Can\'t make Sunday?**',
      '   → Monday is your last day (open 9 AM - 7 PM)',
      '   → Call ahead to confirm: +31 20 123 4567',
      '',
      '💡 **Return Tips:**',
      '• Bike should show only light test riding wear',
      '• Clean it before bringing (shows care)',
      '• All parts must be present',
      '• Process typically takes 15-20 minutes',
      '',
      '❓ **Have Questions?**',
      '📞 Call Amsterdam Central: +31 20 123 4567',
      '📧 Email: returns@bikeshop.nl',
      '💬 Live chat available Mon-Sat',
      '',
      '🔄 **Exchange Instead?**',
      'If you want a different bike instead of a refund, we can do an exchange on the spot with no time pressure on the accessories!'
    ],
    duration: '2s'
  }
];

// Scenario 7: Agentic Travel Booking (A2A)
export const travelBookingScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Receive User Intent',
    icon: '🗣️',
    description: 'User asks: "Book my usual trip to London for next Tuesday, but find a hotel with a gym."',
    reasoning: 'Agent identifies "usual trip" (London, Tuesday), infers preferences from history (BA flight, morning departure), and notes new constraint (Hotel Gym).',
    dataReturned: [
      '📋 Intent Parsed:',
      '• Destination: London (LHR)',
      '• Date: Next Tuesday',
      '• Airline Pref: British Airways (from history)',
      '• Hotel Pref: Gym required (new constraint)',
      '• Budget: Corporate policy limit'
    ],
    duration: '0.5s'
  },
  {
    id: 2,
    title: 'Agent-to-Agent Discovery',
    icon: '📡',
    toolUsed: 'A2A Protocol Discovery',
    toolIcon: '🌐',
    description: 'User Agent broadcasts intent to Airline and Hotel Agents via A2A protocol.',
    reasoning: 'Instead of searching websites, the agent pings the BA Agent and Marriott/Hilton Agents directly for real-time availability and personalized offers.',
    dataReturned: [
      '📡 A2A Responses:',
      '• BA Agent: "Flight BA123 available at 08:00. Price: £450. Status: Confirmed."',
      '• Marriott Agent: "No gym availability at usual hotel."',
      '• Hilton Agent: "Room with Gym available. Price: £200. Corporate rate applied."'
    ],
    duration: '1.2s'
  },
  {
    id: 3,
    title: 'Negotiation & Selection',
    icon: '🤝',
    toolUsed: 'Negotiation Module',
    toolIcon: '⚖️',
    description: 'Agents negotiate terms. User Agent selects best combination.',
    reasoning: 'Marriott is out (no gym). Hilton is selected. BA flight is confirmed. Agent checks if bundle discount applies.',
    dataReturned: [
      '✅ Selection Made:',
      '• Flight: BA123 (08:00)',
      '• Hotel: Hilton Metropole (Gym confirmed)',
      '• Total Cost: £650 (within policy)',
      '• Auth Token: Generated for payment'
    ],
    duration: '0.8s'
  },
  {
    id: 4,
    title: 'Execution & Payment (AP2)',
    icon: '💳',
    toolUsed: 'Agent Payment Protocol (AP2)',
    toolIcon: '🔐',
    description: 'User Agent executes payment using authorized wallet.',
    reasoning: 'Payment is processed directly between agents using AP2 protocol. No credit card form filling required.',
    dataReturned: [
      '🎉 Transaction Complete:',
      '• Booking Ref: #XYZ123',
      '• Receipt: Emailed to finance',
      '• Calendar: Updated',
      '• User Notified: "Trip booked. Flight at 8am, Hilton hotel."'
    ],
    duration: '1.5s'
  }
];

// Export all scenarios with metadata
export interface ScenarioMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: ScenarioStep[];
  traceMap?: Record<string, number[]>;
}

export const allScenarios: ScenarioMeta[] = [
  {
    id: 'buying-bike',
    name: '🚴 Buying the Right Bike',
    description: 'Customer finds perfect commuter bike based on needs, budget, and local availability',
    icon: '🚴',
    steps: buyingBikeScenario
  },
  {
    id: 'product-comparison',
    name: '🛍️ Product Comparison',
    description: 'Help customer find perfect bike by comparing specs, reviews, and compatibility',
    icon: '🛍️',
    steps: productComparisonScenario
  },
  {
    id: 'booking-test-ride',
    name: '📅 Booking a Test Ride',
    description: 'Customer schedules test rides for bikes they\'re interested in',
    icon: '📅',
    steps: bookingTestRideScenario
  },
  {
    id: 'getting-support',
    name: '🆘 Getting Warranty Support',
    description: 'Customer gets help with bike issue and warranty claim',
    icon: '🆘',
    steps: gettingSupportScenario
  },
  {
    id: 'finding-accessories',
    name: '🛠️ Finding Perfect Accessories',
    description: 'Customer gets personalized accessory recommendations for their new bike',
    icon: '🛠️',
    steps: findingAccessoriesScenario
  },
  {
    id: 'company-info',
    name: '❓ Getting Store Information',
    description: 'Customer finds store hours, return policy, and answers to common questions',
    icon: '❓',
    steps: gettingCompanyInfoScenario
  },
  {
    id: 'agentic-travel',
    name: '✈️ Agentic Travel (A2A)',
    description: 'Demonstrates Agent-to-Agent negotiation and autonomous booking via protocols',
    icon: '✈️',
    steps: travelBookingScenario
  }
];

// Legacy export for backward compatibility
export const insightTraceMap = allScenarios[0].traceMap || {};
