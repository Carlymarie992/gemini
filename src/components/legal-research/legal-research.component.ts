import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-legal-research',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Legal Research</h2>

      <div class="mb-4">
        <label for="research-query" class="block text-sm font-medium text-gray-700">Research Query (Keywords/Concepts):</label>
        <textarea
          id="research-query"
          [(ngModel)]="researchQuery"
          rows="4"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., North Dakota child custody factors, admissibility of text messages, breach of contract elements"
          [disabled]="geminiService.loading()"
        ></textarea>
      </div>

      <button
        (click)="performResearch()"
        [disabled]="!researchQuery.trim() || geminiService.loading()"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Perform Research
      </button>

      @if (geminiService.loading()) {
        <p class="text-center text-green-600 italic mt-4">Searching for legal precedents...</p>
      }
      @if (geminiService.error()) {
        <p class="text-red-500 mt-2 text-sm">{{ geminiService.error() }}</p>
      }

      @if (researchSummary()) {
        <div class="mt-6 border-t pt-4">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Research Summary:</h3>
          <textarea
            rows="10"
            readonly
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 font-mono text-sm whitespace-pre-wrap"
          >{{ researchSummary() }}</textarea>
        </div>
      }

      @if (groundingUrls().length > 0) {
        <div class="mt-4">
          <h4 class="text-lg font-medium text-gray-700">Sources:</h4>
          <ul class="list-disc pl-5 text-sm text-gray-600">
            @for (url of groundingUrls(); track $index) {
              <li><a [href]="url.uri" target="_blank" class="text-blue-500 hover:underline">{{ url.title || url.uri }}</a></li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalResearchComponent {
  geminiService = inject(GeminiService);
  researchQuery: string = '';
  researchSummary = signal<string>('');
  groundingUrls = signal<{ uri: string; title: string }[]>([]);

  async performResearch(): Promise<void> {
    if (!this.researchQuery.trim() || this.geminiService.loading()) {
      return;
    }

    this.researchSummary.set('');
    this.groundingUrls.set([]);

    const prompt = `Based on the following query, provide a concise summary of relevant North Dakota case law and statutes. If specific cases are found, provide brief summaries and citations (hypothetical if real ones aren't available). Ensure the response is grounded in up-to-date information.
    \n\nResearch Query: "${this.researchQuery}"`;

    try {
      const result = await this.geminiService.generateTextWithGrounding(prompt);
      this.researchSummary.set(result.text);
      this.groundingUrls.set(result.urls);
    } catch (error) {
      console.error('Error performing legal research:', error);
      this.researchSummary.set('Failed to perform legal research. Please try again.');
      this.groundingUrls.set([]);
    }
  }
}
