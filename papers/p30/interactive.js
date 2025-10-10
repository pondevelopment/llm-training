function interactiveScript() {
  // Scenario data with realistic distributions
  const scenarios = {
    shampoo: {
      question: "How satisfied are you with this shampoo's cleaning performance?",
      humanDist: [8, 15, 28, 32, 17], // Percentages for ratings 1-5
      humanMean: 3.35,
      humanStd: 1.15,
      humanN: 164,
      directDist: [5, 8, 12, 25, 50], // Unrealistic spike at 5
      directKS: 0.52,
      directMean: 4.07,
      ssrDist: [7, 14, 30, 34, 15], // Matches human distribution
      ssrKS: 0.89,
      ssrMean: 3.36,
      reliability: 0.65,
      consistency: 92,
      samples: [
        {
          rating: 4,
          text: "This shampoo cleans effectively without stripping my hair of natural oils. The lather is rich and the scent is pleasant but not overpowering. I appreciate that it works well for daily use, though I wish the bottle design made it easier to dispense the last portion.",
          similarity: 0.82,
          reference: "satisfied"
        },
        {
          rating: 2,
          text: "I found this shampoo disappointing compared to my usual brand. It leaves my hair feeling somewhat dry and tangled, requiring more conditioner than normal. The cleaning performance is adequate but nothing special, and the fragrance is too strong for my preference.",
          similarity: 0.79,
          reference: "dissatisfied"
        },
        {
          rating: 3,
          text: "This product does what it's supposed to do—it cleans hair. The formula is neither exceptional nor problematic. I don't have strong feelings either way. It's a functional shampoo that gets the job done, but there's nothing particularly memorable about the experience.",
          similarity: 0.85,
          reference: "neutral"
        }
      ]
    },
    smartphone: {
      question: "How likely are you to recommend this phone to a friend?",
      humanDist: [12, 18, 25, 30, 15],
      humanMean: 3.18,
      humanStd: 1.28,
      humanN: 203,
      directDist: [3, 5, 15, 32, 45],
      directKS: 0.48,
      directMean: 4.11,
      ssrDist: [11, 17, 27, 31, 14],
      ssrKS: 0.91,
      ssrMean: 3.20,
      reliability: 0.68,
      consistency: 94,
      samples: [
        {
          rating: 5,
          text: "This phone exceeds my expectations in every way. The camera quality is outstanding, battery life easily lasts a full day of heavy use, and the interface is intuitive. I've already recommended it to three colleagues who were looking to upgrade.",
          similarity: 0.88,
          reference: "very likely"
        },
        {
          rating: 2,
          text: "I'm disappointed with this phone's performance. Battery drains faster than advertised, the camera struggles in low light, and I've experienced occasional lag. For the price point, I expected more reliability and wouldn't suggest others purchase it.",
          similarity: 0.81,
          reference: "unlikely"
        },
        {
          rating: 3,
          text: "The phone is decent but not exceptional. It handles basic tasks well—calls, texts, browsing—but doesn't stand out from competitors. I'm neutral about recommending it; depends on what features matter most to the person asking.",
          similarity: 0.83,
          reference: "neutral"
        }
      ]
    },
    coffee: {
      question: "How much do you like the taste of this coffee?",
      humanDist: [10, 20, 35, 25, 10],
      humanMean: 3.05,
      humanStd: 1.12,
      humanN: 187,
      directDist: [8, 12, 18, 28, 34],
      directKS: 0.55,
      directMean: 3.68,
      ssrDist: [9, 19, 37, 26, 9],
      ssrKS: 0.87,
      ssrMean: 3.07,
      reliability: 0.63,
      consistency: 89,
      samples: [
        {
          rating: 4,
          text: "I really enjoy this coffee blend. The flavor profile is well-balanced with subtle notes of chocolate and caramel. It's smooth without bitterness, and the aroma is inviting. This has become my go-to morning coffee.",
          similarity: 0.84,
          reference: "like very much"
        },
        {
          rating: 2,
          text: "This coffee is too acidic for my taste, leaving an unpleasant aftertaste that lingers. The flavor is harsh and one-dimensional, lacking the richness I prefer. I wouldn't choose this blend again given other options.",
          similarity: 0.77,
          reference: "dislike"
        },
        {
          rating: 3,
          text: "It's acceptable coffee—nothing remarkable but also nothing objectionable. The taste is middle-of-the-road, neither exciting nor disappointing. I'd drink it if offered but wouldn't specifically seek it out.",
          similarity: 0.86,
          reference: "neutral"
        }
      ]
    },
    skincare: {
      question: "How well does this moisturizer meet your expectations?",
      humanDist: [6, 12, 30, 38, 14],
      humanMean: 3.42,
      humanStd: 1.08,
      humanN: 215,
      directDist: [4, 7, 14, 30, 45],
      directKS: 0.50,
      directMean: 4.05,
      ssrDist: [5, 13, 31, 37, 14],
      ssrKS: 0.90,
      ssrMean: 3.42,
      reliability: 0.66,
      consistency: 93,
      samples: [
        {
          rating: 4,
          text: "This moisturizer absorbs quickly without leaving a greasy residue and keeps my skin hydrated throughout the day. The fragrance-free formula works well with my sensitive skin, and I've noticed improved texture after two weeks of use.",
          similarity: 0.85,
          reference: "exceeds expectations"
        },
        {
          rating: 2,
          text: "The moisturizer feels heavy on my skin and doesn't absorb as quickly as I'd prefer. By midday, I notice my skin feels oily, especially in my T-zone. It provides basic hydration but falls short of what I expected based on the product claims.",
          similarity: 0.80,
          reference: "below expectations"
        },
        {
          rating: 3,
          text: "The product performs adequately—it moisturizes as expected for a basic daily cream. No particularly impressive results but also no negative reactions. It's functional and meets the minimum requirements of what a moisturizer should do.",
          similarity: 0.84,
          reference: "meets expectations"
        }
      ]
    },
    snack: {
      question: "How likely are you to purchase this product again?",
      humanDist: [15, 22, 28, 24, 11],
      humanMean: 2.94,
      humanStd: 1.25,
      humanN: 176,
      directDist: [10, 15, 20, 25, 30],
      directKS: 0.53,
      directMean: 3.50,
      ssrDist: [14, 21, 29, 25, 11],
      ssrKS: 0.88,
      ssrMean: 2.98,
      reliability: 0.64,
      consistency: 91,
      samples: [
        {
          rating: 4,
          text: "I'm impressed with the taste and protein content of this bar. The texture is chewy but not chalky like many protein bars, and the flavor is genuinely enjoyable rather than artificially sweet. I'll definitely purchase this again for post-workout snacks.",
          similarity: 0.83,
          reference: "very likely"
        },
        {
          rating: 2,
          text: "The bar is too dense and difficult to chew, with an artificial aftertaste that's off-putting. While the protein content is adequate, the texture and flavor make it unpleasant to consume. I won't be buying this product again.",
          similarity: 0.78,
          reference: "unlikely"
        },
        {
          rating: 3,
          text: "It's an okay protein bar—does the job when I need quick nutrition but isn't something I particularly look forward to eating. The taste is acceptable, the texture is fine. I might buy it again if on sale, but otherwise I'd probably try other brands.",
          similarity: 0.82,
          reference: "neutral"
        }
      ]
    }
  };

  // Get DOM elements
  const scenarioSelect = document.getElementById('p30-scenario-select');
  const directDist = document.getElementById('p30-direct-distribution');
  const ssrDist = document.getElementById('p30-ssr-distribution');
  const humanDist = document.getElementById('p30-human-distribution');
  const directPrompt = document.getElementById('p30-direct-prompt');
  const ssrPrompt = document.getElementById('p30-ssr-prompt');
  const directKS = document.getElementById('p30-direct-ks');
  const directMean = document.getElementById('p30-direct-mean');
  const ssrKS = document.getElementById('p30-ssr-ks');
  const ssrMean = document.getElementById('p30-ssr-mean');
  const humanMean = document.getElementById('p30-human-mean');
  const humanStd = document.getElementById('p30-human-std');
  const humanN = document.getElementById('p30-human-n');
  const reliabilityValue = document.getElementById('p30-reliability-value');
  const reliabilityBar = document.getElementById('p30-reliability-bar');
  const ksValue = document.getElementById('p30-ks-value');
  const ksBar = document.getElementById('p30-ks-bar');
  const consistencyValue = document.getElementById('p30-consistency-value');
  const consistencyBar = document.getElementById('p30-consistency-bar');
  const sample1Rating = document.getElementById('p30-sample1-rating');
  const sample1Text = document.getElementById('p30-sample1-text');
  const sample2Rating = document.getElementById('p30-sample2-rating');
  const sample2Text = document.getElementById('p30-sample2-text');
  const sample3Rating = document.getElementById('p30-sample3-rating');
  const sample3Text = document.getElementById('p30-sample3-text');

  // Function to create distribution bars
  const createDistributionBars = (container, distribution, color, label) => {
    container.innerHTML = '';
    distribution.forEach((percentage, index) => {
      const rating = index + 1;
      const barContainer = document.createElement('div');
      barContainer.className = 'flex items-center gap-2';
      
      const ratingLabel = document.createElement('span');
      ratingLabel.className = 'text-xs font-mono text-heading w-4';
      ratingLabel.textContent = rating;
      
      const barWrapper = document.createElement('div');
      barWrapper.className = 'flex-1 bg-background rounded-full h-4';
      
      const bar = document.createElement('div');
      bar.className = 'h-4 rounded-full transition-all duration-300';
      bar.style.width = `${percentage}%`;
      bar.style.backgroundColor = color;
      
      const percentageLabel = document.createElement('span');
      percentageLabel.className = 'text-xs font-mono text-heading w-10 text-right';
      percentageLabel.textContent = `${percentage}%`;
      
      barWrapper.appendChild(bar);
      barContainer.appendChild(ratingLabel);
      barContainer.appendChild(barWrapper);
      barContainer.appendChild(percentageLabel);
      container.appendChild(barContainer);
    });
  };

  // Function to update UI based on selected scenario
  const updateScenario = () => {
    const scenarioKey = scenarioSelect.value;
    const scenario = scenarios[scenarioKey];
    
    // Update prompts
    ssrPrompt.textContent = `"${scenario.question}"`;
    directPrompt.textContent = `"Rate this product on a scale of 1-5."`;
    
    // Update distributions
    createDistributionBars(directDist, scenario.directDist, 'rgb(239, 68, 68)', 'Direct'); // Red
    createDistributionBars(ssrDist, scenario.ssrDist, 'rgb(34, 197, 94)', 'SSR'); // Green
    createDistributionBars(humanDist, scenario.humanDist, 'rgb(99, 102, 241)', 'Human'); // Indigo
    
    // Update metrics
    directKS.textContent = scenario.directKS.toFixed(2);
    directMean.textContent = scenario.directMean.toFixed(2);
    ssrKS.textContent = scenario.ssrKS.toFixed(2);
    ssrMean.textContent = scenario.ssrMean.toFixed(2);
    humanMean.textContent = scenario.humanMean.toFixed(2);
    humanStd.textContent = scenario.humanStd.toFixed(2);
    humanN.textContent = scenario.humanN;
    
    // Update reliability metrics
    reliabilityValue.textContent = scenario.reliability.toFixed(2);
    const reliabilityPercent = Math.round((scenario.reliability / 0.72) * 100);
    reliabilityBar.style.width = `${reliabilityPercent}%`;
    reliabilityBar.previousElementSibling.nextElementSibling.innerHTML = `<strong>${reliabilityPercent}%</strong> of human reliability achieved`;
    
    ksValue.textContent = scenario.ssrKS.toFixed(2);
    ksBar.style.width = `${scenario.ssrKS * 100}%`;
    
    consistencyValue.textContent = `${scenario.consistency}%`;
    consistencyBar.style.width = `${scenario.consistency}%`;
    
    // Update samples
    sample1Rating.textContent = scenario.samples[0].rating;
    sample1Text.textContent = scenario.samples[0].text;
    sample1Text.parentElement.querySelector('.panel-muted:last-child').innerHTML = 
      `<strong>Embedding similarity to "${scenario.samples[0].reference}" reference:</strong> <span class="font-mono">${scenario.samples[0].similarity}</span>`;
    
    sample2Rating.textContent = scenario.samples[1].rating;
    sample2Text.textContent = scenario.samples[1].text;
    sample2Text.parentElement.querySelector('.panel-muted:last-child').innerHTML = 
      `<strong>Embedding similarity to "${scenario.samples[1].reference}" reference:</strong> <span class="font-mono">${scenario.samples[1].similarity}</span>`;
    
    sample3Rating.textContent = scenario.samples[2].rating;
    sample3Text.textContent = scenario.samples[2].text;
    sample3Text.parentElement.querySelector('.panel-muted:last-child').innerHTML = 
      `<strong>Embedding similarity to "${scenario.samples[2].reference}" reference:</strong> <span class="font-mono">${scenario.samples[2].similarity}</span>`;
  };

  // Event listeners
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', updateScenario);
  }

  // Initialize with default scenario
  updateScenario();
}

// Export for CommonJS and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interactiveScript };
}
