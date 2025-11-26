# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Gemini OCR Tools seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via GitHub's security advisory feature:

1. Go to the repository's Security tab
2. Click "Report a vulnerability"
3. Fill out the form with details about the vulnerability

Alternatively, you can email the maintainer directly. Please include:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## What to Expect

- You should receive a response within 48 hours acknowledging your report
- We will investigate the issue and determine its severity
- We will work on a fix and release a patch as soon as possible
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices for Users

When using this project:

1. **Environment Variables**: Never commit API keys or sensitive data to version control
2. **Dependencies**: Keep your dependencies up to date:
   - Run `npm update` to update to latest compatible versions
   - Run `npm audit` to check for known security vulnerabilities
   - Run `npm audit fix` to automatically fix issues when possible
3. **Input Validation**: Be cautious when processing untrusted images or PDFs
4. **File Permissions**: Ensure output directories have appropriate permissions
5. **.env Files**: Always use `.env.local` or `.env` (gitignored) for sensitive configuration

## Known Security Considerations

- This tool processes user-provided images and PDFs. Always validate and sanitize file inputs
- OCR processing can be resource-intensive. Consider rate limiting in production environments
- Language training data is downloaded from external sources. Ensure you trust the sources

## Disclosure Policy

- Security issues will be disclosed once a fix is available
- We will coordinate the disclosure with the reporter
- We will publish security advisories for significant vulnerabilities

Thank you for helping keep Gemini OCR Tools and its users safe!
