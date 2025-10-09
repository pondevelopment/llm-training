export interface SearchPersona {
  id: string;
  label: string;
  icon: string;
  description: string;
  userGoal: string;
  traditionalSteps: {
    step: number;
    label: string;
    description: string;
  }[];
  agenticSteps: {
    step: number;
    label: string;
    description: string;
  }[];
}

export interface SearchScenario {
  id: string;
  icon: string;
  title: string;
  baseDescription: string;
  personas: SearchPersona[];
}

export const searchScenarios: SearchScenario[] = [
  {
    id: 'bike',
    icon: '🚴',
    title: 'Finding a Beginner Road Bike',
    baseDescription: 'Shopping for a first road bike with a $1,500 budget',
    personas: [
      {
        id: 'woman-commuter',
        label: 'Woman Commuter',
        icon: '🚴‍♀️',
        description: 'You are a woman looking for a comfortable road bike for daily commuting (5 miles each way). You prioritize comfort, practicality, and bikes designed for women geometry.',
        userGoal: 'Find a comfortable women road bike for commuting under $1,500',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search with Specifics',
            description: 'Google "women road bike commuting under $1500" - notice most results are generic or male-focused'
          },
          {
            step: 2,
            label: 'Navigate Gender Bias',
            description: 'Sift through articles to find women-specific geometry info, check if "unisex" bikes actually fit, read forums about sizing'
          },
          {
            step: 3,
            label: 'Research Comfort Features',
            description: 'Manually search for: wider saddles, upright geometry, step-through frames, rack mounts, fender clearance'
          },
          {
            step: 4,
            label: 'Check Real Women Reviews',
            description: 'Search specifically for women reviews on Reddit, cycling forums, filter out male-dominated perspectives'
          },
          {
            step: 5,
            label: 'Verify Fit and Availability',
            description: 'Check which brands actually make your size, find local shops with fitting services, compare commuter accessories'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Context',
            description: 'Agent recognizes: woman cyclist + commuting use case + comfort priority + women geometry + $1500 budget + practical features (racks, fenders)'
          },
          {
            step: 2,
            label: 'Discover Specialized Tools',
            description: 'Finds women-specific cycling databases, geometry comparison APIs, commuter bike reviews, female cyclist forums'
          },
          {
            step: 3,
            label: 'Filter by Gender-Specific Criteria',
            description: 'Queries bikes with: women geometry, appropriate size range, endurance/comfort design, commuter features, reviewed positively by women'
          },
          {
            step: 4,
            label: 'Analyze Fit and Practicality',
            description: 'Prioritizes upright geometry, wider saddles, smaller frame sizes, rack/fender mounts, weights under 23lbs for easy handling'
          },
          {
            step: 5,
            label: 'Deliver Personalized Results',
            description: 'Presents: Liv Avail AR 3 ($1,450, designed for women, comfortable geometry), Specialized Dolce ($1,300, relaxed fit), Trek Domane AL 3 Women ($1,400) - all with commuter setup tips'
          }
        ]
      },
      {
        id: 'man-performance',
        label: 'Man Performance',
        icon: '🚴‍♂️',
        description: 'You are a man interested in weekend group rides and potentially racing. You prioritize speed, lightweight frames, and performance components.',
        userGoal: 'Find a fast, race-ready road bike for performance under $1,500',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Performance Bikes',
            description: 'Google "best performance road bike under $1500" - get flooded with options and bike shop marketing'
          },
          {
            step: 2,
            label: 'Compare Frame Materials',
            description: 'Read about aluminum vs carbon, check weight specs, compare racing geometry charts across brands'
          },
          {
            step: 3,
            label: 'Analyze Components',
            description: 'Research Shimano 105 vs Tiagra groupsets, check gear ratios, compare brake types, wheel quality'
          },
          {
            step: 4,
            label: 'Check Racing Features',
            description: 'Look for aggressive geometry, aero features, stiffness ratings, sprint performance in reviews'
          },
          {
            step: 5,
            label: 'Find Best Value',
            description: 'Balance weight vs price, compare race results, check what local cycling clubs recommend'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Goals',
            description: 'Agent identifies: male cyclist + performance focus + racing potential + group rides + $1500 budget + speed priority'
          },
          {
            step: 2,
            label: 'Access Performance Data',
            description: 'Discovers race bike databases, component hierarchies, weight comparisons, stiffness-to-weight ratios, pro rider setups'
          },
          {
            step: 3,
            label: 'Filter by Performance Metrics',
            description: 'Queries bikes with: aggressive geometry, Shimano 105+ components, under 20lbs weight, race-proven frames, good power transfer'
          },
          {
            step: 4,
            label: 'Analyze Competition Value',
            description: 'Compares price-to-performance ratios, identifies bikes used in local crits, checks upgrade paths, reviews sprint/climbing performance'
          },
          {
            step: 5,
            label: 'Deliver Race-Ready Options',
            description: 'Presents: Cannondale CAAD13 ($1,500, legendary aluminum, race-proven), Giant TCR Advanced ($1,450, stiff and light), Cervélo R2 ($1,500, aero design) - all with racing setup tips'
          }
        ]
      }
    ]
  },
  {
    id: 'trip',
    icon: '✈️',
    title: 'Planning a Family Vacation',
    baseDescription: 'Planning a week-long family trip with specific needs',
    personas: [
      {
        id: 'young-kids',
        label: 'Family with Young Kids (3 & 6)',
        icon: '👶',
        description: 'You have a 3-year-old and 6-year-old. You need kid-friendly activities, short travel times, and accommodations with amenities for little ones.',
        userGoal: 'Find a family-friendly vacation spot with activities for toddlers and young children',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Family Destinations',
            description: 'Google "best family vacation with toddlers" - results mostly generic or outdated'
          },
          {
            step: 2,
            label: 'Filter by Age Appropriateness',
            description: 'Manually check which activities work for ages 3-6, look for nap-friendly schedules'
          },
          {
            step: 3,
            label: 'Research Kid Amenities',
            description: 'Search hotels for: cribs, high chairs, kids pools, babysitting, kid menus'
          },
          {
            step: 4,
            label: 'Check Parent Reviews',
            description: 'Find reviews from parents with similar-age kids, check for meltdown management tips'
          },
          {
            step: 5,
            label: 'Plan Logistics',
            description: 'Map nap times, meal times, backup plans, medical facilities, child-proofing needs'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Family Context',
            description: 'Agent identifies: toddler (3) + young child (6) + need short attention spans + nap schedules + safety focus + low stress for parents'
          },
          {
            step: 2,
            label: 'Find Family Travel Resources',
            description: 'Discovers family travel blogs, toddler-tested destinations, parent review sites, kid activity databases'
          },
          {
            step: 3,
            label: 'Filter Age-Appropriate Options',
            description: 'Searches: <2hr flights, resorts with kids clubs (ages 3-6), beaches with calm water, interactive museums for toddlers'
          },
          {
            step: 4,
            label: 'Analyze Parent-Friendly Features',
            description: 'Prioritizes: all-inclusive resorts, on-site childcare, multiple pools, kid menus, in-room cribs, medical staff'
          },
          {
            step: 5,
            label: 'Deliver Tailored Recommendations',
            description: 'Presents: Beaches Resort Turks (all-inclusive, Sesame Street characters, kids club), Legoland Hotel (built for ages 2-12), San Diego (zoo, beaches, short flights) - with daily schedules optimized for naps'
          }
        ]
      },
      {
        id: 'teens',
        label: 'Family with Teens (14 & 16)',
        icon: '🧑‍🎓',
        description: 'You have teenagers who want adventure and independence. You need activities that keep them engaged without constant supervision.',
        userGoal: 'Find an adventure destination that appeals to teenagers and allows some independence',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Teen Activities',
            description: 'Google "best vacation for teenagers" - results are too broad or kid-focused'
          },
          {
            step: 2,
            label: 'Filter for Adventure',
            description: 'Look for: zip-lining, water sports, theme parks, cultural experiences teens won\'t roll eyes at'
          },
          {
            step: 3,
            label: 'Check Independence Options',
            description: 'Research which resorts allow supervised teen activities, safe exploration, teen-only programs'
          },
          {
            step: 4,
            label: 'Balance Parent Interests',
            description: 'Find activities that work for both teens and adults, check Wi-Fi quality (important!), food variety'
          },
          {
            step: 5,
            label: 'Verify Safety & Freedom',
            description: 'Check safety ratings, teen-friendly areas, transportation options, supervision levels'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Teen Context',
            description: 'Agent recognizes: teenagers 14-16 + need adventure + want independence + social experiences + Instagram-worthy + parents want safety'
          },
          {
            step: 2,
            label: 'Access Teen Travel Data',
            description: 'Finds teen adventure programs, youth-rated activities, supervised independence options, teen travel blogs'
          },
          {
            step: 3,
            label: 'Filter for Teen Appeal',
            description: 'Searches: adventure sports, teen programs, cool factor, social opportunities, cultural immersion, skill-building activities'
          },
          {
            step: 4,
            label: 'Balance Freedom & Safety',
            description: 'Identifies destinations with: supervised teen zones, safe exploration areas, adventure with guides, parent peace-of-mind features'
          },
          {
            step: 5,
            label: 'Deliver Adventure Options',
            description: 'Presents: Costa Rica (zip-lining, surfing, wildlife, teen adventure tours), Iceland (hiking, northern lights, unique culture), Colorado Dude Ranch (horseback, independence, teen programs) - all with teen-approved activities and parent safety features'
          }
        ]
      }
    ]
  },
  {
    id: 'laptop',
    icon: '💻',
    title: 'Buying a Laptop',
    baseDescription: 'Shopping for a new laptop for specific use cases',
    personas: [
      {
        id: 'video-editor',
        label: 'Video Editor / Content Creator',
        icon: '🎬',
        description: 'You edit 4K video content for YouTube and need powerful rendering, color accuracy, and lots of storage.',
        userGoal: 'Find a laptop powerful enough for 4K video editing under $2,000',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Video Editing Laptops',
            description: 'Google "best laptop for video editing" - overwhelmed by gaming laptops and generic recommendations'
          },
          {
            step: 2,
            label: 'Compare CPU/GPU Specs',
            description: 'Research which processors handle 4K, compare GPU benchmarks, check RAM requirements (32GB?)'
          },
          {
            step: 3,
            label: 'Check Display Quality',
            description: 'Look for color accuracy specs, screen brightness, color gamut coverage (100% sRGB? DCI-P3?)'
          },
          {
            step: 4,
            label: 'Verify Storage & Ports',
            description: 'Calculate storage needs, check for Thunderbolt ports, SD card readers, external drive compatibility'
          },
          {
            step: 5,
            label: 'Read Creator Reviews',
            description: 'Find reviews from actual video editors, check rendering benchmarks, battery life during exports'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Creator Needs',
            description: 'Agent identifies: 4K video editing + rendering power + color accuracy critical + storage intensive + portability matters + $2000 budget'
          },
          {
            step: 2,
            label: 'Access Creator Benchmarks',
            description: 'Finds video editing benchmarks, DaVinci Resolve performance data, Premiere Pro optimization guides, creator laptop databases'
          },
          {
            step: 3,
            label: 'Filter by Video Specs',
            description: 'Searches: CPU with 8+ cores, dedicated GPU (RTX 3060+), 32GB RAM, 1TB SSD, 100% sRGB display, Thunderbolt 4'
          },
          {
            step: 4,
            label: 'Analyze Rendering Performance',
            description: 'Compares 4K export times, timeline scrubbing smoothness, multi-cam editing capability, thermal performance during long exports'
          },
          {
            step: 5,
            label: 'Deliver Creator-Optimized Options',
            description: 'Presents: MSI Creator Z16 ($1,999, 100% DCI-P3 display, RTX 3060), Dell XPS 15 ($1,849, OLED display, excellent thermals), Asus ProArt StudioBook ($1,899, creator-focused features) - with optimization tips for each'
          }
        ]
      },
      {
        id: 'developer',
        label: 'Software Developer',
        icon: '👨‍💻',
        description: 'You code daily with multiple VMs, Docker containers, and need excellent keyboard, long battery life, and Linux compatibility.',
        userGoal: 'Find a developer-friendly laptop with great keyboard and battery life under $2,000',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Developer Laptops',
            description: 'Google "best laptop for programming" - results mix gaming laptops with developer needs'
          },
          {
            step: 2,
            label: 'Check Build Quality',
            description: 'Research keyboard quality, trackpad accuracy, build durability, port selection for docks'
          },
          {
            step: 3,
            label: 'Verify Linux Compatibility',
            description: 'Check driver support, Wi-Fi compatibility, suspend/resume issues, community forums for fixes'
          },
          {
            step: 4,
            label: 'Compare Battery & Performance',
            description: 'Look for all-day battery life, check CPU for compilation speeds, RAM for VMs/containers'
          },
          {
            step: 5,
            label: 'Read Developer Reviews',
            description: 'Find reviews from devs, check keyboard feedback, screen quality for long coding sessions, thermal throttling'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Dev Workflow',
            description: 'Agent recognizes: software development + Docker/VMs + Linux preferred + keyboard quality critical + long coding sessions + $2000 budget'
          },
          {
            step: 2,
            label: 'Find Developer Resources',
            description: 'Discovers developer laptop reviews, Linux compatibility databases, keyboard quality rankings, battery life tests'
          },
          {
            step: 3,
            label: 'Filter by Dev Requirements',
            description: 'Searches: excellent keyboard, 16GB+ RAM, fast SSD, 10+ hour battery, matte display, good Linux support, quality trackpad'
          },
          {
            step: 4,
            label: 'Analyze Dev Experience',
            description: 'Prioritizes typing comfort, compilation speeds, thermal management during builds, multi-monitor support, Unix-friendly'
          },
          {
            step: 5,
            label: 'Deliver Dev-Optimized Options',
            description: 'Presents: Framework Laptop 13 ($1,699, modular, great Linux support, excellent keyboard), ThinkPad X1 Carbon ($1,899, legendary keyboard, Linux certified), System76 Lemur Pro ($1,549, built for Linux, great battery) - with setup guides'
          }
        ]
      }
    ]
  },
  {
    id: 'research',
    icon: '🔬',
    title: 'Academic Research',
    baseDescription: 'Finding credible sources for academic work',
    personas: [
      {
        id: 'undergrad',
        label: 'Undergraduate Student',
        icon: '📚',
        description: 'You\'re writing your first major research paper on climate change impacts. You need peer-reviewed sources but aren\'t familiar with academic databases.',
        userGoal: 'Find 10 credible peer-reviewed sources on climate change for an undergraduate paper',
        traditionalSteps: [
          {
            step: 1,
            label: 'Start with Google',
            description: 'Search "climate change research papers" - get millions of results mixing news, blogs, and actual research'
          },
          {
            step: 2,
            label: 'Learn Database Access',
            description: 'Discover you need library access, figure out JSTOR vs PubMed vs Google Scholar, learn Boolean operators'
          },
          {
            step: 3,
            label: 'Filter and Sort',
            description: 'Try to filter by date (how recent?), peer-review status, relevance, accessibility (paywall frustration)'
          },
          {
            step: 4,
            label: 'Evaluate Credibility',
            description: 'Check author credentials, journal impact factors (what\'s good?), citation counts, publication dates'
          },
          {
            step: 5,
            label: 'Organize Findings',
            description: 'Save PDFs with confusing names, try to remember which paper said what, start bibliography formatting'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Academic Level',
            description: 'Agent recognizes: undergraduate level + first major paper + needs peer-reviewed + climate change topic + credibility guidance needed'
          },
          {
            step: 2,
            label: 'Access Academic Databases',
            description: 'Queries Google Scholar, JSTOR, Web of Science using student access credentials, filters for peer-reviewed only'
          },
          {
            step: 3,
            label: 'Filter Appropriate Sources',
            description: 'Searches: recent (2019-2024), highly cited, accessible language level, full-text available, reputable journals'
          },
          {
            step: 4,
            label: 'Validate and Organize',
            description: 'Checks journal rankings, cross-references citations, identifies seminal papers, groups by subtopic, creates annotated bibliography'
          },
          {
            step: 5,
            label: 'Deliver Research Package',
            description: 'Presents: 10 papers organized by theme (impacts on ecosystems, economic effects, policy solutions), with summaries, citation strings, and credibility scores - ready to cite'
          }
        ]
      },
      {
        id: 'phd-researcher',
        label: 'PhD Researcher',
        icon: '🎓',
        description: 'You\'re conducting a literature review for your dissertation on a niche topic. You need comprehensive coverage, recent publications, and gap identification.',
        userGoal: 'Conduct comprehensive literature review on neural plasticity in adult learning',
        traditionalSteps: [
          {
            step: 1,
            label: 'Query Multiple Databases',
            description: 'Search PubMed, Web of Science, PsycINFO, Scopus with complex Boolean queries, save searches'
          },
          {
            step: 2,
            label: 'Track Citation Networks',
            description: 'Follow citation trails backward (who did they cite?) and forward (who cited them?), identify key researchers'
          },
          {
            step: 3,
            label: 'Monitor New Publications',
            description: 'Set up alerts for keywords, check preprint servers, follow researchers on ResearchGate, attend conferences'
          },
          {
            step: 4,
            label: 'Identify Research Gaps',
            description: 'Read 50+ papers, create synthesis tables, note methodological limitations, find understudied areas'
          },
          {
            step: 5,
            label: 'Synthesize and Map',
            description: 'Create concept maps, track contradicting findings, note theoretical frameworks, organize by methodology'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Research Depth',
            description: 'Agent recognizes: PhD-level + dissertation work + niche topic + comprehensive coverage needed + gap analysis required + recent advances critical'
          },
          {
            step: 2,
            label: 'Execute Deep Search',
            description: 'Queries multiple academic databases with MeSH terms, tracks citation networks, identifies key authors, monitors preprints, finds review articles'
          },
          {
            step: 3,
            label: 'Map Research Landscape',
            description: 'Analyzes: publication trends over time, methodological approaches, theoretical frameworks, conflicting findings, emerging subtopics'
          },
          {
            step: 4,
            label: 'Identify Gaps and Opportunities',
            description: 'Cross-references studies to find: understudied populations, methodological limitations, contradictory results needing resolution, emerging technologies'
          },
          {
            step: 5,
            label: 'Deliver Comprehensive Review',
            description: 'Presents: 75+ papers organized by theme, citation network visualization, timeline of key discoveries, identified gaps table, methodological comparison matrix, suggested research directions'
          }
        ]
      }
    ]
  },
  {
    id: 'gift',
    icon: '🎁',
    title: 'Finding the Perfect Gift',
    baseDescription: 'Shopping for a meaningful gift for someone special',
    personas: [
      {
        id: 'romantic-partner',
        label: 'Gift for Romantic Partner',
        icon: '💝',
        description: 'Your partner\'s birthday is next week. They love cooking and you want something thoughtful that shows you pay attention to their interests.',
        userGoal: 'Find a meaningful cooking-related gift for partner\'s birthday around $100',
        traditionalSteps: [
          {
            step: 1,
            label: 'Browse Gift Guides',
            description: 'Search "best gifts for home cooks" - get generic listicles and affiliate link spam'
          },
          {
            step: 2,
            label: 'Check Reviews',
            description: 'Look up products on Amazon, read reviews (are they fake?), compare prices across sites'
          },
          {
            step: 3,
            label: 'Consider Personalization',
            description: 'Search for custom/engraved options, check delivery times, worry about personalization quality'
          },
          {
            step: 4,
            label: 'Verify Uniqueness',
            description: 'Make sure they don\'t already have it, check if friends/family already got similar, assess wow factor'
          },
          {
            step: 5,
            label: 'Second-Guess Choice',
            description: 'Read more reviews, compare to alternatives, stress about whether it\'s thoughtful enough, check return policy'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Relationship Context',
            description: 'Agent recognizes: romantic partner + birthday + cooking interest + thoughtful gesture important + $100 budget + uniqueness valued'
          },
          {
            step: 2,
            label: 'Analyze Cooking Interests',
            description: 'Considers: their cooking skill level, cuisine preferences, kitchen space, current equipment, cooking style (precision vs creative)'
          },
          {
            step: 3,
            label: 'Find Unique Options',
            description: 'Searches: specialty cooking tools, experiences (classes), subscription boxes, personalized items, artisan products, not-yet-owned items'
          },
          {
            step: 4,
            label: 'Evaluate Thoughtfulness',
            description: 'Prioritizes: items that show attention to their specific interests, upgrade over what they have, enables new techniques, memorable unboxing'
          },
          {
            step: 5,
            label: 'Deliver Curated Options',
            description: 'Presents: Japanese knife with engraving ($95, matches their interest in Asian cuisine), molecular gastronomy kit ($85, enables creativity), pasta-making class for two ($120, experience together) - with personalization suggestions'
          }
        ]
      },
      {
        id: 'professional-colleague',
        label: 'Gift for Colleague',
        icon: '👔',
        description: 'A coworker helped you significantly on a project. You want to thank them professionally without being too personal or extravagant.',
        userGoal: 'Find an appropriate thank-you gift for helpful coworker around $30-50',
        traditionalSteps: [
          {
            step: 1,
            label: 'Search Professional Gifts',
            description: 'Google "professional thank you gifts" - get generic desk items and corporate swag'
          },
          {
            step: 2,
            label: 'Navigate Workplace Norms',
            description: 'Worry: is this too personal? Too cheap? Will HR care? What if others see? Do they have dietary restrictions?'
          },
          {
            step: 3,
            label: 'Check Office-Appropriate',
            description: 'Avoid anything too personal (no clothing, perfume), too casual, too expensive (awkward), or consumables (allergies?)'
          },
          {
            step: 4,
            label: 'Balance Thoughtful and Safe',
            description: 'Try to show appreciation without crossing professional boundaries, find middle ground between generic and personal'
          },
          {
            step: 5,
            label: 'Verify Appropriateness',
            description: 'Ask others (too obvious?), check company policy, read about office gift etiquette, add gift receipt just in case'
          }
        ],
        agenticSteps: [
          {
            step: 1,
            label: 'Understand Professional Context',
            description: 'Agent recognizes: workplace gift + thank you gesture + professional boundaries + $30-50 range + appropriate for office + genuine appreciation'
          },
          {
            step: 2,
            label: 'Research Office Etiquette',
            description: 'Considers: company culture norms, gift-giving policies, inclusivity (food restrictions, religious considerations), appropriate value range'
          },
          {
            step: 3,
            label: 'Filter Professional Options',
            description: 'Searches: universally appropriate, quality over quantity, useful not decorative, office-friendly, consumables that are inclusive'
          },
          {
            step: 4,
            label: 'Evaluate Appreciation Balance',
            description: 'Prioritizes: shows genuine thanks, doesn\'t create obligation, appropriate for relationship level, includes note option, gift-receipt friendly'
          },
          {
            step: 5,
            label: 'Deliver Professional Options',
            description: 'Presents: premium coffee selection box ($45, office-appropriate, consumable), quality desk plant ($35, low-maintenance succulent), artisan tea sampler ($40, inclusive, shareable), leather portfolio ($50, professional, useful) - with thank-you note suggestions'
          }
        ]
      }
    ]
  }
];

export function getDefaultPersona(scenario: SearchScenario): SearchPersona {
  return scenario.personas[0];
}

export const defaultScenario = searchScenarios[0];
export const defaultPersona = getDefaultPersona(defaultScenario);
