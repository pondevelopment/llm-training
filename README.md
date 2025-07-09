# Top 50 LLM Interview Questions

An interactive learning experience with hands-on examples for the most important Large Language Model (LLM) interview questions.

## 🎯 Overview

This project provides an interactive web application that covers essential LLM concepts through 9 comprehensive questions. Each question includes detailed explanations, practical examples, and interactive simulators to help you understand the concepts deeply.

## 📚 Questions Covered

1. **Tokenization** - Understanding how text is broken down for LLM processing
2. **Attention Mechanism** - How transformers focus on relevant parts of input
3. **Context Window** - The limitations and importance of sequence length
4. **LoRA vs QLoRA** - Efficient fine-tuning techniques comparison
5. **Beam Search vs Greedy Decoding** - Text generation strategies
6. **Temperature in Text Generation** - Controlling randomness and creativity
7. **Embeddings** - How models understand semantic meaning
8. **RLHF (Reinforcement Learning from Human Feedback)** - Aligning models with human preferences
9. **Autoregressive vs Masked Models** - Different training paradigms (GPT vs BERT)

## 🚀 Features

- **Interactive Simulators**: Hands-on examples for each concept
- **Progressive Learning**: Navigate between questions with ease
- **Visual Demonstrations**: Charts, graphs, and interactive elements
- **Comprehensive Explanations**: Theory combined with practical insights
- **Mobile Responsive**: Works on all devices

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Architecture**: Modular question loading system
- **Styling**: Modern, responsive design with interactive components

## 📁 Project Structure

```
top-50-llm-questions/
├── index.html                 # Main application entry point
├── js/
│   ├── app.js                # Main application logic and navigation
│   └── questionLoader.js     # Dynamic question loading system
├── questions/
│   ├── question-01.js        # Tokenization
│   ├── question-02.js        # Attention Mechanism
│   ├── question-03.js        # Context Window
│   ├── question-04.js        # LoRA vs QLoRA
│   ├── question-05.js        # Beam Search vs Greedy
│   ├── question-06.js        # Temperature
│   ├── question-07.js        # Embeddings
│   ├── question-08.js        # RLHF
│   ├── question-09.js        # Autoregressive vs Masked
│   └── question-template.js  # Template for new questions
├── docs/
│   ├── QUESTION_TEMPLATE_GUIDE.md
│   └── QUESTION_CHECKLIST.md
└── README.md
```

## 🎮 How to Use

1. **Clone or Download**: Get the project files
2. **Open**: Launch `index.html` in your web browser
3. **Navigate**: Use the dropdown menu or arrow keys to move between questions
4. **Interact**: Try the interactive simulators and examples
5. **Learn**: Read the explanations and experiment with different parameters

## 🔧 Development

### Adding New Questions

1. Copy `questions/question-template.js` to create a new question file
2. Follow the guidelines in `docs/QUESTION_TEMPLATE_GUIDE.md`
3. Update the `availableQuestions` array in `js/app.js`
4. Add the question title to the `questionTitles` object in `js/app.js`
5. Test the new question thoroughly using `docs/QUESTION_CHECKLIST.md`

### Key Features

- **Modular Architecture**: Each question is self-contained
- **Dynamic Loading**: Questions load on-demand for better performance
- **Caching System**: Visited questions are cached for smooth navigation
- **Error Handling**: Graceful fallbacks for loading issues
- **Keyboard Navigation**: Arrow keys for quick question switching

## 📖 Educational Approach

Each question follows a structured format:
- **Concept Introduction**: Clear explanation of the topic
- **Practical Examples**: Real-world applications and use cases
- **Interactive Simulator**: Hands-on experience with the concept
- **Visual Aids**: Charts, diagrams, and interactive elements
- **Key Takeaways**: Summary of important points

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and documentation standards
4. Test your changes thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎓 Perfect For

- **Job Interview Preparation**: Comprehensive coverage of LLM interview topics
- **Learning LLM Concepts**: Interactive way to understand complex topics
- **Teaching**: Use as a resource for courses or workshops
- **Reference**: Quick lookup for LLM concepts and implementations

## 🔄 Recent Updates

- Added Question 9: Autoregressive vs Masked Models comparison
- Enhanced RLHF simulator with 5 training examples and in-site notifications
- Improved navigation with dropdown menu showing all questions
- Fixed UI issues and enhanced educational content
- Added comprehensive documentation and templates

---

**Built with ❤️ for the LLM community**
