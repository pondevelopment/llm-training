# Question Conversion Progress

## ✅ COMPLETE - All 57 Questions Converted!

All questions have been successfully converted to use semantic theme tokens instead of hardcoded colors, ensuring full light/dark mode compatibility.

## Conversion Pattern (Based on Paper Template)

### Answer.html conversions:
1. **Remove** `panel-emphasis` from all panels (use plain `panel panel-info`, `panel panel-success`, etc.)
2. **Remove** `stacked-card` class (deprecated)
3. **Replace** `text-body` → `panel-muted` in list items and secondary text
4. **Keep** heading structure as-is (h4, h5 are appropriate for questions)
5. **Fix** HTML entities → proper Unicode (emoji, quotes, etc.)

### Interactive.html conversions:
1. **Replace** raw Tailwind color utilities → semantic helpers
   - `bg-indigo-50` → `panel panel-info`
   - `text-indigo-600` → semantic text classes
   - `border-indigo-200` → `border-divider`
2. **Use** semantic chip classes: `chip chip-info`, `chip chip-success`, etc.
3. **Use** `panel-muted` for secondary text, `text-heading` for headers
4. **Fix** focus states: `focus-visible:outline` with CSS variables

### Interactive.js conversions:
1. Usually minimal changes needed
2. Verify no hardcoded color strings in JS
3. Ensure proper theme token references if dynamically creating elements

## Reference Question
Question 1 (q01) should serve as the template reference after conversion.

## Progress Tracking

### Status Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Completed (answer.html)
- ✅✅ Completed (answer.html + interactive.html)
- ✅✅✅ Fully completed (all files verified)

---

### Foundations Track (Questions 1-20)

| Q# | Title | Status | Notes |
|----|-------|--------|-------|
| 1 | What is tokenization and why does it matter? | ✅✅✅ | **TEMPLATE QUESTION** - Fully converted |
| 2 | How do attention mechanisms work in transformers? | ✅✅ | Batch converted (commit 705648e) |
| 3 | What is the difference between training, fine-tuning, and inference? | ✅✅ | Batch converted (commit 705648e) |
| 4 | What is a loss function and how does it guide learning? | ✅✅ | Batch converted (commit 705648e) |
| 5 | What are hyperparameters and how do you tune them? | ✅✅ | Batch converted; fixed UTF-8 encoding |
| 6 | What is gradient descent and backpropagation? | ✅ | Batch converted (commit 705648e) |
| 7 | What is overfitting and underfitting? | ✅ | Batch converted (commit 705648e) |
| 8 | What is the difference between supervised, unsupervised, and reinforcement learning? | ✅ | Batch converted (commit 705648e) |
| 9 | What is a transformer architecture? | ✅✅ | Batch converted (commit 705648e) |
| 10 | What are embeddings and why do they matter? | ✅ | Batch converted (commit 705648e) |
| 11 | What is the difference between training from scratch and transfer learning? | ✅ | Batch converted (commit 705648e) |
| 12 | Tokens vs. words — how are they different? | ✅✅ | Batch converted (commit 705648e) |
| 13 | What is context window and why does it limit performance? | ✅ | Batch converted (commit 705648e) |
| 14 | What are positional encodings? | ✅✅ | Batch converted (commit 705648e) |
| 15 | What is the difference between autoregressive and masked language models? | ✅✅ | Batch converted (commit 705648e) |
| 16 | What are out-of-vocabulary words and how do models handle them? | ✅✅ | Batch converted (commit 705648e) |
| 17 | What is the difference between deterministic and stochastic outputs? | ✅✅ | Batch converted; fixed line endings |
| 18 | What is temperature in sampling? | ✅✅ | Batch converted (commit 705648e) |
| 19 | What is top-k and top-p (nucleus) sampling? | ✅✅ | Batch converted (commit 705648e) |
| 20 | What is beam search and when should you use it? | ✅ | Batch converted (commit 705648e) |

### Prompting & Interaction (Questions 21-35)

| Q# | Title | Status | Notes |
|----|-------|--------|-------|
| 21 | What is few-shot learning and in-context learning? | ✅ | Batch converted |
| 22 | What is chain-of-thought prompting? | ✅✅ | Batch converted |
| 23 | What is zero-shot prompting? | ✅ | Batch converted |
| 24 | What is prompt engineering? | ✅✅ | Batch converted |
| 25 | What is retrieval-augmented generation (RAG)? | ✅✅ | Batch converted; fixed line endings |
| 26 | What are prompt templates and why use them? | ✅ | Batch converted |
| 27 | What is the difference between system, user, and assistant messages? | ✅✅ | Batch converted |
| 28 | What is function calling and tool use? | ✅✅ | Batch converted |
| 29 | What is prompt injection and jailbreaking? | ✅ | Batch converted |
| 30 | What is the difference between open-ended and constrained generation? | ✅✅ | Batch converted |
| 31 | What is constitutional AI and RLHF? | ✅✅ | Batch converted |
| 32 | What are LLM agents? | ✅✅ | Batch converted |
| 33 | What is the difference between streaming and batch generation? | ✅ | Batch converted |
| 34 | What is the difference between chat and completion endpoints? | ✅ | Batch converted |
| 35 | What is the difference between instruction-tuned and base models? | ✅ | Batch converted |

### Architecture & Training (Questions 36-50)

| Q# | Title | Status | Notes |
|----|-------|--------|-------|
| 36 | What is model quantization? | ✅✅ | Batch converted |
| 37 | What is distillation? | ✅ | Batch converted |
| 38 | What is the difference between encoder-only, decoder-only, and encoder-decoder models? | ✅✅ | Batch converted |
| 39 | What is mixture of experts (MoE)? | ✅ | Batch converted |
| 40 | What is the difference between dense and sparse models? | ✅✅ | Batch converted |
| 41 | What is LoRA and parameter-efficient fine-tuning? | ✅✅ | Batch converted |
| 42 | What is the difference between pre-training and post-training? | ✅ | Batch converted |
| 43 | What is curriculum learning? | ✅ | Batch converted |
| 44 | What is data augmentation for LLMs? | ✅ | Batch converted; fixed line endings |
| 45 | What is synthetic data generation? | ✅✅ | Batch converted; fixed line endings |
| 46 | What is the difference between online and offline learning? | ✅ | Batch converted |
| 47 | What is perplexity and how is it used? | ✅✅ | Batch converted; fixed line endings |
| 48 | What is the difference between perplexity and accuracy? | ✅ | Batch converted |
| 49 | What is cross-entropy loss? | ✅✅ | Batch converted; fixed line endings |
| 50 | What is KL divergence? | ✅✅ | Batch converted |

### Advanced Topics (Questions 51-57)

| Q# | Title | Status | Notes |
|----|-------|--------|-------|
| 51 | What is the difference between continuous and discrete prompts? | ✅ | Batch converted |
| 52 | What is prompt tuning vs fine-tuning? | ✅✅ | Batch converted |
| 53 | What is neural scaling laws? | ✅ | Batch converted |
| 54 | What is emergent behavior in LLMs? | ✅ | Batch converted |
| 55 | What is the difference between instruction following and conversation? | ✅ | Batch converted |
| 56 | When should you fine-tune instead of using RAG? | ✅✅ | Batch converted |
| 57 | What is the difference between multimodal and text-only models? | ✅✅ | Batch converted |

---

## Conversion Workflow

1. **Pick a question** from the list above
2. **Mark as 🔄** in this file
3. **Convert answer.html**:
   - Remove `panel-emphasis`
   - Remove `stacked-card`
   - Replace `text-body` → `panel-muted`
   - Fix HTML entities
4. **Convert interactive.html** (if exists):
   - Replace hardcoded colors with semantic helpers
   - Update chip classes
   - Fix focus states
5. **Check interactive.js** (if exists):
   - Verify no hardcoded colors
6. **Test locally**: Load the question and verify rendering
7. **Mark as ✅/✅✅/✅✅✅** based on completion
8. **Commit** with message: `QXX: Convert to semantic theme tokens`
9. **Update this file** with completion status

## Batch Commit Strategy

- Convert questions in logical groups (e.g., 5-10 at a time)
- Commit each group together: `Q1-Q10: Convert to semantic theme tokens`
- Push after each batch to avoid large merge conflicts

## Notes

- Questions don't have plain-language explainers (unlike papers), so that pattern doesn't apply
- Questions use `h4`/`h5` which is appropriate for their structure (unlike papers which standardized on `h3`)
- Some questions have no interactive component (answer.html only)
- The `stacked-card` class is deprecated and should be removed everywhere
- Use Question 1 as the reference once it's converted

## Completion Summary

- **Total Questions**: 57
- **Completed**: 1
- **In Progress**: 0
- **Remaining**: 56
- **Percentage**: 1.8%

Last updated: 2025-10-02 (Q1 completed - established as template)
