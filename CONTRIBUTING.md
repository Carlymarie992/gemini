# Contributing to Gemini OCR Tools

Thank you for your interest in contributing! This project welcomes contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node.js version)
- Any relevant error messages

### Suggesting Features

Feature requests are welcome! Please open an issue and include:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Submitting Pull Requests

1. **Fork the repository** and create a new branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**:
   - Follow the existing code style (ES6 modules)
   - Add tests if applicable
   - Update documentation as needed
4. **Test your changes**:
   - Run `node scripts/ocr-test.js` to verify OCR functionality
   - Test any scripts you modified
   - Ensure no new errors are introduced
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

### Code Style Guidelines

- Use ES6 modules (`import`/`export`)
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use meaningful variable and function names

### Documentation

When adding new features:
- Update relevant markdown files
- Add examples to `OCR-EXAMPLES.md` if adding OCR functionality
- Update `README.md` if changing core functionality
- Include inline code comments for complex logic

### Testing

- Test your changes manually before submitting
- Verify OCR scripts work with different image types
- Check that error handling works correctly
- Test on different operating systems if possible

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/gemini.git
cd gemini

# Install dependencies
npm install

# Test OCR setup
node scripts/ocr-test.js

# Create a feature branch
git checkout -b feature/your-feature-name
```

## Project Structure

```
gemini/
├── scripts/           # OCR command-line scripts
├── src/              # Angular application source
├── knowledge_base/   # Training materials
├── OCR-*.md         # OCR documentation
└── README.md        # Main documentation
```

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Check existing issues and pull requests
- Review the documentation in the repository

## Code of Conduct

Please note that this project follows a Code of Conduct (see CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
