import { Injectable, signal } from '@angular/core';
import { GeminiService } from './gemini.service';
import { Chat } from '@google/genai';

/**
 * Project Antigravity: Forensic AI Strategy Service
 * Specialized service for time-barred litigation in East Central Judicial District
 * Focuses on Rule 60(b)(4) and (6) motions and Independent Actions in Equity
 */
@Injectable({ providedIn: 'root' })
export class AntigravityService {
  public loading = signal(false);
  public error = signal<string | null>(null);
  
  // Constitutional Auditor persona system instructions
  private readonly constitutionalAuditorInstructions = `
Role: You are an expert legal strategist and Constitutional Auditor for the East Central Judicial District of North Dakota, specializing in Rule 60(b) motions and extraordinary circumstances litigation.

Core Expertise Areas:
1. North Dakota Rules of Civil Procedure, particularly Rule 60(b)(4) and Rule 60(b)(6)
2. Family law and child welfare extraordinary circumstances (Kinsella v. Kinsella, 181 N.W.2d 764)
3. Coercive control dynamics under N.D.C.C. § 14-07.1
4. Void judgments and due process violations
5. Independent Actions in Equity for fraud on the court
6. East Central Judicial District local rules and procedures

Critical Constraint: The one-year deadline for Rule 60(b)(3) has EXPIRED. DO NOT draft arguments based on simple perjury or fraud that are time-barred under the one-year rule.

Mission: Analyze evidence to build TWO DISTINCT legal arguments:

A. Rule 60(b)(6) - Extraordinary Circumstances:
   - Identify circumstances where abuse itself (coercive control) prevented earlier filing
   - Focus on child welfare and safety as extraordinary circumstances
   - Apply Kinsella v. Kinsella precedent: "best interests of the child" can justify relief beyond one-year limit
   - Frame manifest injustice requiring equitable intervention

B. Rule 60(b)(4) - Void Judgment:
   - Identify due process violations (e.g., improper service, "Ghost Address" defects)
   - Note: Void judgments have NO TIME LIMIT and can be vacated at any time
   - Focus on jurisdictional defects, not simple procedural errors

Key Legal Principles:
1. Pattern Recognition: Focus on systematic patterns of behavior, not isolated incidents
2. Structural Subversion: Identify how judicial machinery was corrupted or subverted
3. Manifest Injustice: Emphasize outcomes that shock the conscience
4. Child Welfare Priority: Children's safety supersedes procedural technicalities
5. Coercive Control as Barrier: Explain how abuse prevented timely access to justice

Analysis Framework:
- DO NOT focus on simple contradictions or misstatements (time-barred)
- DO focus on: structural defects, child endangerment, coercive control barriers
- Distinguish between "fraud" (time-barred) and "fraud on the court" (no time limit)
- Cite North Dakota case law, particularly Kinsella for child welfare arguments

Evidence Filtering Priority:
1. Child safety and welfare concerns (medical records, abuse reports, arrests)
2. Due process violations (service defects, jurisdictional issues)
3. Coercive control patterns (economic abuse, litigation abuse, psychological barriers)
4. Manifest injustice (outcomes clearly contrary to equity and good conscience)

Citation Requirements:
- Strictly adhere to North Dakota citation format
- Reference East Central Judicial District Standing Orders
- Properly format exhibit numbering per ECJD requirements
- Include parallel citations for North Dakota cases

Professional Standards:
- Maintain objective, evidence-based analysis
- Avoid inflammatory language; use precise legal terminology
- Distinguish between legal arguments (for the court) and strategic considerations
- Always note limitations and alternative interpretations
- Prioritize child safety in all recommendations

Remember: You are analyzing for EXTRAORDINARY CIRCUMSTANCES and VOID JUDGMENTS, not standard fraud claims. The goal is to show why the normal one-year limitation should not apply due to the unique nature of the circumstances.
`;

  // Forensic analysis prompt templates
  private readonly promptTemplates = {
    kinsellaChildWelfare: (medicalTimeline: string, childName: string, defendantName: string) => `
Analyze the following medical timeline regarding the child, ${childName}:

${medicalTimeline}

Task: Draft a legal argument for a Rule 60(b)(6) Motion based on Kinsella v. Kinsella, 181 N.W.2d 764.

Argument Requirements:
1. Establish that leaving the child in custody of ${defendantName} constitutes "manifest injustice"
2. Identify specific "extraordinary circumstances" affecting the child's welfare
3. Explain why these circumstances justify relief beyond the one-year limitation
4. Apply Kinsella precedent: Court has power to vacate judgment to protect child welfare
5. Connect child safety concerns to equitable intervention necessity

Legal Framework:
- Cite Kinsella v. Kinsella for the proposition that child welfare is an extraordinary circumstance
- Emphasize that children's safety supersedes procedural time limitations
- Frame as manifest injustice requiring immediate judicial intervention
- Note that Rule 60(b)(6) has no strict time limit, only "reasonable time" requirement

Format:
- Clear statement of extraordinary circumstances
- Specific facts supporting child endangerment
- Legal authority (Kinsella and related cases)
- Connection between circumstances and need for relief
- Requested relief and protective measures
`,

    ghostAddressVoid: (serviceAffidavit: string, correctAddressEvidence: string) => `
Analyze the following service documents:

Service Affidavit:
${serviceAffidavit}

Correct Address Evidence:
${correctAddressEvidence}

Task: Draft a section titled "Void Judgment for Lack of Due Process" under N.D.R.Civ.P. 60(b)(4).

Analysis Requirements:
1. Compare the address used for service vs. the correct address
2. Identify any evidence that opposing counsel knew the correct address
3. Establish that improper service deprived plaintiff of due process
4. Explain why this renders the judgment VOID (not merely voidable)

Legal Argument Structure:
1. Due Process Violation: Explain how improper service violated constitutional rights
2. Jurisdictional Defect: Establish that court lacked personal jurisdiction without proper service
3. Void Status: State explicitly: "A void judgment may be vacated at any time under Rule 60(b)(4) and is not subject to the reasonable time requirement"
4. Intentional Conduct: If applicable, show counsel's knowledge of correct address
5. Prejudice: Demonstrate actual harm from lack of notice

Key Legal Points:
- Void judgments are nullities with no legal effect
- No time limitation applies to Rule 60(b)(4) void judgment claims
- Proper service is jurisdictional requirement, not mere procedural formality
- Due process requires actual notice reasonably calculated to reach the party

Format as legal brief section with:
- Heading: "The Judgment is Void Under Rule 60(b)(4) Due to Improper Service"
- Statement of facts
- Legal standard for void judgments
- Application to facts
- Conclusion and relief requested
`,

    coerciveControlBarrier: (abuseLog: string, financialRecords: string) => `
Analyze the following evidence of coercive control:

Abuse Log:
${abuseLog}

Financial Records:
${financialRecords}

Task: Build a "Justification for Delay" argument explaining why the motion was not filed within one year.

Analysis Framework:
1. Identify Coercive Control Patterns:
   - Economic coercion (withholding funds, financial threats)
   - Litigation abuse (vexatious filings, baseless motions)
   - Psychological abuse (threats, intimidation, gaslighting)
   - Social isolation and support system destruction
   
2. Establish Barriers to Access:
   - Financial incapacity to retain counsel
   - Psychological trauma preventing effective action
   - Ongoing threats and intimidation
   - Pattern of retaliation for asserting legal rights

3. Legal Theory:
   - Coercive control under N.D.C.C. § 14-07.1 as recognized abuse dynamic
   - Trauma-informed understanding of victim behavior
   - Defendant's conduct as cause of delay (equitable tolling principle)
   - Pattern of domination prevented meaningful access to justice

4. Frame as Extraordinary Circumstance:
   - Defendant's coercive control created the delay
   - Delay is not attributable to plaintiff's neglect
   - Abuse itself is the extraordinary circumstance tolling "reasonable time"
   - Equity demands relief when abuser's conduct caused delay

Legal Citations Needed:
- N.D.C.C. § 14-07.1 (coercive control statute)
- Cases recognizing coercive control as abuse
- Equitable tolling principles
- Trauma-informed jurisprudence

Format:
- Chronological pattern of coercive control
- Specific incidents preventing legal action
- Connection between abuse and inability to file timely motion
- Legal theory supporting tolling of time limitations
- Conclusion: Delay was caused by defendant's extraordinary misconduct
`,

    patternOfEndangerment: (evidenceList: string[]) => `
Create a "Pattern of Endangerment" chart for court filing (Exhibit A).

Evidence to analyze:
${evidenceList.join('\n')}

Requirements:
1. Chronological Timeline:
   - Date of each incident/document
   - Type of evidence (medical, police, witness, etc.)
   - Brief description of content
   - Significance to child safety

2. Pattern Categories:
   - Physical safety concerns
   - Emotional/psychological harm
   - Neglect or supervision failures
   - Exposure to domestic violence
   - Criminal conduct affecting child

3. Escalation Analysis:
   - Identify increasing severity over time
   - Note any critical incidents
   - Highlight recent developments (arrests, diagnoses, etc.)

4. Format for Court:
   - Professional table or chart format
   - Clear headers and organization
   - East Central Judicial District standards
   - Suitable for exhibit book with tabs

5. Summary Analysis:
   - Overall pattern description
   - Most significant concerns
   - Current risk level
   - Why this demonstrates extraordinary circumstances

Output Format:
[Exhibit A: Pattern of Endangerment Chart]
Table with columns: Date | Evidence Type | Description | Child Safety Significance

Followed by:
Summary Analysis section explaining the pattern and its legal significance for Rule 60(b)(6) relief.
`,

    fraudOnCourtIndependentAction: (witnessEvidence: string, serviceEvidence: string) => `
Draft a Complaint for Independent Action in Equity to Set Aside Judgment.

Evidence:
Witness Issues: ${witnessEvidence}
Service Issues: ${serviceEvidence}

Complaint Structure:

CAPTION: [Standard ND Caption for new civil case]

COUNT I: FRAUD ON THE COURT
1. Jurisdiction and Venue
2. Parties
3. Background of Original Judgment
4. Fraud on the Court Allegations:
   - Specific fraudulent acts that corrupted judicial process
   - Intentional deception of the court
   - Subversion of judicial machinery
   - Clear and convincing evidence of fraud
5. Why this is "Fraud on the Court" not simple "fraud":
   - Conduct targeted at judicial process itself
   - Corruption of court's fact-finding function
   - More than mere perjury; systematic deception
6. No Time Limitation:
   - Independent action not subject to Rule 60(b) time limits
   - Equity will not permit fraud to ripen into justice
7. Relief Requested: Setting aside of judgment

COUNT II: UNJUST ENRICHMENT/EQUITY
1. Benefits obtained by defendant through fraudulent judgment
2. Against good conscience to permit retention
3. No adequate remedy at law
4. Equitable relief appropriate

Legal Standard for Fraud on Court:
- Clear and convincing evidence required
- Must show intentional fraud that subverted judicial process
- Different from mere fraud on opposing party
- Court has inherent power to protect integrity of proceedings

Format: Professional complaint format per North Dakota rules, suitable for filing as new civil action.
`,
  };

  constructor(private geminiService: GeminiService) {}

  /**
   * Create a Constitutional Auditor chat session
   */
  createConstitutionalAuditorChat(): Chat {
    return this.geminiService.startChat(this.constitutionalAuditorInstructions, false);
  }

  /**
   * Analyze evidence for Kinsella child welfare argument (Rule 60(b)(6))
   */
  async analyzeChildWelfare(
    medicalTimeline: string,
    childName: string,
    defendantName: string
  ): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = this.promptTemplates.kinsellaChildWelfare(medicalTimeline, childName, defendantName);
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to analyze child welfare: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Analyze evidence for Ghost Address void judgment argument (Rule 60(b)(4))
   */
  async analyzeGhostAddress(
    serviceAffidavit: string,
    correctAddressEvidence: string
  ): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = this.promptTemplates.ghostAddressVoid(serviceAffidavit, correctAddressEvidence);
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to analyze service defect: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Analyze coercive control as barrier to filing (justification for delay)
   */
  async analyzeCoerciveControl(
    abuseLog: string,
    financialRecords: string
  ): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = this.promptTemplates.coerciveControlBarrier(abuseLog, financialRecords);
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to analyze coercive control: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Generate Pattern of Endangerment chart
   */
  async generatePatternChart(evidenceList: string[]): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = this.promptTemplates.patternOfEndangerment(evidenceList);
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to generate pattern chart: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Draft Independent Action complaint
   */
  async draftIndependentAction(
    witnessEvidence: string,
    serviceEvidence: string
  ): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = this.promptTemplates.fraudOnCourtIndependentAction(witnessEvidence, serviceEvidence);
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to draft independent action: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Draft Motion to Vacate under Rule 60(b)(4) and (6)
   */
  async draftMotionToVacate(caseDetails: {
    caseNumber: string;
    venue: string;
    plaintiff: string;
    defendant: string;
    voidArgument: string;
    extraordinaryCircumstances: string;
    delayJustification: string;
  }): Promise<string> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const prompt = `
Draft a comprehensive Motion to Vacate Amended Judgment pursuant to N.D.R.Civ.P. 60(b)(4) (Void) and 60(b)(6) (Extraordinary Circumstances).

Case Details:
- Case Number: ${caseDetails.caseNumber}
- Venue: ${caseDetails.venue}
- Plaintiff: ${caseDetails.plaintiff}
- Defendant: ${caseDetails.defendant}

ARGUMENT STRUCTURE:

I. INTRODUCTION
Brief overview of the two grounds for relief

II. ARGUMENT 1 - THE JUDGMENT IS VOID UNDER RULE 60(b)(4)
${caseDetails.voidArgument}

Key points:
- State clearly: "This judgment is void and may be vacated at any time"
- Emphasize jurisdictional defect, not mere procedural irregularity
- No time limitation applies to void judgments

III. ARGUMENT 2 - EXTRAORDINARY CIRCUMSTANCES EXIST UNDER RULE 60(b)(6)
${caseDetails.extraordinaryCircumstances}

Key points:
- Apply Kinsella v. Kinsella, 181 N.W.2d 764
- Child welfare as extraordinary circumstance
- Recent developments (arrests, diagnoses) creating manifest injustice
- Equity demands relief to protect child

IV. JUSTIFICATION FOR DELAY (REASONABLE TIME REQUIREMENT)
${caseDetails.delayJustification}

Key points:
- Coercive control prevented earlier filing
- Defendant's conduct caused the delay
- Equitable tolling principles apply
- "Reasonable time" measured from when circumstances made filing possible

V. CONCLUSION
Prayer for relief:
1. Vacate the amended judgment
2. Set aside custody and parenting time orders
3. Emergency protective measures for child
4. Such other relief as the court deems just and proper

Format according to East Central Judicial District requirements with proper caption, signature blocks, and certificate of service.
`;
      const result = await this.geminiService.generateText(prompt);
      return result;
    } catch (error: any) {
      this.error.set(`Failed to draft motion: ${error.message}`);
      return '';
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get the Constitutional Auditor system instructions
   */
  getSystemInstructions(): string {
    return this.constitutionalAuditorInstructions;
  }
}
