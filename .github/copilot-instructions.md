# GitHub Copilot Instructions for gemini Repository

## Project Overview
This is an AI assistant project named "gemini". The project is designed to be accessible to users with varying levels of technical expertise.

## Documentation Style
- **Use beginner-friendly language** with emoji icons for section headers
- Provide clear explanations of technical terms
- Write comprehensive documentation that helps users who may be unfamiliar with the technology

## Code Conventions

### Error Handling
- Use try-catch blocks for JSON parsing and other operations that may fail with corrupted data
- Handle errors gracefully and provide helpful error messages

### Data Storage
- Ensure sensitive data is never committed to the repository
- Add appropriate .gitignore entries for any data directories

### Testing
- Write tests for new functionality when applicable
- Ensure all tests pass before committing changes

### File Organization
- Keep the project structure simple and organized
- Follow existing patterns in the codebase
- Use appropriate .gitignore entries to exclude build artifacts, logs, and sensitive data

## Best Practices
- **Privacy First**: Never commit sensitive data, credentials, or personal information
- **Accessibility**: Write code and documentation that is accessible to beginners
- **Minimal Dependencies**: Keep dependencies minimal and well-justified
- **Clear Commit Messages**: Write descriptive commit messages that explain what and why
- **License Compliance**: All code must comply with the MIT License

## Development Workflow
1. Test changes locally before committing
2. Run any available test suite
3. Update documentation when adding new features
4. Follow the existing code style and patterns

## Security
- Never expose API keys or credentials in code
- Use environment variables for sensitive configuration
- Validate and sanitize user inputs
- Follow secure coding practices for handling user data
