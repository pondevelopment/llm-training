// Question 13: Prompt Engineering for LLM Performance
// Created: July 11, 2025
// Educational Focus: Prompt engineering techniques, zero-shot vs few-shot learning, prompt structure optimization

const question = {
    title: "13. Why is prompt engineering crucial for LLM performance?",
    answer: `
        <div class="space-y-4">
            <!-- Recommended Reading -->
            <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
                <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                    <li><a href="#question-01" class="text-indigo-700 underline hover:text-indigo-900">Question 1: Tokenization – foundation for how prompts are chunked</a></li>
                    <li><a href="#question-02" class="text-indigo-700 underline hover:text-indigo-900">Question 2: Attention – how the model locates relevant parts of your prompt</a></li>
                    <li><a href="#question-06" class="text-indigo-700 underline hover:text-indigo-900">Question 6: Temperature – tuning creativity after prompt structuring</a></li>
                    <li><a href="#question-12" class="text-indigo-700 underline hover:text-indigo-900">Question 12: Top-k vs Top-p – sampling strategies influenced by prompt clarity</a></li>
                    <li><a href="#question-17" class="text-indigo-700 underline hover:text-indigo-900">Question 17: Preference Optimization – downstream alignment shaping prompt response style</a></li>
                </ul>
            </div>
            <!-- Main Concept -->
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Prompt Engineering?</h4>
                <p class="text-blue-800">
                    Prompt engineering is the art and science of crafting input instructions to guide Large Language Models 
                    toward producing desired outputs. Think of it like giving directions to a very capable but literal assistant - 
                    the clearer and more specific your instructions, the better the results you'll get.
                </p>
            </div>

            <!-- 2025 Updates -->
            <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-semibold text-gray-900 mb-2">✨ What's new in 2025 prompt engineering</h4>
                <ul class="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Structured outputs</strong>: Ask for strict JSON (or XML/Markdown) with a defined schema to improve reliability and parsing.</li>
                    <li>• <strong>Grounded answers</strong>: Provide context and require citations; instruct the model to answer with "NOT FOUND" when info is missing.</li>
                    <li>• <strong>System/developer prompts</strong>: Separate role-level instructions from user content for stability.</li>
                    <li>• <strong>Affordances</strong> (tools/functions): Prefer tool use/search/calculators instead of recalling facts from memory.</li>
                    <li>• <strong>Clear delimiters</strong>: Use XML/Markdown sections and repeat key instructions at the end to offset recency bias.</li>
                    <li>• <strong>Evaluate and iterate</strong>: Keep a small eval set; A/B prompts; measure format adherence and accuracy, not just style.</li>
                    <li>• <strong>Long-context tips</strong>: Chunk, summarize, and reference anchors; avoid gratuitous verbosity.</li>
                </ul>
            </div>

            <!-- Prompt Types Comparison -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <h5 class="font-medium text-green-900">🚀 Zero-Shot Prompting</h5>
                    <p class="text-sm text-green-700 mb-2">
                        Direct task instruction without examples. Relies on the model's pre-trained knowledge.
                    </p>
                    <code class="text-xs bg-green-100 px-1 rounded block">
                        "Translate this to French: Hello world"
                    </code>
                </div>
                
                <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <h5 class="font-medium text-purple-900">📚 Few-Shot Prompting</h5>
                    <p class="text-sm text-purple-700 mb-2">
                        Provides 2-5 examples to demonstrate the desired pattern and format.
                    </p>
                    <code class="text-xs bg-purple-100 px-1 rounded block">
                        "Cat → Animal\nRose → Plant\nCar → ?"
                    </code>
                </div>
                
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <h5 class="font-medium text-orange-900">🔧 Chain-of-Thought</h5>
                    <p class="text-sm text-orange-700 mb-2">
                        Guides the model to show its reasoning process step-by-step.
                    </p>
                    <code class="text-xs bg-orange-100 px-1 rounded block">
                        "Let's think step by step: First..."
                    </code>
                </div>
            </div>

            <!-- Advanced Techniques -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                    <h5 class="font-medium text-indigo-900">🎭 Role-Based Prompting</h5>
                    <p class="text-sm text-indigo-700">
                        Assign the model a specific role or persona to get specialized responses.
                    </p>
                    <code class="text-xs bg-indigo-100 px-1 rounded block mt-1">
                        "You are a senior software engineer..."
                    </code>
                </div>
                
                <div class="bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                    <h5 class="font-medium text-teal-900">📏 Format Specification</h5>
                    <p class="text-sm text-teal-700">
                        Explicitly define the desired output structure and constraints.
                    </p>
                    <code class="text-xs bg-teal-100 px-1 rounded block mt-1">
                        "Respond in exactly 3 bullet points..."
                    </code>
                </div>
            </div>

            <!-- Why It Matters -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Prompt Engineering is Crucial</h4>
                <ul class="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Cost Efficiency:</strong> Good prompts can eliminate the need for expensive fine-tuning</li>
                    <li>• <strong>Consistency:</strong> Well-crafted prompts produce more reliable and predictable outputs</li>
                    <li>• <strong>Versatility:</strong> Same model can handle diverse tasks with different prompting strategies</li>
                    <li>• <strong>Rapid Iteration:</strong> Quick experimentation and refinement without retraining models</li>
                    <li>• <strong>Performance Boost:</strong> Can improve accuracy from 40% to 85%+ on complex tasks</li>
                </ul>
            </div>

            <!-- Best Practices -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">💡 Key Prompt Engineering Principles</h4>
                <div class="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <strong class="text-green-700">✅ Do:</strong>
                        <ul class="text-gray-700 ml-4 mt-1">
                            <li>• Be specific and clear</li>
                            <li>• Provide context and examples</li>
                            <li>• Define output format</li>
                            <li>• Use delimiters for sections</li>
                        </ul>
                    </div>
                    <div>
                        <strong class="text-red-700">❌ Avoid:</strong>
                        <ul class="text-gray-700 ml-4 mt-1">
                            <li>• Vague or ambiguous instructions</li>
                            <li>• Contradictory requirements</li>
                            <li>• Overly long prompts</li>
                            <li>• Assuming implied context</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
    interactive: {
        title: "🛠️ Interactive Prompt Engineering Workshop",
        html: `
            <div class="space-y-6">
                <!-- Task Selection -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q13-task-select" class="block text-sm font-medium text-gray-700 mb-2">📋 Select a Task to Optimize</label>
                    <select id="q13-task-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="0" selected>Email Classification (Spam/Not Spam)</option>
                        <option value="1">Product Review Sentiment Analysis</option>
                        <option value="2">Code Explanation and Documentation</option>
                        <option value="3">Creative Story Writing</option>
                        <option value="4">Data Extraction from Text</option>
                        <option value="5">Language Translation</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Choose different tasks to see how prompt engineering techniques adapt to various use cases!</p>
                </div>
                
                <!-- Prompt Strategy Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Prompt Engineering Strategy</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="basic" class="mr-3" checked>
                            <div>
                                <div class="font-medium text-sm">Basic</div>
                                <div class="text-xs text-gray-500">Simple instruction</div>
                                <div class="text-xs bg-red-100 text-red-700 px-1 rounded mt-1">Often unclear</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="zero-shot" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Zero-Shot</div>
                                <div class="text-xs text-gray-500">Clear, detailed task</div>
                                <div class="text-xs bg-yellow-100 text-yellow-700 px-1 rounded mt-1">Good baseline</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="few-shot" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Few-Shot</div>
                                <div class="text-xs text-gray-500">With examples</div>
                                <div class="text-xs bg-blue-100 text-blue-700 px-1 rounded mt-1">Most reliable</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="chain-of-thought" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">CoT</div>
                                <div class="text-xs text-gray-500">Step-by-step</div>
                                <div class="text-xs bg-green-100 text-green-700 px-1 rounded mt-1">Best reasoning</div>
                            </div>
                        </label>

                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="structured-json" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Structured JSON</div>
                                <div class="text-xs text-gray-500">Schema-constrained</div>
                                <div class="text-xs bg-indigo-100 text-indigo-700 px-1 rounded mt-1">Parsable</div>
                            </div>
                        </label>

                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q13-strategy" value="grounded" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Grounded</div>
                                <div class="text-xs text-gray-500">Use provided context</div>
                                <div class="text-xs bg-purple-100 text-purple-700 px-1 rounded mt-1">Citations</div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Prompt Display -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">📝 Generated Prompt</h4>
                        <div id="q13-strategy-indicator" class="text-xs px-2 py-1 rounded font-medium">Basic</div>
                    </div>
                    <div id="q13-prompt-display" class="min-h-[120px] p-4 bg-gray-50 rounded border font-mono text-sm whitespace-pre-wrap"></div>
                    <div class="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <span id="q13-prompt-length">Prompt length: 0 characters</span>
                        <button id="q13-copy-prompt" class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">
                            📋 Copy Prompt
                        </button>
                    </div>
                </div>
                
                <!-- Performance Simulation -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">📊 Expected Performance</h4>
                        <div id="q13-accuracy-score" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Accuracy: 0%</div>
                    </div>
                    
                    <!-- Performance Metrics -->
                    <div class="grid md:grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-600" id="q13-accuracy">45%</div>
                            <div class="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-600" id="q13-consistency">60%</div>
                            <div class="text-xs text-gray-500">Consistency</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-purple-600" id="q13-efficiency">Low</div>
                            <div class="text-xs text-gray-500">Token Efficiency</div>
                        </div>
                    </div>
                    
                    <!-- Visual Performance Bar -->
                    <div class="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div id="q13-performance-bar" class="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all duration-500" style="width: 45%"></div>
                        <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                            <span id="q13-performance-text">Poor Performance</span>
                        </div>
                    </div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">💡 Why This Strategy Works</h4>
                    <div id="q13-explanation" class="text-sm text-yellow-800"></div>
                </div>
            </div>
        `,
        script: () => {
            // Task definitions with prompts for each strategy
            const tasks = [
                {
                    name: "Email Classification",
                    description: "Classify emails as spam or legitimate",
                    prompts: {
                        basic: "Classify this email:",
                        "zero-shot": "Classify the following email as either 'SPAM' or 'LEGITIMATE'. Consider factors like urgency tactics, suspicious links, poor grammar, and unrealistic offers.\n\nEmail:",
                        "few-shot": "Classify emails as 'SPAM' or 'LEGITIMATE' based on these examples:\n\nEmail: 'URGENT! Claim your $1000 prize NOW! Click here immediately!'\nClassification: SPAM\n\nEmail: 'Hi John, here's the quarterly report you requested. Best regards, Sarah'\nClassification: LEGITIMATE\n\nEmail: 'You've won the lottery! Send your bank details to claim $50,000!'\nClassification: SPAM\n\nNow classify this email:",
                        "chain-of-thought": "Classify this email as 'SPAM' or 'LEGITIMATE' by thinking step by step:\n\n1. Check for urgency tactics (ALL CAPS, 'URGENT', 'LIMITED TIME')\n2. Look for suspicious requests (money, personal info, clicking links)\n3. Assess the sender and writing quality\n4. Consider if the offer seems too good to be true\n5. Make final classification with reasoning\n\nEmail:",
                        "structured-json": "You are an email classifier. Return a strict JSON object only. Schema: {\"label\": \"SPAM|LEGITIMATE|UNKNOWN\", \"confidence\": number, \"reasons\": string[]}\nRules: No extra keys. confidence in [0,1]. If insufficient evidence, set label='UNKNOWN'.\nEmail:",
                        "grounded": "Using ONLY the provided CONTEXT, classify the email as 'SPAM' or 'LEGITIMATE'. If the answer cannot be determined from the CONTEXT, reply exactly 'NOT FOUND'. Include citations as [1], [2] that support the decision.\n\nCONTEXT:\n<docs>...paste signals or policy snippets here...</docs>\n\nEMAIL:"
                    },
                    performance: { basic: 45, "zero-shot": 72, "few-shot": 85, "chain-of-thought": 89, "structured-json": 87, grounded: 88 }
                },
                {
                    name: "Sentiment Analysis",
                    description: "Analyze product review sentiment",
                    prompts: {
                        basic: "What's the sentiment?",
                        "zero-shot": "Analyze the sentiment of this product review and classify it as POSITIVE, NEGATIVE, or NEUTRAL. Consider the overall tone, specific complaints or praise, and the reviewer's satisfaction level.\n\nReview:",
                        "few-shot": "Classify the sentiment of product reviews as POSITIVE, NEGATIVE, or NEUTRAL:\n\nReview: 'This product exceeded my expectations! Great quality and fast shipping.'\nSentiment: POSITIVE\n\nReview: 'Product broke after 2 days. Waste of money. Poor customer service.'\nSentiment: NEGATIVE\n\nReview: 'It's okay, does what it's supposed to do. Nothing special but works fine.'\nSentiment: NEUTRAL\n\nNow classify this review:",
                        "chain-of-thought": "Analyze this product review's sentiment step by step:\n\n1. Identify positive words/phrases (excellent, great, love, recommend, etc.)\n2. Identify negative words/phrases (terrible, broken, waste, disappointed, etc.)\n3. Look for neutral/balanced language\n4. Consider the overall context and conclusion\n5. Classify as POSITIVE, NEGATIVE, or NEUTRAL with explanation\n\nReview:",
                        "structured-json": "Return JSON only with schema: {\"label\": \"POSITIVE|NEGATIVE|NEUTRAL\", \"confidence\": number, \"evidence\": string[]}\nRules: No prose. confidence in [0,1].\nReview:",
                        "grounded": "Answer using ONLY the supplied CONTEXT. If the CONTEXT does not contain the sentiment, reply 'NOT FOUND'. Provide a one-sentence quote as citation in [1] that supports the label.\n\nCONTEXT:\n<review>...paste the review text or snippets here...</review>\n\nTASK: Classify as POSITIVE, NEGATIVE, or NEUTRAL with citation."
                    },
                    performance: { basic: 40, "zero-shot": 68, "few-shot": 82, "chain-of-thought": 86, "structured-json": 85, grounded: 84 }
                },
                {
                    name: "Code Documentation",
                    description: "Explain and document code functions",
                    prompts: {
                        basic: "Explain this code:",
                        "zero-shot": "Provide clear documentation for this code function including: purpose, parameters, return value, and usage example. Write in a professional style suitable for API documentation.\n\nCode:",
                        "few-shot": "Document code functions following this format:\n\nCode: def add(a, b): return a + b\nDocumentation:\n**Purpose:** Adds two numbers together\n**Parameters:** a (number), b (number)\n**Returns:** Sum of a and b\n**Example:** add(3, 5) returns 8\n\nCode: def find_max(arr): return max(arr)\nDocumentation:\n**Purpose:** Finds the maximum value in an array\n**Parameters:** arr (list of numbers)\n**Returns:** The largest number in the array\n**Example:** find_max([1, 5, 3]) returns 5\n\nNow document this code:",
                        "chain-of-thought": "Document this code by analyzing it step by step:\n\n1. Read through the code and understand its logic\n2. Identify the main purpose/functionality\n3. List all parameters and their types\n4. Determine what the function returns\n5. Think of practical use cases\n6. Write clear documentation with examples\n\nCode:",
                        "structured-json": "Return JSON only with schema: {\"purpose\": string, \"parameters\": [{\"name\": string, \"type\": string, \"desc\": string}], \"returns\": {\"type\": string, \"desc\": string}, \"example\": string}\nNo extra keys.\nCode:",
                        "grounded": "Document the code using ONLY the inline docstrings/comments in the provided CONTEXT. If the CONTEXT is missing details, respond 'NOT FOUND' for unknown fields. Output JSON: {purpose, parameters[], returns, example}.\n\nCONTEXT:\n<code>...paste code with comments here...</code>"
                    },
                    performance: { basic: 35, "zero-shot": 65, "few-shot": 88, "chain-of-thought": 92, "structured-json": 90, grounded: 80 }
                },
                {
                    name: "Creative Writing",
                    description: "Generate creative story content",
                    prompts: {
                        basic: "Write a story:",
                        "zero-shot": "Write a creative short story (200-300 words) with engaging characters, a clear plot, and vivid descriptions. Include dialogue and create a satisfying conclusion.\n\nTopic:",
                        "few-shot": "Write creative short stories following these examples:\n\nTopic: A mysterious door\nStory: Sarah hesitated at the ornate door. Its bronze handle felt warm despite the cold hallway. 'Just open it,' she whispered. Inside, a garden bloomed impossibly, defying the building's concrete reality. An old man smiled from a bench. 'Welcome,' he said, 'to where lost dreams take root.'\n\nTopic: Time travel mishap\nStory: The machine sparked violently. Jake found himself in 1985, but something was wrong—dinosaurs roamed the streets. His calculations were off by 65 million years, not 40. A T-Rex looked curiously at his lab coat. 'Well,' Jake sighed, pulling out his emergency flare, 'this complicates things.'\n\nNow write a story for this topic:",
                        "chain-of-thought": "Create a compelling short story by following these steps:\n\n1. Establish the setting and main character\n2. Introduce a conflict or interesting situation\n3. Develop the plot with rising action\n4. Include realistic dialogue and vivid descriptions\n5. Build to a climax\n6. Provide a satisfying resolution\n7. Keep it engaging and well-paced\n\nTopic:",
                        "structured-json": "Create a story outline as JSON only: {\"title\": string, \"characters\": string[], \"setting\": string, \"conflict\": string, \"resolution\": string}. No prose.",
                        "grounded": "Write a summary using ONLY the provided lore bible in CONTEXT. If details are missing, reply 'NOT FOUND'. Include bracket citations [1] next to claims.\n\nCONTEXT:\n<lore>...paste canon snippets here...</lore>\n\nTOPIC:"
                    },
                    performance: { basic: 50, "zero-shot": 70, "few-shot": 85, "chain-of-thought": 88, "structured-json": 78, grounded: 72 }
                },
                {
                    name: "Data Extraction",
                    description: "Extract structured data from text",
                    prompts: {
                        basic: "Extract the data:",
                        "zero-shot": "Extract structured information from the following text and format it as JSON with fields: name, date, amount, category. Only include explicitly mentioned information.\n\nText:",
                        "few-shot": "Extract data from text and format as JSON:\n\nText: 'John Smith purchased office supplies on March 15th for $127.50'\nJSON: {\"name\": \"John Smith\", \"date\": \"March 15th\", \"amount\": \"$127.50\", \"category\": \"office supplies\"}\n\nText: 'Sarah bought groceries yesterday, spent $85 at the supermarket'\nJSON: {\"name\": \"Sarah\", \"date\": \"yesterday\", \"amount\": \"$85\", \"category\": \"groceries\"}\n\nNow extract data from this text:",
                        "chain-of-thought": "Extract structured data step by step:\n\n1. Read the text carefully\n2. Identify person names (look for proper nouns)\n3. Find dates (specific dates, relative terms like 'yesterday')\n4. Locate monetary amounts ($ symbols, numbers + currency)\n5. Determine categories (what was purchased/the transaction type)\n6. Format as clean JSON with consistent field names\n7. Only include information explicitly stated\n\nText:",
                        "structured-json": "Return JSON only with schema: {\"name\": string|null, \"date\": string|null, \"amount\": string|null, \"category\": string|null}. If missing, use null. No prose.\nText:",
                        "grounded": "Extract ONLY facts present in CONTEXT and output JSON {name,date,amount,category}. If any field is absent, use null. If none present, reply 'NOT FOUND'. Include citations array with the exact supporting span.\n\nCONTEXT:\n<text>...paste source text here...</text>"
                    },
                    performance: { basic: 30, "zero-shot": 75, "few-shot": 90, "chain-of-thought": 93, "structured-json": 95, grounded: 96 }
                },
                {
                    name: "Language Translation",
                    description: "Translate text between languages",
                    prompts: {
                        basic: "Translate this:",
                        "zero-shot": "Translate the following text from English to French. Maintain the original meaning, tone, and formality level. Provide only the translation.\n\nText:",
                        "few-shot": "Translate English to French following these examples:\n\nEnglish: 'Good morning, how are you today?'\nFrench: 'Bonjour, comment allez-vous aujourd'hui ?'\n\nEnglish: 'The weather is beautiful outside.'\nFrench: 'Il fait beau dehors.'\n\nEnglish: 'I would like to book a table for two people.'\nFrench: 'Je voudrais réserver une table pour deux personnes.'\n\nNow translate this text:",
                        "chain-of-thought": "Translate from English to French step by step:\n\n1. Analyze the text structure and identify key phrases\n2. Consider the formality level (formal/informal)\n3. Translate word by word, considering context\n4. Adjust for French grammar rules (gender, verb conjugation)\n5. Review for natural flow and cultural appropriateness\n6. Provide the final polished translation\n\nText:",
                        "structured-json": "Return JSON only: {\"translation\": string, \"register\": \"formal|informal|neutral\"}. No additional text.\nText:",
                        "grounded": "Translate using ONLY the provided glossary/context. If a term is not in the glossary, keep it in source language and reply with 'NOT FOUND' for unknown terms. Output JSON: {translation, unresolved_terms: string[]}.\n\nCONTEXT:\n<glossary>...paste terminology/glossary here...</glossary>\n\nText:"
                    },
                    performance: { basic: 55, "zero-shot": 78, "few-shot": 87, "chain-of-thought": 85, "structured-json": 88, grounded: 90 }
                }
            ];

            // Configuration for each strategy
            const strategyConfig = {
                basic: {
                    name: "Basic",
                    color: "text-red-700",
                    bgColor: "bg-red-100",
                    explanation: "Basic prompts are too vague and lack context. They often lead to inconsistent results because the model has to guess what you want. This approach wastes tokens and produces unreliable outputs."
                },
                "zero-shot": {
                    name: "Zero-Shot",
                    color: "text-yellow-700", 
                    bgColor: "bg-yellow-100",
                    explanation: "Zero-shot prompts provide clear instructions and context without examples. They work well for straightforward tasks and are token-efficient. The model relies on its training to understand the task format."
                },
                "few-shot": {
                    name: "Few-Shot",
                    color: "text-blue-700",
                    bgColor: "bg-blue-100", 
                    explanation: "Few-shot prompts include 2-5 examples that demonstrate the desired input-output pattern. This dramatically improves consistency and accuracy by showing the model exactly what format and style you want."
                },
                "chain-of-thought": {
                    name: "Chain-of-Thought",
                    color: "text-green-700",
                    bgColor: "bg-green-100",
                    explanation: "Chain-of-thought prompting guides the model to show its reasoning process. This improves accuracy on complex tasks by breaking them into logical steps, though it uses more tokens."
                },
                "structured-json": {
                    name: "Structured JSON",
                    color: "text-indigo-700",
                    bgColor: "bg-indigo-100",
                    explanation: "Schema-constrained prompting requests strict JSON so outputs are machine-parseable. Define fields, types, and allowed values; forbid extra keys. Great for integrations and evaluation."
                },
                grounded: {
                    name: "Grounded",
                    color: "text-purple-700",
                    bgColor: "bg-purple-100",
                    explanation: "Grounded prompting restricts answers to supplied context and requires citations or 'NOT FOUND' when information is missing. This reduces hallucinations and improves trust."
                }
            };

            // DOM elements
            const taskSelect = document.getElementById('q13-task-select');
            const strategyRadios = document.querySelectorAll('input[name="q13-strategy"]');
            const strategyIndicator = document.getElementById('q13-strategy-indicator');
            const promptDisplay = document.getElementById('q13-prompt-display');
            const promptLength = document.getElementById('q13-prompt-length');
            const copyButton = document.getElementById('q13-copy-prompt');
            const accuracyScore = document.getElementById('q13-accuracy-score');
            const accuracyElement = document.getElementById('q13-accuracy');
            const consistencyElement = document.getElementById('q13-consistency');
            const efficiencyElement = document.getElementById('q13-efficiency');
            const performanceBar = document.getElementById('q13-performance-bar');
            const performanceText = document.getElementById('q13-performance-text');
            const explanation = document.getElementById('q13-explanation');

            if (!taskSelect || !promptDisplay) {
                console.error('Required DOM elements not found for Question 13');
                return;
            }

            // Get current selections
            function getCurrentTask() {
                return tasks[parseInt(taskSelect.value)] || tasks[0];
            }

            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q13-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'basic';
            }

            // Update display based on selections
            function updateDisplay() {
                const task = getCurrentTask();
                const strategy = getCurrentStrategy();
                const config = strategyConfig[strategy];
                const prompt = task.prompts[strategy];
                const performance = task.performance[strategy];

                // Update prompt display
                promptDisplay.textContent = prompt;
                promptLength.textContent = `Prompt length: ${prompt.length} characters`;

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.className = `text-xs px-2 py-1 rounded font-medium ${config.color} ${config.bgColor}`;
                }

                // Update performance metrics
                if (accuracyElement) accuracyElement.textContent = `${performance}%`;
                if (consistencyElement) {
                    const consistency = Math.min(95, performance + Math.floor(Math.random() * 10) - 5);
                    consistencyElement.textContent = `${consistency}%`;
                }
                if (efficiencyElement) {
                    const efficiency = prompt.length < 100 ? 'High' : prompt.length < 300 ? 'Medium' : 'Low';
                    efficiencyElement.textContent = efficiency;
                }

                // Update performance bar
                if (performanceBar && performanceText) {
                    performanceBar.style.width = `${performance}%`;
                    let performanceLabel = 'Poor Performance';
                    if (performance >= 85) performanceLabel = 'Excellent Performance';
                    else if (performance >= 70) performanceLabel = 'Good Performance';
                    else if (performance >= 55) performanceLabel = 'Fair Performance';
                    performanceText.textContent = performanceLabel;
                }

                // Update accuracy score
                if (accuracyScore) {
                    accuracyScore.textContent = `Accuracy: ${performance}%`;
                    accuracyScore.className = `text-xs px-2 py-1 rounded font-medium ${
                        performance >= 85 ? 'bg-green-100 text-green-700' :
                        performance >= 70 ? 'bg-blue-100 text-blue-700' :
                        performance >= 55 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`;
                }

                // Update explanation
                if (explanation) {
                    explanation.innerHTML = `
                        <p><strong>${config.name} Strategy for ${task.name}:</strong></p>
                        <p class="mt-2">${config.explanation}</p>
                        <p class="mt-2"><strong>Expected Results:</strong> ${performance}% accuracy with ${
                            strategy === 'few-shot' ? 'high' : 
                            strategy === 'chain-of-thought' ? 'very high' :
                            strategy === 'zero-shot' ? 'moderate' : 'low'
                        } consistency. ${
                            strategy === 'basic' ? 'Consider upgrading to a more structured approach.' :
                            strategy === 'zero-shot' ? 'Good for simple tasks, but examples can help with complex ones.' :
                            strategy === 'few-shot' ? 'Excellent balance of performance and token efficiency.' :
                            'Best for complex reasoning tasks where transparency is important.'
                        }</p>
                    `;
                }
            }

            // Copy prompt to clipboard
            if (copyButton) {
                copyButton.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(promptDisplay.textContent);
                        const originalText = copyButton.textContent;
                        copyButton.textContent = '✅ Copied!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    }
                });
            }

            // Event listeners
            taskSelect.addEventListener('change', updateDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', updateDisplay);
            });

            // Initial display
            updateDisplay();
        }
    }
};
