# Project Antigravity: Secure AI Legal Assistant Documentation

## Overview

Project Antigravity is a specialized AI legal assistant designed to help with time-barred litigation in the East Central Judicial District of North Dakota. It focuses on Rule 60(b)(4) and Rule 60(b)(6) motions, providing sophisticated legal analysis for extraordinary circumstances and void judgment arguments.

## Security Features

### 1. Input Sanitization
- **XSS Protection**: All user inputs are sanitized to prevent cross-site scripting attacks
- **Prompt Injection Detection**: System detects and blocks potential AI prompt injection attempts
- **HTML Sanitization**: Removes dangerous HTML tags while preserving safe formatting
- **File Validation**: Uploaded files are validated for malicious content

### 2. Sensitive Data Protection
- **Automatic Redaction**: SSNs, credit cards, and phone numbers are automatically redacted in logs
- **Secure Storage Keys**: Case data uses secure, namespaced storage keys
- **HTTPS Enforcement**: System warns when not running over HTTPS in production

### 3. Legal Data Security
- **Case Number Validation**: North Dakota case number format validation
- **Exhibit ID Validation**: Secure exhibit ID generation and validation
- **Input Length Limits**: Prevents denial-of-service through excessive input

## Core Components

### AntigravityService

The `AntigravityService` provides specialized legal analysis capabilities:

#### Constitutional Auditor Persona
The AI is configured with a "Constitutional Auditor" persona that:
- Specializes in Rule 60(b)(4) and (6) motions
- Focuses on extraordinary circumstances, not time-barred fraud
- Applies Kinsella v. Kinsella precedent for child welfare arguments
- Identifies structural subversion and manifest injustice
- Understands coercive control dynamics under N.D.C.C. § 14-07.1

#### Key Methods

1. **`analyzeChildWelfare(medicalTimeline, childName, defendantName)`**
   - Generates Rule 60(b)(6) arguments based on Kinsella precedent
   - Focuses on child safety as extraordinary circumstance
   - Connects medical evidence to manifest injustice

2. **`analyzeGhostAddress(serviceAffidavit, correctAddressEvidence)`**
   - Generates Rule 60(b)(4) void judgment arguments
   - Analyzes service defects and due process violations
   - Emphasizes: "A void judgment may be vacated at any time"

3. **`analyzeCoerciveControl(abuseLog, financialRecords)`**
   - Builds justification for delay in filing
   - Analyzes patterns of economic and litigation abuse
   - Establishes coercive control as barrier to justice

4. **`draftMotionToVacate(caseDetails)`**
   - Combines all three arguments into complete motion
   - Formats according to East Central Judicial District requirements
   - Includes proper legal citations and structure

5. **`draftIndependentAction(witnessEvidence, serviceEvidence)`**
   - Generates complaint for Independent Action in Equity
   - Focuses on "fraud on the court" (no time limitation)
   - Structured as new civil lawsuit

### SecurityService

The `SecurityService` provides comprehensive security features:

#### Input Sanitization Methods
- `sanitizeInput(input)`: Basic XSS protection
- `sanitizeHTML(html)`: Aggressive HTML sanitization
- `sanitizePromptInput(input)`: AI prompt injection protection
- `validateFileContent(content, mimeType)`: File upload validation

#### Data Protection Methods
- `redactSensitiveInfo(text)`: Redacts SSNs, credit cards, phone numbers
- `secureLog(message, data)`: Logging with automatic redaction
- `validateNDCaseNumber(caseNumber)`: Case number format validation
- `generateExhibitId(prefix, number)`: Secure exhibit ID generation

#### Security Checks
- `detectPromptInjection(input)`: Detects prompt manipulation attempts
- `isSecureEnvironment()`: Checks for HTTPS
- `checkSecurityWarnings()`: Returns array of security concerns

## Legal Framework

### Rule 60(b)(4) - Void Judgments

**No Time Limitation**: Void judgments can be attacked at any time.

**Grounds for Voidness**:
- Lack of personal jurisdiction (improper service)
- Lack of subject matter jurisdiction
- Due process violations
- "Ghost Address" service defects

**Key Legal Point**: "A void judgment may be vacated at any time under Rule 60(b)(4) and is not subject to the reasonable time requirement."

### Rule 60(b)(6) - Extraordinary Circumstances

**Standard**: Circumstances that make it unjust to enforce the judgment.

**Key Authority**: Kinsella v. Kinsella, 181 N.W.2d 764
- Held that "best interests of the child" can be an extraordinary circumstance
- Child welfare supersedes procedural time limitations
- Recent developments (arrests, medical diagnoses) can demonstrate manifest injustice

**Time Requirement**: "Reasonable time" (more flexible than one-year limit)

### Independent Action in Equity

**Standard**: Fraud on the court (clear and convincing evidence)

**No Time Limitation**: Independent actions are not subject to Rule 60(b) time limits

**Requirements**:
- Intentional fraud that subverted judicial process
- Corruption of court's fact-finding function
- More than mere perjury; systematic deception

## Usage Guide

### Step 1: Child Welfare Analysis (Kinsella)

1. Navigate to "Child Welfare (Kinsella)" tab
2. Enter child's name
3. Enter defendant's name
4. Provide medical timeline with key dates and diagnoses
5. Click "Generate Kinsella Argument"

**Example Input**:
```
December 19, 2024: Child diagnosed with suspected sexual abuse by Dr. Smith at Valley Medical
January 15, 2025: Follow-up examination confirmed concerns
July 12, 2025: Defendant arrested on felony child endangerment charges
August 1, 2025: Child placed in protective custody
```

### Step 2: Void Judgment Analysis (Ghost Address)

1. Navigate to "Void Judgment (Ghost Address)" tab
2. Enter service affidavit details showing incorrect address
3. Provide evidence of correct address (emails, prior pleadings)
4. Click "Generate Void Judgment Argument"

**Example Input**:
```
Service Affidavit: States service was made at 123 Fake Street, Fargo, ND
Correct Address Evidence: Email dated Jan 5, 2023 from opposing counsel acknowledging correct address as 456 Real Avenue, Fargo, ND
```

### Step 3: Coercive Control Analysis

1. Navigate to "Coercive Control" tab
2. Document abuse log (litigation abuse, threats, intimidation)
3. Provide financial records showing economic coercion
4. Click "Generate Delay Justification"

**Example Input**:
```
Abuse Log:
- March 2023: Defendant filed frivolous motion for contempt, forcing legal expenses
- June 2023: Threatened to withhold child support if I pursued legal action
- Sept 2023: Filed baseless motion to modify custody
- Jan 2024: Cut off all financial support despite court order

Financial Records:
- Bank statements showing $0 balance after defendant stopped support
- Unable to afford attorney retainer ($5,000)
- Eviction notice due to financial hardship
```

### Step 4: Generate Complete Motion

1. Navigate to "Complete Motion" tab
2. Enter case number (format: ##-####-XX-#####)
3. Enter venue (e.g., "District Court, Cass County, ND")
4. Enter plaintiff and defendant names
5. Verify all three arguments are generated (checkmarks)
6. Click "Generate Complete Motion"
7. Download or copy the completed motion

### Step 5: Independent Action (If Needed)

1. Navigate to "Independent Action" tab
2. Enter witness tampering/evidence of fraud on court
3. Enter service defects and other corruption of judicial process
4. Click "Generate Independent Action Complaint"
5. Download or copy the complaint for filing as new lawsuit

## Security Best Practices

### For Users

1. **Use HTTPS**: Always access the application over HTTPS in production
2. **Secure API Keys**: Never commit API keys to version control
3. **Validate Inputs**: System validates inputs, but review for accuracy
4. **Protect Sensitive Data**: Be cautious with SSNs, financial data
5. **Regular Backups**: Export generated documents regularly

### For Developers

1. **Environment Variables**: Store API keys in `.env.local` (gitignored)
2. **Input Validation**: All user inputs pass through SecurityService
3. **Prompt Injection**: System detects and blocks injection attempts
4. **XSS Protection**: Multiple layers of HTML/script sanitization
5. **Security Audits**: Run `npm audit` regularly to check dependencies

## Angular XSS Vulnerability Notice

**Current Status**: Angular 20.3.0 - 20.3.14 have a high-severity XSS vulnerability (GHSA-v4hv-rgfq-gp49).

**Mitigation**:
1. This application implements additional input sanitization via SecurityService
2. All user inputs are sanitized before rendering
3. HTML content is aggressively filtered
4. Update to Angular 20.3.15+ when available

**To Update**:
```bash
npm install @angular/compiler@20.3.15 @angular/compiler-cli@20.3.15 @angular/core@20.3.15 @angular/common@20.3.15 @angular/forms@20.3.15 @angular/platform-browser@20.3.15 @angular/router@20.3.15 --save
```

## API Configuration

### Required Environment Variables

Create a `.env.local` file (gitignored):

```bash
# Google Gemini API Key
API_KEY=your_gemini_api_key_here
```

Get your API key at: https://ai.google.dev/

### Gemini Model Configuration

The application uses `gemini-2.5-flash` model with:
- System instructions for Constitutional Auditor persona
- Legal knowledge base from Family Law and Practice
- North Dakota-specific legal frameworks
- Domestic abuse and coercive control expertise

## Error Handling

The application provides clear error messages for:
- Missing API keys
- Invalid case number formats
- Prompt injection attempts
- Security warnings (non-HTTPS, etc.)
- API failures
- Invalid file uploads

## Legal Disclaimers

⚠️ **Important Legal Notices**:

1. **Not Legal Advice**: This tool provides legal analysis frameworks but is not a substitute for licensed legal counsel
2. **AI Limitations**: AI-generated content should be reviewed by qualified attorneys
3. **Professional Consultation Required**: Always consult with a licensed North Dakota attorney before filing
4. **No Attorney-Client Relationship**: Use of this tool does not create an attorney-client relationship
5. **Jurisdiction Specific**: This tool is designed specifically for North Dakota law
6. **Time-Sensitive Matters**: Legal deadlines are strict; consult an attorney immediately

## Support and Resources

### North Dakota Legal Resources
- [North Dakota Courts](https://www.ndcourts.gov/)
- [East Central Judicial District](https://www.ndcourts.gov/district-courts/east-central)
- [North Dakota Century Code](https://www.legis.nd.gov/general-information/north-dakota-century-code)
- [North Dakota Rules of Civil Procedure](https://www.ndcourts.gov/legal-resources/rules/ndrcp)

### Domestic Abuse Resources
- National Domestic Violence Hotline: 1-800-799-7233
- North Dakota Council on Abused Women's Services: 1-800-472-2911
- Rape and Abuse Crisis Center (Fargo): 701-293-7273

### Technical Support
- [GitHub Repository](https://github.com/Carlymarie992/gemini)
- [Report Issues](https://github.com/Carlymarie992/gemini/issues)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Reporting bugs
- Suggesting features
- Code style guidelines
- Pull request process

## License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) for details.

---

**Version**: 1.0.0  
**Last Updated**: December 2, 2025  
**Maintained by**: Carlymarie992
