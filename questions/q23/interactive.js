const interactiveScript = () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const container = document.getElementById("question-answer");
    const formula = document.getElementById("q23-formula");
    const tryTypeset = () => window.MathJax.typesetPromise([formula || container]).catch(() => {});

    if (container) {
      tryTypeset().then(() => {
        if (formula && formula.querySelector('[data-mml-node="merror"], .MathJax_Error')) {
          formula.setAttribute("aria-label", "Softmax formula (HTML fallback)");
          formula.innerHTML =
            '<div class="font-mono">' +
            "p<sub>i</sub> = e<sup>x<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub></sup><br/>" +
            "p<sub>i</sub>(T) = e<sup>x<sub>i</sub>/T</sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub>/T</sup>" +
            "</div>";
        }
      });
    }
  }

  const scoresSelect = document.getElementById("q23-scores-select");
  const temperatureSlider = document.getElementById("q23-temperature");
  const tempDisplay = document.getElementById("q23-temp-display");
  const output = document.getElementById("q23-output");
  const modeRadios = document.querySelectorAll('input[name="q23-mode"]');
  const modeCards = document.querySelectorAll('[data-role="q23-mode-card"]');
  const exampleBtn = document.getElementById("q23-example-btn");
  const modeIndicator = document.getElementById("q23-mode-indicator");
  const legend = document.getElementById("q23-legend");
  const explanation = document.getElementById("q23-explanation");

  if (!scoresSelect || !output || !temperatureSlider || !tempDisplay) {
    console.error("Required DOM elements not found for Question 23");
    return;
  }

  const examples = [
    {
      scores: "2.0, 2.0, 2.0, 2.0",
      temp: 1.0,
      description: "Uniform - Perfect equality",
      explanation: "All positions receive exactly equal attention - no preference"
    },
    {
      scores: "5.0, 1.0, 1.0, 1.0",
      temp: 1.0,
      description: "Single Focus - Sharp attention",
      explanation: "One position dominates attention - very focused model"
    },
    {
      scores: "4.5, 3.8, 3.2, 2.1",
      temp: 0.5,
      description: "Gradual + Low Temp - Very peaked",
      explanation: "Gradual decline with low temperature creates extreme focus"
    },
    {
      scores: "1.2, 4.8, 1.1, 4.7",
      temp: 2.0,
      description: "Alternating + High Temp - Flattened",
      explanation: "High temperature smooths out the alternating pattern"
    },
    {
      scores: "6.5, 0.2, 0.1",
      temp: 1.0,
      description: "Extreme Focus - Maximum attention",
      explanation: "Demonstrates how extreme scores create near-certainty"
    }
  ];

  let exampleIndex = 0;

  function parseScores(scoresText) {
    try {
      const scores = scoresText
        .split(",")
        .map((value) => parseFloat(value.trim()))
        .filter((value) => !Number.isNaN(value));
      return scores.length > 0 ? scores : [1, 1, 1];
    } catch (error) {
      return [1, 1, 1];
    }
  }

  function softmax(scores, temperature) {
    const safeTemperature = Math.max(temperature || 1, 1e-6);
    const scaledScores = scores.map((score) => score / safeTemperature);
    const maxScore = Math.max(...scaledScores);
    const shifted = scaledScores.map((score) => score - maxScore);
    const exponentials = shifted.map((value) => Math.exp(value));
    const sum = exponentials.reduce((total, value) => total + value, 0);
    const probabilities = exponentials.map((value) => value / (sum || 1));
    return {
      original: scores,
      scaled: scaledScores,
      exponentials,
      probabilities,
      sum
    };
  }

  function getCurrentMode() {
    const checked = document.querySelector('input[name="q23-mode"]:checked');
    return checked ? checked.value : "bars";
  }

  function renderBarChart(result) {
    const maxBarWidth = 300;
    let html = '<div class="space-y-3">';
    result.probabilities.forEach((probability, index) => {
      const barWidth = probability * maxBarWidth;
      const percentage = (probability * 100).toFixed(1);
      const color = `hsl(${200 + index * 40}, 70%, 60%)`;
      html +=
        '<div class="flex items-center gap-3">' +
        '<div class="w-20 text-sm font-medium text-heading">Score ' + (index + 1) + ':</div>' +
        '<div class="flex-1">' +
        '<div class="h-8 bg-subtle border border-subtle rounded overflow-hidden">' +
        '<div class="h-full transition-all duration-500 ease-out flex items-center justify-center text-white text-sm font-medium" style="width: ' +
        barWidth +
        'px; background-color: ' +
        color +
        ';">' +
        percentage +
        '%</div>' +
        '</div>' +
        '</div>' +
        '<div class="w-28 text-sm text-muted">' +
        result.original[index].toFixed(2) +
        " → " +
        probability.toFixed(3) +
        "</div>" +
        "</div>";
    });
    html += "</div>";
    return html;
  }

  function renderTable(result) {
    let html =
      '<div class="overflow-x-auto">' +
      '<table class="min-w-full text-sm">' +
      '<thead>' +
      '<tr class="text-left text-xs uppercase tracking-wide text-muted border-b border-divider">' +
      '<th class="px-3 py-2 font-medium">Position</th>' +
      '<th class="px-3 py-2 font-medium">Raw score</th>' +
      '<th class="px-3 py-2 font-medium">Scaled score</th>' +
      '<th class="px-3 py-2 font-medium">e^(scaled)</th>' +
      '<th class="px-3 py-2 font-medium">Probability</th>' +
      '<th class="px-3 py-2 font-medium">Percentage</th>' +
      "</tr>" +
      "</thead>" +
      "<tbody>";
    result.probabilities.forEach((probability, index) => {
      html +=
        '<tr class="border-t border-divider hover:bg-subtle">' +
        '<td class="px-3 py-2 text-sm font-medium text-heading">' +
        (index + 1) +
        "</td>" +
        '<td class="px-3 py-2 text-sm text-muted">' +
        result.original[index].toFixed(3) +
        "</td>" +
        '<td class="px-3 py-2 text-sm text-muted">' +
        result.scaled[index].toFixed(3) +
        "</td>" +
        '<td class="px-3 py-2 text-sm text-muted">' +
        result.exponentials[index].toFixed(3) +
        "</td>" +
        '<td class="px-3 py-2 text-sm font-medium text-info">' +
        probability.toFixed(4) +
        "</td>" +
        '<td class="px-3 py-2 text-sm text-muted">' +
        (probability * 100).toFixed(1) +
        "%</td>" +
        "</tr>";
    });
    html +=
      "</tbody></table></div>" +
      '<div class="mt-3 text-xs text-muted">' +
      "Sum of exponentials: " +
      result.sum.toFixed(4) +
      " | Sum of probabilities: " +
      result.probabilities.reduce((total, value) => total + value, 0).toFixed(4) +
      "</div>";
    return html;
  }

  function calculateEntropy(probabilities) {
    return -probabilities.reduce((entropy, probability) => {
      return entropy + (probability > 0 ? probability * Math.log2(probability) : 0);
    }, 0);
  }

  function updateTemperatureDisplay() {
    const temp = parseFloat(temperatureSlider.value);
    tempDisplay.textContent = temp.toFixed(1);
  }

  function updateModeIndicator() {
    const mode = getCurrentMode();
    modeIndicator.textContent = mode === "bars" ? "Bar Chart" : "Data Table";
    modeCards.forEach((card) => {
      const isActive = card.getAttribute("data-mode") === mode;
      if (isActive) {
        card.classList.add("panel-emphasis");
      } else {
        card.classList.remove("panel-emphasis");
      }
      card.setAttribute("data-active", isActive ? "true" : "false");
    });
  }

  const processAndDisplay = () => {
    const scoresText = (scoresSelect.value || "").trim();
    const temperature = parseFloat(temperatureSlider.value);
    const mode = getCurrentMode();

    if (!scoresText) {
      output.innerHTML =
        '<div class="text-sm text-muted text-center">Select attention scores to see the softmax transformation.</div>';
      return;
    }

    const scores = parseScores(scoresText);
    const result = softmax(scores, temperature);

    output.innerHTML = mode === "bars" ? renderBarChart(result) : renderTable(result);

    const entropy = calculateEntropy(result.probabilities);
    const maxProb = Math.max(...result.probabilities);
    const minProb = Math.min(...result.probabilities);
    const focus = maxProb - minProb;

    if (legend) {
      legend.innerHTML =
        "Entropy: " +
        entropy.toFixed(3) +
        " bits · Max probability: " +
        (maxProb * 100).toFixed(1) +
        "% · Focus score: " +
        (focus * 100).toFixed(1) +
        "%";
    }

    updateExplanation(temperature, entropy, focus);
  };

  function updateExplanation(temperature, entropy, focus) {
    if (!explanation) {
      return;
    }

    let tempEffect;
    if (temperature < 0.5) {
      tempEffect =
        "Very low temperature creates extremely sharp attention—the model focuses intensely on the highest-scoring positions.";
    } else if (temperature < 1.0) {
      tempEffect =
        "Low temperature sharpens attention distribution—the strongest scores get even more weight.";
    } else if (temperature === 1.0) {
      tempEffect =
        "Normal temperature provides standard softmax behaviour with a balanced probability spread.";
    } else if (temperature <= 2.0) {
      tempEffect =
        "High temperature flattens attention—the model distributes focus across more positions.";
    } else {
      tempEffect =
        "Very high temperature creates nearly uniform attention—score differences are largely suppressed.";
    }

    let focusLevel;
    if (focus > 0.7) {
      focusLevel = "The model is <strong>highly focused</strong> on specific positions.";
    } else if (focus > 0.4) {
      focusLevel = "The model shows <strong>moderate focus</strong> with some preference emerging.";
    } else {
      focusLevel = "The model has <strong>distributed attention</strong> across most positions.";
    }

    let entropyLevel;
    if (entropy < 1.0) {
      entropyLevel = "Low entropy indicates concentrated attention.";
    } else if (entropy < 2.0) {
      entropyLevel = "Medium entropy shows a balanced attention distribution.";
    } else {
      entropyLevel = "High entropy indicates very distributed attention.";
    }

    explanation.innerHTML =
      '<div class="space-y-2">' +
      "<p><strong>Temperature effect:</strong> " +
      tempEffect +
      "</p>" +
      "<p><strong>Attention pattern:</strong> " +
      focusLevel +
      "</p>" +
      "<p><strong>Distribution analysis:</strong> " +
      entropyLevel +
      "</p>" +
      '<div class="panel panel-warning panel-emphasis text-xs p-2">' +
      "<strong>💡 Tip:</strong> Temperature controls how much the model concentrates attention. Lower values sharpen focus (great for precise retrieval), while higher values encourage broader context awareness." +
      "</div>" +
      "</div>";
  }

  if (exampleBtn) {
    exampleBtn.addEventListener("click", () => {
      const example = examples[exampleIndex];
      scoresSelect.value = example.scores;
      temperatureSlider.value = example.temp;
      updateTemperatureDisplay();
      processAndDisplay();

      exampleBtn.textContent = example.description;
      exampleBtn.title =
        example.explanation + " (" + (exampleIndex + 1) + "/" + examples.length + ")";

      exampleIndex = (exampleIndex + 1) % examples.length;
    });
  }

  scoresSelect.addEventListener("change", processAndDisplay);
  temperatureSlider.addEventListener("input", () => {
    updateTemperatureDisplay();
    processAndDisplay();
  });

  modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateModeIndicator();
      processAndDisplay();
    });
  });

  updateTemperatureDisplay();
  updateModeIndicator();
  processAndDisplay();
};

if (typeof module !== "undefined") {
  module.exports = interactiveScript;
} else if (typeof window !== "undefined") {
  window.question23Interactive = interactiveScript;
}
