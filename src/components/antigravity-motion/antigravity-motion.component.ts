import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AntigravityService } from '../../services/antigravity.service';
import { SecurityService } from '../../services/security.service';
import { CaseService } from '../../services/case.service';

/**
 * Project Antigravity Motion Generator Component
 * Generates Rule 60(b)(4) and (6) motions and Independent Actions
 */
@Component({
  selector: 'app-antigravity-motion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full lg:w-3/4 xl:w-2/3 mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        Project Antigravity: Rule 60(b) Motion Generator
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Specialized motion drafting for time-barred litigation focusing on extraordinary circumstances and void judgments
      </p>

      <!-- Security Warning -->
      @if (securityWarnings().length > 0) {
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Security Warnings</h3>
              <div class="mt-2 text-sm text-yellow-700">
                <ul class="list-disc list-inside space-y-1">
                  @for (warning of securityWarnings(); track warning) {
                    <li>{{ warning }}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-4">
        <nav class="-mb-px flex flex-wrap space-x-4" aria-label="Tabs">
          <button
            (click)="activeTab.set('kinsella')"
            [class.border-blue-500]="activeTab() === 'kinsella'"
            [class.text-blue-600]="activeTab() === 'kinsella'"
            [class.border-transparent]="activeTab() !== 'kinsella'"
            [class.text-gray-500]="activeTab() !== 'kinsella'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Child Welfare
          </button>
          <button
            (click)="activeTab.set('ghostaddress')"
            [class.border-blue-500]="activeTab() === 'ghostaddress'"
            [class.text-blue-600]="activeTab() === 'ghostaddress'"
            [class.border-transparent]="activeTab() !== 'ghostaddress'"
            [class.text-gray-500]="activeTab() !== 'ghostaddress'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Void Judgment
          </button>
          <button
            (click)="activeTab.set('coercive')"
            [class.border-blue-500]="activeTab() === 'coercive'"
            [class.text-blue-600]="activeTab() === 'coercive'"
            [class.border-transparent]="activeTab() !== 'coercive'"
            [class.text-gray-500]="activeTab() !== 'coercive'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Coercive Control
          </button>
          <button
            (click)="activeTab.set('motion')"
            [class.border-blue-500]="activeTab() === 'motion'"
            [class.text-blue-600]="activeTab() === 'motion'"
            [class.border-transparent]="activeTab() !== 'motion'"
            [class.text-gray-500]="activeTab() !== 'motion'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Complete Motion
          </button>
          <button
            (click)="activeTab.set('independent')"
            [class.border-blue-500]="activeTab() === 'independent'"
            [class.text-blue-600]="activeTab() === 'independent'"
            [class.border-transparent]="activeTab() !== 'independent'"
            [class.text-gray-500]="activeTab() !== 'independent'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Independent Action
          </button>
        </nav>
      </div>

      <!-- Content for each tab - condensed for space -->
      @if (activeTab() === 'kinsella') {
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-md">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Rule 60(b)(6) - Extraordinary Circumstances</h3>
            <p class="text-sm text-blue-700">
              Based on Kinsella v. Kinsella, 181 N.W.2d 764: Child welfare can constitute an extraordinary circumstance justifying relief beyond the one-year limitation.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Child's Name</label>
            <input
              type="text"
              [(ngModel)]="kinsellaInput.childName"
              (input)="sanitizeKinsellaInput()"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="E.Z.N."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Defendant's Name</label>
            <input
              type="text"
              [(ngModel)]="kinsellaInput.defendantName"
              (input)="sanitizeKinsellaInput()"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Medical Timeline</label>
            <textarea
              [(ngModel)]="kinsellaInput.medicalTimeline"
              (input)="sanitizeKinsellaInput()"
              rows="6"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="December 19, 2024: Child diagnosed with suspected sexual abuse..."
            ></textarea>
          </div>

          <button
            (click)="analyzeChildWelfare()"
            [disabled]="antigravityService.loading()"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ antigravityService.loading() ? 'Analyzing...' : 'Generate Kinsella Argument' }}
          </button>

          @if (kinsellaResult()) {
            <div class="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 class="font-medium text-gray-900 mb-2">Generated Argument:</h4>
              <div class="prose prose-sm max-w-none whitespace-pre-wrap text-sm">{{ kinsellaResult() }}</div>
              <button
                (click)="copyToClipboard(kinsellaResult())"
                class="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Copy to Clipboard
              </button>
            </div>
          }
        </div>
      }

      <!-- Other tabs omitted for brevity - similar structure -->

      @if (antigravityService.error()) {
        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-800">{{ antigravityService.error() }}</p>
        </div>
      }
    </div>
  `,
})
export class AntigravityMotionComponent {
  antigravityService = inject(AntigravityService);
  securityService = inject(SecurityService);
  caseService = inject(CaseService);

  activeTab = signal<string>('kinsella');
  securityWarnings = signal<string[]>([]);

  kinsellaInput = { childName: '', defendantName: '', medicalTimeline: '' };
  kinsellaResult = signal<string>('');

  ngOnInit() {
    this.securityWarnings.set(this.securityService.checkSecurityWarnings());
  }

  sanitizeKinsellaInput() {
    this.kinsellaInput.childName = this.securityService.sanitizeInput(this.kinsellaInput.childName);
    this.kinsellaInput.defendantName = this.securityService.sanitizeInput(this.kinsellaInput.defendantName);
    this.kinsellaInput.medicalTimeline = this.securityService.sanitizePromptInput(this.kinsellaInput.medicalTimeline);
  }

  async analyzeChildWelfare() {
    const result = await this.antigravityService.analyzeChildWelfare(
      this.kinsellaInput.medicalTimeline,
      this.kinsellaInput.childName,
      this.kinsellaInput.defendantName
    );
    this.kinsellaResult.set(result);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}
