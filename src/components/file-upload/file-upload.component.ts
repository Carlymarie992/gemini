import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { CaseService } from '../../services/case.service';
import { Exhibit } from '../../models/case.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-file-upload',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full lg:w-1/2">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Upload & Analyze Evidence</h2>

      <div class="mb-4">
        <label for="file-upload" class="block text-sm font-medium text-gray-700">Upload File:</label>
        <input
          type="file"
          id="file-upload"
          (change)="onFileSelected($event)"
          class="mt-1 block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
          [disabled]="geminiService.loading()"
        />
        @if (selectedFile()) {
          <p class="mt-2 text-sm text-gray-600">Selected: {{ selectedFile()?.name }} ({{ (selectedFile()!.size / 1024 / 1024).toFixed(2) }} MB)</p>
        }
      </div>

      <div class="mb-4">
        <label for="exhibit-description" class="block text-sm font-medium text-gray-700">Exhibit Description (Optional):</label>
        <textarea
          id="exhibit-description"
          [(ngModel)]="exhibitDescription"
          rows="2"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Briefly describe the content or purpose of this exhibit."
          [disabled]="geminiService.loading()"
        ></textarea>
      </div>

      <button
        (click)="processFile()"
        [disabled]="!selectedFile() || geminiService.loading()"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze & Add as Exhibit
      </button>

      @if (geminiService.loading()) {
        <p class="text-center text-blue-600 italic mt-4">Analyzing content with AI...</p>
      }
      @if (geminiService.error()) {
        <p class="text-red-500 mt-2 text-sm">{{ geminiService.error() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  geminiService = inject(GeminiService);
  caseService = inject(CaseService);

  selectedFile = signal<File | null>(null);
  exhibitDescription: string = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    } else {
      this.selectedFile.set(null);
    }
  }

  async processFile(): Promise<void> {
    const file = this.selectedFile();
    if (!file) {
      return;
    }

    // Determine the next exhibit number
    const nextExhibitNumber = this.caseService.exhibits().length + 1;
    const exhibitId = `Exh_${String(nextExhibitNumber).padStart(3, '0')}`;

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const base64Content = (e.target?.result as string).split(',')[1]; // Get base64 string after "base64,"
      const mimeType = file.type;

      let aiAnalysisResult: {
        summary: string;
        relevance: string;
        ndrEvdRule: string;
        potentialObjections: string;
        proposedResponses: string;
        legalTheorySupport: string;
      } | null = null;
      let primaryContentForAI: string = ''; // The main content extracted from file for AI analysis

      const legalKnowledge = this.geminiService.getLegalKnowledgeBase();
      const caseDetails = this.caseService.caseDetails();
      const relevantCaseInfo = `Case Type: ${caseDetails.caseType}, Core Issue: ${caseDetails.coreIssue}, Legal Theory: ${caseDetails.legalTheory}`;

      const basePromptForAnalysis = `You are an expert North Dakota legal analyst. Analyze the following content in the context of a North Dakota civil litigation case with the following details: "${relevantCaseInfo}".
        Refer to the North Dakota legal knowledge base provided: \n${legalKnowledge}\n\n`;

      try {
        if (file.type.startsWith('image/')) {
          // Fix: First analyze the image to get a textual description using the multimodal model.
          const imageAnalysisPrompt = `Describe this image in detail, focusing on elements relevant to a legal case. Provide a concise summary of its content.`;
          primaryContentForAI = await this.geminiService.analyzeImage(imageAnalysisPrompt, base64Content, mimeType);
          // Then, use the image analysis to generate structured legal analysis.
          const finalPrompt = basePromptForAnalysis + `Based on the image analysis ("${primaryContentForAI}"), and the user's optional description ("${this.exhibitDescription}"), provide a concise summary of its content, explain its relevance to the case, suggest a relevant North Dakota Rule of Evidence for admissibility, list potential objections, propose responses, and articulate how this image might support the legal theory of the case.`;
          aiAnalysisResult = await this.geminiService.generateStructuredAnalysis(finalPrompt);
        } else if (file.type.startsWith('audio/')) {
          // Fix: First transcribe the audio (simulated) to get text.
          primaryContentForAI = await this.geminiService.transcribeAudio(base64Content, mimeType);
          // Then, use the audio transcription to generate structured legal analysis.
          const finalPrompt = basePromptForAnalysis + `Based on the audio transcription ("${primaryContentForAI}"), and the user's optional description ("${this.exhibitDescription}"), provide a concise summary of its content, explain its relevance to the case, suggest a relevant North Dakota Rule of Evidence for admissibility, list potential objections, propose responses, and articulate how this audio might support the legal theory of the case.`;
          aiAnalysisResult = await this.geminiService.generateStructuredAnalysis(finalPrompt);
        } else if (file.type.startsWith('text/') || file.type === 'application/pdf') { // Simplified for PDF to be treated as text for now
          // For text/PDF, pass a snippet of the content to the AI
          const decodedText = atob(base64Content);
          primaryContentForAI = decodedText.substring(0, Math.min(decodedText.length, 4000)); // Increased snippet size for more context
          const finalPrompt = basePromptForAnalysis + `Analyze this document/text content (snippet: "${primaryContentForAI}"). Considering the user's optional description ("${this.exhibitDescription}"), provide a concise summary of its content, explain its relevance to the case, suggest a relevant North Dakota Rule of Evidence for admissibility, list potential objections, propose responses, and articulate how this document might support the legal theory of the case.`;
          aiAnalysisResult = await this.geminiService.generateStructuredAnalysis(finalPrompt);
        } else {
          // Fallback for unsupported types
          aiAnalysisResult = {
            summary: `Unsupported file type for detailed AI analysis: ${mimeType}.`,
            relevance: `File type not directly analyzable by AI.`,
            ndrEvdRule: `Determined manually.`,
            potentialObjections: `Content unknown.`,
            proposedResponses: `Content unknown.`,
            legalTheorySupport: `Content unknown.`,
          };
        }
      } catch (err) {
        console.error('Error during AI analysis:', err);
        aiAnalysisResult = {
          summary: `AI analysis failed: ${this.geminiService.error() || 'Unknown error'}`,
          relevance: `Failed to determine due to AI error.`,
          ndrEvdRule: `Failed to determine due to AI error.`,
          potentialObjections: `Failed to determine due to AI error.`,
          proposedResponses: `Failed to determine due to AI error.`,
          legalTheorySupport: `Failed to determine due to AI error.`,
        };
      }

      const newExhibit: Exhibit = {
        id: exhibitId,
        fileName: file.name,
        fileType: mimeType,
        base64Content: base64Content,
        description: this.exhibitDescription || aiAnalysisResult?.summary || 'No description provided.',
        relevance: aiAnalysisResult?.relevance || 'N/A',
        ndrEvdRule: aiAnalysisResult?.ndrEvdRule || 'N/A',
        potentialObjections: aiAnalysisResult?.potentialObjections || 'N/A',
        proposedResponses: aiAnalysisResult?.proposedResponses || 'N/A',
        aiAnalysis: aiAnalysisResult?.summary || 'No detailed AI analysis available.',
        aiLegalTheorySupport: aiAnalysisResult?.legalTheorySupport || 'N/A',
      };

      this.caseService.addExhibit(newExhibit);
      this.selectedFile.set(null);
      this.exhibitDescription = '';
      alert(`Exhibit ${exhibitId} added successfully!`);
    };

    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      this.geminiService.error.set('Failed to read file.');
      this.geminiService.loading.set(false);
    };

    reader.readAsDataURL(file);
  }
}