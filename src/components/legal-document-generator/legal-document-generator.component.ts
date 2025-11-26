// Fix: Create LegalDocumentGeneratorComponent for drafting legal documents.
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { CaseService } from '../../services/case.service';
import { Exhibit } from '../../models/case.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-legal-document-generator',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Legal Document Generator</h2>

      <div class="mb-4">
        <label for="doc-type" class="block text-sm font-medium text-gray-700">Document Type:</label>
        <select
          id="doc-type"
          [(ngModel)]="documentType"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          [disabled]="geminiService.loading()"
        >
          <option value="Exhibit List">Exhibit List</option>
          <option value="Memorandum of Law">Memorandum of Law</option>
          <option value="Proposed Findings of Fact and Conclusions of Law">Proposed Findings of Fact and Conclusions of Law</option>
          <option value="Motion in Limine">Motion in Limine</option>
          <option value="Custom Document">Custom Document</option>
        </select>
      </div>

      @if (documentType === 'Custom Document') {
        <div class="mb-4">
          <label for="custom-prompt" class="block text-sm font-medium text-gray-700">Custom Document Prompt:</label>
          <textarea
            id="custom-prompt"
            [(ngModel)]="customPrompt"
            rows="4"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Draft a letter to opposing counsel regarding..."
            [disabled]="geminiService.loading()"
          ></textarea>
        </div>
      }

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Select Exhibits to Include:</label>
        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border p-2 rounded-md bg-gray-50">
          @if (caseService.exhibits().length === 0) {
            <p class="text-gray-500 col-span-full italic">No exhibits available.</p>
          } @else {
            @for (exhibit of caseService.exhibits(); track exhibit.id) {
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  [value]="exhibit.id"
                  (change)="toggleExhibitSelection(exhibit)"
                  [checked]="selectedExhibits().includes(exhibit)"
                  class="form-checkbox h-4 w-4 text-blue-600"
                  [disabled]="geminiService.loading()"
                />
                <span class="text-sm text-gray-800">{{ exhibit.id }}: {{ exhibit.fileName }}</span>
              </label>
            }
          }
        </div>
      </div>

      <button
        (click)="generateDocument()"
        [disabled]="geminiService.loading() || (!documentType && !customPrompt)"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Document
      </button>

      @if (geminiService.loading()) {
        <p class="text-center text-blue-600 italic mt-4">Generating {{ documentType || 'document' }}...</p>
      }
      @if (geminiService.error()) {
        <p class="text-red-500 mt-2 text-sm">{{ geminiService.error() }}</p>
      }

      @if (generatedDocument()) {
        <div class="mt-6 border-t pt-4">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Generated Document:</h3>
          <textarea
            rows="20"
            readonly
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 font-mono text-sm whitespace-pre-wrap"
          >{{ generatedDocument() }}</textarea>
          <button
            (click)="copyDocumentToClipboard()"
            class="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Copy to Clipboard
          </button>
          @if (copySuccessMessage()) {
            <span class="ml-2 text-green-600 text-sm">{{ copySuccessMessage() }}</span>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class LegalDocumentGeneratorComponent {
  geminiService = inject(GeminiService);
  caseService = inject(CaseService);

  documentType: string = 'Memorandum of Law';
  customPrompt: string = '';
  selectedExhibits = signal<Exhibit[]>([]);
  generatedDocument = signal<string | null>(null);
  copySuccessMessage = signal<string | null>(null);

  toggleExhibitSelection(exhibit: Exhibit): void {
    this.selectedExhibits.update((current) => {
      const index = current.findIndex((e) => e.id === exhibit.id);
      if (index > -1) {
        return current.filter((e) => e.id !== exhibit.id);
      } else {
        return [...current, exhibit];
      }
    });
  }

  async generateDocument(): Promise<void> {
    if (this.geminiService.loading()) {
      return;
    }

    this.generatedDocument.set(null);
    this.copySuccessMessage.set(null);

    const caseDetails = this.caseService.caseDetails();
    const exhibits = this.selectedExhibits();

    let prompt = `As an expert North Dakota legal analyst and draftsperson specializing in civil litigation, prepare the following legal document based on the provided case details and exhibits.\n\n`;

    if (caseDetails) {
      prompt += `Case Name: ${caseDetails.caseName}\n`;
      prompt += `Client Name: ${caseDetails.clientName}\n`;
      prompt += `Opposing Party: ${caseDetails.opposingPartyName}\n`;
      prompt += `Case Type: ${caseDetails.caseType}\n`;
      prompt += `Core Issue: ${caseDetails.coreIssue}\n`;
      prompt += `Legal Theory (if determined): ${caseDetails.legalTheory}\n\n`;
    }

    if (exhibits.length > 0) {
      prompt += `Relevant Exhibits (Summary):\n`;
      exhibits.forEach((ex) => {
        prompt += `- ${ex.id} (${ex.fileName}, ${ex.fileType.split('/')[1]}): ${ex.description || 'No description provided'}. Relevance: ${ex.relevance || 'N/A'}. AI Analysis: ${ex.aiAnalysis || 'N/A'}\n`;
      });
      prompt += `\n`;
    }

    switch (this.documentType) {
      case 'Exhibit List':
        prompt += `Draft a formal Exhibit List in a table format with columns: "Exhibit Number", "Exhibit Description", "File Name", "Relevance", "NDR Evd Rule", "Potential Objections", "Proposed Responses". Ensure to include all details from the selected exhibits.`;
        break;
      case 'Memorandum of Law':
        prompt += `Draft a comprehensive Memorandum of Law. It should outline the strongest legal theory (based on the core issue and legal theory provided), cite relevant North Dakota Century Code (NDCC) statutes, North Dakota Rules of Civil Procedure (NDR Civ P), North Dakota Rules of Evidence (NDR Evd), and controlling North Dakota Supreme Court case law. Apply these legal authorities to the facts evident from the case details and the selected exhibits. Structure it with an Issue, Facts, Discussion, and Conclusion section.`;
        break;
      case 'Proposed Findings of Fact and Conclusions of Law':
        prompt += `Draft Proposed Findings of Fact and Conclusions of Law, strictly favorable to the client's position. The Findings of Fact should be supported by the case details and selected exhibits. The Conclusions of Law should clearly articulate the legal basis for the desired outcome, referencing North Dakota law.`;
        break;
      case 'Motion in Limine':
        prompt += `Draft a Motion in Limine (if applicable and plausible given the exhibits). Identify a piece of evidence (either from the exhibits or a hypothetical one implied by the case details) that should be excluded. State the grounds for exclusion based on North Dakota Rules of Evidence and propose a supporting legal argument. If no specific evidence can be identified from current exhibits, suggest a common type of evidence to exclude in this case type.`;
        break;
      case 'Custom Document':
        prompt += `Based on the following custom instruction: "${this.customPrompt}". Ensure the document is professional, legally sound, and tailored to North Dakota civil litigation standards.`;
        break;
      default:
        prompt += `Generate a legal document based on the provided information.`;
    }

    try {
      const result = await this.geminiService.generateText(prompt);
      this.generatedDocument.set(result);
    } catch (error) {
      console.error('Error generating document:', error);
      this.generatedDocument.set('Failed to generate document. Please try again.');
    }
  }

  async copyDocumentToClipboard(): Promise<void> {
    const doc = this.generatedDocument();
    if (doc) {
      try {
        await navigator.clipboard.writeText(doc);
        this.copySuccessMessage.set('Copied!');
        setTimeout(() => this.copySuccessMessage.set(null), 2000);
      } catch (err) {
        console.error('Failed to copy document:', err);
        this.copySuccessMessage.set('Failed to copy.');
      }
    }
  }
}