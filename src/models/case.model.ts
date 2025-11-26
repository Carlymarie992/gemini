// Fix: Define CaseDetails and Exhibit interfaces for type safety.

export interface CaseDetails {
  caseName: string;
  clientName: string;
  opposingPartyName: string;
  caseType: string;
  coreIssue: string;
  legalTheory: string;
}

export interface Exhibit {
  id: string; // Unique identifier for the exhibit (e.g., "Exh_001")
  fileName: string;
  fileType: string; // MIME type
  base64Content: string; // Base64 encoded content for textual analysis or display
  description: string; // User-provided description
  relevance: string; // AI-generated relevance statement
  ndrEvdRule: string; // AI-suggested NDR Evd Rule
  potentialObjections: string; // AI-suggested potential objections
  proposedResponses: string; // AI-suggested responses to objections
  aiAnalysis: string; // AI-generated summary or analysis of the file content
  aiLegalTheorySupport: string; // How the exhibit supports the legal theory
}
