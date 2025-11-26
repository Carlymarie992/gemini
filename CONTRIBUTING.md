# Contributing to Gemini Legal AI Assistant

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🎯 Project Goals

The primary goals of this project are to:
1. Provide simple, powerful legal case management tools
2. Make legal technology accessible to everyone
3. Use clear, plain English in all user-facing features
4. Maintain exceptional quality in OCR and document processing
5. Keep the codebase clean, maintainable, and well-documented

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/gemini.git`
3. Install dependencies: `npm install`
4. Run tests: `npm test`
5. Create a branch: `git checkout -b feature/your-feature-name`

## 💻 Development Guidelines

### Code Style

- Use clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use JSDoc comments for public APIs
- Follow existing code patterns

### Plain English Principle

All user-facing text should be:
- Clear and simple
- Avoid legal jargon when possible
- Explain technical concepts in everyday language
- Use helpful emojis and icons for visual clarity

### Testing

- Run tests before committing: `npm test`
- Add tests for new features
- Ensure all tests pass
- Test CLI commands manually

## 📝 Pull Request Process

1. Update README.md with details of changes if needed
2. Update tests to cover new functionality
3. Ensure all tests pass
4. Update documentation as needed
5. Submit pull request with clear description

### PR Description Template

```
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Reporting Bugs

When reporting bugs, please include:
1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. System information (OS, Node version)
6. Error messages or logs

## 💡 Feature Requests

We welcome feature requests! Please:
1. Check if the feature already exists
2. Describe the feature clearly
3. Explain the use case
4. Consider how it fits with plain English design

## 🔧 Project Structure

```
gemini/
├── src/
│   ├── core/          # Core functionality
│   ├── modules/       # Feature modules
│   └── utils/         # Utility functions
├── test/              # Test files
├── data/              # Data storage
├── cli.js             # CLI interface
├── index.js           # Main entry point
└── README.md          # Documentation
```

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same ISC License that covers this project.

## ❓ Questions?

Feel free to open an issue for questions or clarification.

Thank you for contributing! 🎉
