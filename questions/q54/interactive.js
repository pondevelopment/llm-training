const interactiveScript = () => {
  const get = id => document.getElementById(id);
  const logitsSelect = get("q54-logits-select");
  const shift = get("q54-shift");
  const scale = get("q54-scale");
  const temp = get("q54-temp");
  const biasIndex = get("q54-bias-index");
  const biasSize = get("q54-bias-size");
  const table = get("q54-table");
  const insight = get("q54-insight");
  const mathBox = get("q54-math");

  if (!logitsSelect || !shift || !scale || !temp || !biasIndex || !biasSize || !table) {
    return;
  }

  const shiftVal = get("q54-shift-val");
  const scaleVal = get("q54-scale-val");
  const tempVal = get("q54-temp-val");
  const biasSizeVal = get("q54-bias-size-val");

  const formatPercent = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

  function parseLogits() {
    return logitsSelect.value
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
      .filter(value => Number.isFinite(value));
  }

  function softmax(arr) {
    if (!arr.length) return [];
    const max = Math.max(...arr);
    const exps = arr.map(z => Math.exp(z - max));
    const sum = exps.reduce((acc, value) => acc + value, 0);
    return exps.map(value => value / sum);
  }

  function entropy(probs) {
    return -probs.reduce((acc, value) => acc + (value > 0 ? value * Math.log2(value) : 0), 0);
  }

  function ensureBiasOptions(base) {
    const current = parseInt(biasIndex.value, 10);
    const len = base.length;
    biasIndex.innerHTML = base
      .map((value, idx) => `<option value="${idx}">Token ${idx} (${value.toFixed(2)})</option>`)
      .join("");
    if (Number.isNaN(current) || current >= len) {
      biasIndex.value = "0";
    } else {
      biasIndex.value = String(current);
    }
  }

  function recompute() {
    shiftVal.textContent = Number(shift.value).toFixed(1);
    scaleVal.textContent = Number(scale.value).toFixed(2);
    tempVal.textContent = Number(temp.value).toFixed(1);
    biasSizeVal.textContent = Number(biasSize.value).toFixed(2);

    const base = parseLogits();
    if (!base.length) {
      table.innerHTML = "<div class=\"text-danger\">Enter logits.</div>";
      return;
    }

    ensureBiasOptions(base);

    const shiftNum = Number(shift.value);
    const scaleNum = Number(scale.value);
    const tempNum = Number(temp.value);
    const biasNum = Number(biasSize.value);
    const biasIdx = Math.min(Math.max(parseInt(biasIndex.value, 10) || 0, 0), base.length - 1);

    const biased = base.map((value, idx) => (idx === biasIdx ? value + biasNum : value));
    const transformed = biased.map(value => (value + shiftNum) * scaleNum / tempNum);
    const baseline = base.map(value => (value + shiftNum) * scaleNum / tempNum);

    const probs = softmax(transformed);
    const baselineProbs = softmax(baseline);

    const entropyBits = entropy(probs);
    const winnerProb = Math.max(...probs);
    const winner = probs.indexOf(winnerProb);

    renderTable(base, biased, transformed, probs, baselineProbs, winner);

    const winnerDelta = (probs[winner] - baselineProbs[winner]) * 100;
    const biasDelta = (probs[biasIdx] - baselineProbs[biasIdx]) * 100;

    mathBox.innerHTML = "Shift adds c to all logits (no effect after softmax); scale and temperature reshape gaps; bias locally raises a token; final normalization keeps &sum; p = 1.";

    const winnerClass = biasIdx === winner ? "text-info font-semibold" : "text-heading";

    const biasDeltaClass = biasDelta > 0.001 ? "text-success" : biasDelta < -0.001 ? "text-danger" : "text-muted";
    const winnerDeltaClass = winnerDelta > 0.001 ? "text-success" : winnerDelta < -0.001 ? "text-danger" : "text-muted";

    const keyValueRows = [
      {
        label: "Winner",
        value: `<span class="font-mono ${winnerClass}">${winner}</span>`
      },
      {
        label: "Winner probability",
        value: `<span class="font-mono text-heading">${formatPercent(winnerProb)}</span>`
      },
      {
        label: "Entropy",
        value: `<span class="font-mono text-heading">${entropyBits.toFixed(3)} bits</span>`
      },
      {
        label: "Bias target",
        value: `<span class="font-mono text-heading">Token ${biasIdx}</span>`
      },
      {
        label: "Bias probability",
        value: `<span class="font-mono text-heading">${formatPercent(probs[biasIdx], 2)}</span>`
      },
      {
        label: "Bias delta",
        value: `<span class="font-mono ${biasDeltaClass}">${biasDelta.toFixed(2)}%</span>`
      },
      {
        label: "Δ winner vs baseline",
        value: `<span class="font-mono ${winnerDeltaClass}">${winnerDelta.toFixed(2)}%</span>`
      }
    ]
      .map(
        row =>
          `<div class="q54-kv-row"><span class="q54-kv-label">${row.label}</span><span class="q54-kv-value">${row.value}</span></div>`
      )
      .join("");

    insight.innerHTML = `
      <div class="panel panel-neutral panel-emphasis q54-insight-panel">
        <div class="q54-kv">${keyValueRows}</div>
      </div>
    `;
  }

  function renderTable(base, biased, transformed, probs, baselineProbs, winner) {
    const maxProb = Math.max(...probs) || 1;
    const header = `<table class="q54-table text-[11px]"><thead>
      <tr class="text-muted font-semibold">
        <th class="text-left">#</th>
        <th class="text-right">Base</th>
        <th class="text-right">Biased</th>
        <th class="text-right">Transformed</th>
        <th class="text-right">p</th>
        <th class="text-right">&Delta;p</th>
        <th class="text-left">Distribution</th>
      </tr>
    </thead><tbody>`;

    const rows = base
      .map((value, idx) => {
        const p = probs[idx];
        const delta = p - (baselineProbs[idx] || 0);
        const bar = Math.round((p / maxProb) * 100);
        const isWinner = idx === winner;
        const changed = biased[idx] !== value;

        const rowClasses = ["q54-row"];
        if (isWinner) rowClasses.push("q54-row--winner");
        if (changed) rowClasses.push("q54-row--biased");

        const probText = formatPercent(p);
        const deltaText = (delta * 100).toFixed(2) + "%";
        const deltaClass = delta > 0.0001 ? "text-success" : delta < -0.0001 ? "text-danger" : "text-muted";

        return `<tr class="${rowClasses.join(" ")}">
          <td class="q54-cell q54-cell--index ${isWinner ? "text-info font-semibold" : "text-heading"}">${idx}</td>
          <td class="q54-cell text-right">${value.toFixed(2)}</td>
          <td class="q54-cell text-right ${changed ? "q54-cell--biased" : ""}" title="${changed ? "Bias adjustments applied" : ""}">${biased[idx].toFixed(2)}</td>
          <td class="q54-cell text-right">${transformed[idx].toFixed(2)}</td>
          <td class="q54-cell text-right ${isWinner ? "text-info font-semibold" : ""}">${probText}</td>
          <td class="q54-cell text-right ${deltaClass}">${deltaText}</td>
          <td class="q54-cell">
            <div class="q54-bar">
              <div class="q54-bar-fill ${isWinner ? "q54-bar-fill--winner" : ""}" style="width:${bar}%"></div>
              ${bar > 18 ? `<span class="q54-bar-label">${probText}</span>` : ""}
            </div>
          </td>
        </tr>`;
      })
      .join("");

    const footer = `</tbody></table>
      <div class="q54-legend text-[10px] text-muted">
        <span class="q54-legend-item"><span class="q54-swatch q54-swatch--winner"></span>Winner</span>
        <span class="q54-legend-item"><span class="q54-swatch q54-swatch--bias"></span>Bias affected</span>
        <span>Transformed = (biased + shift) &times; scale &divide; T</span>
        <span>&Delta;p = change vs no-bias baseline</span>
      </div>`;

    table.innerHTML = header + rows + footer;
  }

  [logitsSelect, shift, scale, temp, biasIndex, biasSize].forEach(element => {
    element.addEventListener("input", recompute);
    element.addEventListener("change", recompute);
  });

  const resetBtn = get("q54-reset");
  resetBtn?.addEventListener("click", () => {
    logitsSelect.selectedIndex = 1;
    shift.value = "0";
    scale.value = "1";
    temp.value = "1";
    biasIndex.value = "0";
    biasSize.value = "0";
    recompute();
  });

  const randomBtn = get("q54-random");
  randomBtn?.addEventListener("click", () => {
    const length = 5 + Math.floor(Math.random() * 3);
    const arr = Array.from({ length }, () => (Math.random() * 4 - 2).toFixed(1));
    const option = document.createElement("option");
    option.textContent = "Random: " + arr.join(",");
    option.value = arr.join(",");
    logitsSelect.appendChild(option);
    logitsSelect.selectedIndex = logitsSelect.options.length - 1;
    recompute();
  });

  recompute();
};

if (typeof module !== "undefined") {
  module.exports = interactiveScript;
} else if (typeof window !== "undefined") {
  window.question54Interactive = interactiveScript;
}
