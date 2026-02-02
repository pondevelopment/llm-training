// Bike catalog with attributes matching Bayesian network outputs

export const bikes = [
  // ROAD BIKES
  {
    id: 'road-1',
    name: 'Velocity Aero Pro',
    type: 'ROAD',
    price: 2499,
    priceRange: 'PREMIUM',
    suspension: 'NONE',
    comfort: 'BASIC',
    image: '🚴',
    description: 'Lightweight carbon frame, perfect for racing and fast fitness rides',
    specs: { weight: '8.2kg', gears: '22-speed', frame: 'Carbon', brakes: 'Disc' }
  },
  {
    id: 'road-2',
    name: 'SwiftRide Endurance',
    type: 'ROAD',
    price: 1299,
    priceRange: 'MIDRANGE',
    suspension: 'NONE',
    comfort: 'COMFORTABLE',
    description: 'Endurance geometry for long comfortable rides',
    image: '🚴',
    specs: { weight: '9.5kg', gears: '20-speed', frame: 'Aluminum', brakes: 'Disc' }
  },
  {
    id: 'road-3',
    name: 'CitySpeed Entry',
    type: 'ROAD',
    price: 649,
    priceRange: 'BUDGET',
    suspension: 'NONE',
    comfort: 'BASIC',
    image: '🚴',
    description: 'Great entry-level road bike for beginners',
    specs: { weight: '10.8kg', gears: '16-speed', frame: 'Aluminum', brakes: 'Rim' }
  },

  // HYBRID BIKES
  {
    id: 'hybrid-1',
    name: 'UrbanFlex Commuter',
    type: 'HYBRID',
    price: 599,
    priceRange: 'BUDGET',
    suspension: 'FRONT',
    comfort: 'COMFORTABLE',
    image: '🚲',
    description: 'Perfect daily commuter with upright position and rack mounts',
    specs: { weight: '12.5kg', gears: '21-speed', frame: 'Aluminum', brakes: 'Disc' }
  },
  {
    id: 'hybrid-2',
    name: 'PathFinder Sport',
    type: 'HYBRID',
    price: 899,
    priceRange: 'MIDRANGE',
    suspension: 'FRONT',
    comfort: 'COMFORTABLE',
    image: '🚲',
    description: 'Versatile hybrid for city streets and light trails',
    specs: { weight: '11.8kg', gears: '24-speed', frame: 'Aluminum', brakes: 'Hydraulic Disc' }
  },
  {
    id: 'hybrid-3',
    name: 'ComfortRide Plus',
    type: 'HYBRID',
    price: 1199,
    priceRange: 'MIDRANGE',
    suspension: 'FRONT',
    comfort: 'PREMIUM_COMFORT',
    image: '🚲',
    description: 'Maximum comfort hybrid with suspension seatpost',
    specs: { weight: '13.2kg', gears: '27-speed', frame: 'Aluminum', brakes: 'Hydraulic Disc' }
  },

  // MOUNTAIN BIKES
  {
    id: 'mtb-1',
    name: 'TrailBlazer 29',
    type: 'MOUNTAIN',
    price: 799,
    priceRange: 'BUDGET',
    suspension: 'FRONT',
    comfort: 'BASIC',
    image: '🚵',
    description: 'Hardtail mountain bike for trail beginners',
    specs: { weight: '14.2kg', gears: '21-speed', frame: 'Aluminum', brakes: 'Disc' }
  },
  {
    id: 'mtb-2',
    name: 'RockHopper Elite',
    type: 'MOUNTAIN',
    price: 1599,
    priceRange: 'MIDRANGE',
    suspension: 'FRONT',
    comfort: 'COMFORTABLE',
    image: '🚵',
    description: 'Quality hardtail with RockShox fork for serious trails',
    specs: { weight: '12.8kg', gears: '12-speed', frame: 'Aluminum', brakes: 'Hydraulic Disc' }
  },
  {
    id: 'mtb-3',
    name: 'Summit Full Sus',
    type: 'MOUNTAIN',
    price: 2899,
    priceRange: 'PREMIUM',
    suspension: 'FULL',
    comfort: 'COMFORTABLE',
    image: '🚵',
    description: 'Full suspension beast for technical terrain',
    specs: { weight: '13.5kg', gears: '12-speed', frame: 'Carbon/Aluminum', brakes: 'Hydraulic Disc' }
  },
  {
    id: 'mtb-4',
    name: 'Downhill Monster',
    type: 'MOUNTAIN',
    price: 4299,
    priceRange: 'PREMIUM',
    suspension: 'FULL',
    comfort: 'BASIC',
    image: '🚵',
    description: 'Aggressive geometry for downhill and bike parks',
    specs: { weight: '15.2kg', gears: '7-speed', frame: 'Carbon', brakes: 'Hydraulic Disc 4-piston' }
  },

  // E-BIKES
  {
    id: 'ebike-1',
    name: 'PowerCommute City',
    type: 'EBIKE',
    price: 1899,
    priceRange: 'MIDRANGE',
    suspension: 'FRONT',
    comfort: 'PREMIUM_COMFORT',
    image: '⚡🚲',
    description: 'Comfortable city e-bike with 60km range',
    specs: { weight: '23kg', gears: '8-speed', frame: 'Aluminum', motor: '250W', range: '60km' }
  },
  {
    id: 'ebike-2',
    name: 'E-Trail Explorer',
    type: 'EBIKE',
    price: 3499,
    priceRange: 'PREMIUM',
    suspension: 'FULL',
    comfort: 'COMFORTABLE',
    image: '⚡🚵',
    description: 'Full suspension e-MTB for conquering any hill',
    specs: { weight: '24kg', gears: '11-speed', frame: 'Aluminum', motor: '500W', range: '80km' }
  },
  {
    id: 'ebike-3',
    name: 'ElectroCity Budget',
    type: 'EBIKE',
    price: 1299,
    priceRange: 'BUDGET',
    suspension: 'NONE',
    comfort: 'COMFORTABLE',
    image: '⚡🚲',
    description: 'Affordable city e-bike for flat terrain',
    specs: { weight: '21kg', gears: '7-speed', frame: 'Steel', motor: '250W', range: '40km' }
  },

  // GRAVEL BIKES
  {
    id: 'gravel-1',
    name: 'AllRoad Adventure',
    type: 'GRAVEL',
    price: 1699,
    priceRange: 'MIDRANGE',
    suspension: 'NONE',
    comfort: 'COMFORTABLE',
    image: '🚴‍♂️',
    description: 'Go anywhere gravel bike with wide tire clearance',
    specs: { weight: '10.2kg', gears: '22-speed', frame: 'Aluminum', brakes: 'Hydraulic Disc' }
  },
  {
    id: 'gravel-2',
    name: 'GravelKing Carbon',
    type: 'GRAVEL',
    price: 3299,
    priceRange: 'PREMIUM',
    suspension: 'NONE',
    comfort: 'COMFORTABLE',
    image: '🚴‍♂️',
    description: 'Lightweight carbon gravel racer',
    specs: { weight: '8.8kg', gears: '24-speed', frame: 'Carbon', brakes: 'Hydraulic Disc' }
  },
  {
    id: 'gravel-3',
    name: 'DirtDrop Entry',
    type: 'GRAVEL',
    price: 899,
    priceRange: 'BUDGET',
    suspension: 'NONE',
    comfort: 'BASIC',
    image: '🚴‍♂️',
    description: 'Budget-friendly gravel exploration',
    specs: { weight: '11.5kg', gears: '18-speed', frame: 'Aluminum', brakes: 'Mechanical Disc' }
  },
];

// Function to score a bike based on Bayesian network posteriors
export function scoreBike(bike, posteriors) {
  let score = 0;
  let weights = 0;

  // Score based on bike type match
  if (posteriors.BIKE_TYPE) {
    const typeProb = posteriors.BIKE_TYPE[bike.type] || 0;
    score += typeProb * 40; // 40% weight for bike type
    weights += 40;
  }

  // Score based on suspension match
  if (posteriors.SUSPENSION) {
    const suspProb = posteriors.SUSPENSION[bike.suspension] || 0;
    score += suspProb * 20; // 20% weight for suspension
    weights += 20;
  }

  // Score based on price range match
  if (posteriors.PRICE_RANGE) {
    const priceProb = posteriors.PRICE_RANGE[bike.priceRange] || 0;
    score += priceProb * 25; // 25% weight for price
    weights += 25;
  }

  // Score based on comfort match
  if (posteriors.COMFORT_LEVEL) {
    const comfortProb = posteriors.COMFORT_LEVEL[bike.comfort] || 0;
    score += comfortProb * 15; // 15% weight for comfort
    weights += 15;
  }

  return weights > 0 ? score / weights * 100 : 50;
}

// Get top bike recommendations
export function getRecommendations(posteriors, count = 5) {
  const scored = bikes.map(bike => ({
    ...bike,
    score: scoreBike(bike, posteriors)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
