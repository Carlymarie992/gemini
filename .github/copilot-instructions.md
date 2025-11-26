# GitHub Copilot Instructions for Gemini AI Assistant

## Repository Purpose

This repository contains an AI assistant trained to understand and articulate complex patterns of domestic abuse, coercive control, DARVO (Deny, Attack, and Reverse Victim and Offender), economic abuse, stalking, harassment, and legal abuse—particularly in family court and child custody contexts. The AI helps protective parents, advocates, and legal professionals recognize, understand, and communicate about abuse dynamics.

## Core Principles

### 1. Safety First
- **ALWAYS** prioritize the safety of victims and children in any guidance or code
- **NEVER** minimize or dismiss abuse patterns
- Ensure all features and outputs support victim safety, not inadvertently expose them to risk

### 2. Trauma-Informed Development
- Recognize that users of this system are often experiencing trauma
- Use clear, supportive, and empowering language in user-facing text
- Avoid re-traumatizing language or victim-blaming framing
- Support users who may be cognitively impaired by ongoing trauma

### 3. Pattern Recognition Over Incidents
- Focus on systematic patterns of behavior, not isolated incidents
- Help users organize evidence and articulate ongoing dynamics
- Distinguish between conflict (bidirectional) and abuse (unidirectional power and control)

### 4. Child-Centered Approach
- Center children's safety and wellbeing in all features and guidance
- Recognize that children exposed to coercive control experience harm
- Support protective parents without undermining children's agency

## Code Quality Standards

### Documentation
- **Use plain, clear English** in all user-facing text
- **Add helpful emoji icons** to section headers for accessibility (✨ 🛡️ 📋 ⚠️ etc.)
- **Avoid legal jargon** unless necessary; always explain technical terms
- Write documentation that is accessible to users with no technical background
- Follow the beginner-friendly style established in README.md

### Code Style
- Write clean, maintainable, well-commented code
- Follow existing patterns and conventions in the codebase
- Use descriptive variable and function names that convey intent
- Prioritize readability over cleverness

### Testing
- Build: `npm install` (if package.json exists)
- Test: `npm test` (runs test/run-tests.js with custom assertions)
- Demo: `npm run demo` (if available)
- **ALWAYS** run tests before committing changes
- Add tests for new features consistent with existing test patterns
- Ensure changes don't break existing functionality

### Input Validation and Security
- **ALWAYS** validate user input for security vulnerabilities
- Sanitize inputs to prevent injection attacks
- Use established sanitization utilities (e.g., `html_escape` for XSS prevention)
- Be especially vigilant with file operations and external data
- Validate conflicting options and throw descriptive errors

### Error Handling
- Use try-catch blocks for operations that may fail (e.g., JSON parsing, file I/O)
- Provide helpful error messages that guide users to solutions
- Log errors appropriately for debugging without exposing sensitive information
- Handle edge cases gracefully

## Repository Structure

```
/
├── .github/              # GitHub configuration and templates
├── knowledge_base/       # Comprehensive training materials on abuse dynamics
│   ├── economic_abuse.md
│   ├── stalking_harassment.md
│   ├── darvo.md
│   ├── coercive_control.md
│   ├── legal_abuse_concealment.md
│   ├── communicating_to_judges.md
│   ├── example_scenarios.md
│   └── quick_reference.md
├── system_instructions.md # Core AI training instructions
└── README.md             # User-facing documentation
```

## Key Concepts and Terminology

### Coercive Control
A pattern of domination through isolation, regulation, degradation, and exploitation. Focus on the **pattern** and **system of control**, not individual incidents.

### DARVO
**Deny, Attack, Reverse Victim and Offender** - A manipulation tactic where an abuser denies wrongdoing, attacks the victim's credibility, and claims to be the real victim.

### Economic Abuse
Financial control used as a weapon during and after relationships, including withholding resources, sabotaging employment, litigation abuse, and creating economic dependence.

### Legal Abuse
Weaponization of the court system to continue coercive control post-separation through vexatious litigation, false allegations, and exhausting victim resources.

### Trauma-Informed Framework
Understanding that trauma affects victim presentation, memory, articulation, and credibility. The most articulate party is not necessarily the most truthful party.

## Contribution Guidelines

### When Adding Features
1. **Consider impact on victim safety** - Could this feature inadvertently harm users?
2. **Maintain trauma-informed approach** - Does the UI/UX support traumatized users?
3. **Prioritize accessibility** - Is this usable by people in crisis or with cognitive impacts of trauma?
4. **Use plain language** - Avoid jargon; explain everything clearly
5. **Test thoroughly** - Ensure changes work as intended and don't break existing features

### When Modifying Documentation
1. **Maintain beginner-friendly tone** with emoji section headers
2. **Explain technical terms** in plain English
3. **Provide context** about why something matters for safety or effectiveness
4. **Include examples** to make concepts concrete
5. **Keep sensitive content warnings** where appropriate

### When Reviewing Code
1. **Check for security vulnerabilities** especially with user input
2. **Verify trauma-informed language** in user-facing text
3. **Ensure safety-first approach** in any guidance or features
4. **Test edge cases** and error handling
5. **Confirm tests pass** and new tests are added for new features

## Sensitive Content Guidelines

### This repository deals with sensitive topics including:
- Domestic abuse and violence
- Child abuse and endangerment
- Sexual assault and coercion
- Stalking and harassment
- Psychological manipulation and trauma

### When working with this content:
- **Maintain professional boundaries** - This is serious work with real-world impact
- **Use content warnings** when sharing examples or scenarios
- **Avoid gratuitous details** - Include only what's necessary for understanding patterns
- **Center survivor perspectives** and agency
- **Recognize your own reactions** - This content can be difficult; take breaks as needed

## Privacy and Data Protection

- **Case data is stored in `.case-data/` directory** (gitignored for privacy)
- **NEVER commit sensitive personal information** to the repository
- **NEVER include real names, identifying details, or case specifics** in documentation or examples
- Use anonymized, composite examples only
- Be vigilant about accidental exposure of sensitive data

## What NOT to Do

### Never:
- Minimize or dismiss abuse patterns in code comments or documentation
- Use victim-blaming language (e.g., "why didn't they leave sooner?")
- Treat abuser and victim as equally credible when pattern is clear
- Prioritize "neutrality" over safety when abuse is present
- Add features that could expose victims to risk (e.g., unencrypted data storage)
- Remove or disable safety features without careful consideration
- Commit secrets, API keys, or sensitive information to the repository

## Dependencies and Package Management

### Before adding new dependencies:
1. **Evaluate necessity** - Is this dependency truly needed?
2. **Check security** - Run vulnerability checks on the package
3. **Consider maintenance** - Is the package actively maintained?
4. **Review license** - Is it compatible with this project?
5. **Document purpose** - Explain why this dependency was added

### Current key dependencies:
- Tesseract.js for OCR capabilities (13+ language support)
- Standard Node.js ecosystem tools for testing and building

## Commands Reference

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run demo (if available)
npm run demo

# Build (if applicable)
npm run build
```

## Getting Help

- Review `system_instructions.md` for core AI training principles
- Check `knowledge_base/` directory for comprehensive abuse dynamics training
- Read `README.md` for user-facing documentation and usage examples
- Consult existing code for patterns and conventions

## Remember

Your contributions to this repository may help protect victims and children from harm. The code you write, the features you add, and the documentation you improve all serve people navigating extremely difficult and dangerous situations. Take this responsibility seriously, prioritize safety always, and maintain the trauma-informed, child-centered approach that defines this project.

---

**When in doubt, ask yourself**: Does this change prioritize safety? Is it trauma-informed? Does it serve protective parents and children? If the answer is yes, you're on the right track.
