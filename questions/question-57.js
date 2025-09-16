// Question 57 now loads via questions/manifest.json for dynamic HTML/JS assets.
// This stub is kept for backward compatibility and developer tooling.
const question = {
  title: "57. What are the fundamentals of in-context learning?",
  answer: '<div class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-600">Question content loads dynamically from questions/manifest.json.</div>',
  interactive: {
    title: "🎛️ In-context prompt tuner (dynamic)",
    html: '<div class="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-xs text-gray-500">Interactive content loads dynamically from questions/manifest.json.</div>',
    script: () => {}
  }
};

if (typeof module !== 'undefined') {
  module.exports = question;
}
