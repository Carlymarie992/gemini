// Fix: Create the AppComponent as a standalone component, importing other components.
import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ExhibitManagerComponent } from './components/exhibit-manager/exhibit-manager.component';
import { LegalResearchComponent } from './components/legal-research/legal-research.component';
import { LegalDocumentGeneratorComponent } from './components/legal-document-generator/legal-document-generator.component';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { CaseService } from './services/case.service';
import { FormsModule } from '@angular/forms'; // Required for ngModel in case details
// Fix: Import CaseDetails for type safety in updateCaseDetail method.
import { CaseDetails } from './models/case.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadComponent,
    ExhibitManagerComponent,
    LegalResearchComponent,
    LegalDocumentGeneratorComponent,
    ChatInterfaceComponent,
  ],
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        North Dakota Legal Analyst AI
      </h1>

      <!-- Case Details Input -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full lg:w-1/2">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Case Details</h2>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label for="caseName" class="block text-sm font-medium text-gray-700">Case Name:</label>
            <input
              type="text"
              id="caseName"
              [(ngModel)]="caseDetails().caseName"
              (ngModelChange)="updateCaseDetail('caseName', $event)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700">Client Name:</label>
            <input
              type="text"
              id="clientName"
              [(ngModel)]="caseDetails().clientName"
              (ngModelChange)="updateCaseDetail('clientName', $event)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="opposingPartyName" class="block text-sm font-medium text-gray-700">Opposing Party Name:</label>
            <input
              type="text"
              id="opposingPartyName"
              [(ngModel)]="caseDetails().opposingPartyName"
              (ngModelChange)="updateCaseDetail('opposingPartyName', $event)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="caseType" class="block text-sm font-medium text-gray-700">Case Type:</label>
            <input
              type="text"
              id="caseType"
              [(ngModel)]="caseDetails().caseType"
              (ngModelChange)="updateCaseDetail('caseType', $event)"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="coreIssue" class="block text-sm font-medium text-gray-700">Core Issue:</label>
            <textarea
              id="coreIssue"
              [(ngModel)]="caseDetails().coreIssue"
              (ngModelChange)="updateCaseDetail('coreIssue', $event)"
              rows="2"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label for="legalTheory" class="block text-sm font-medium text-gray-700">Legal Theory (Auto-determined or Manual):</label>
            <textarea
              id="legalTheory"
              [(ngModel)]="caseDetails().legalTheory"
              (ngModelChange)="updateCaseDetail('legalTheory', $event)"
              rows="2"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
        <button
          (click)="resetAll()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Reset All Case Data
        </button>
      </div>

      <app-file-upload></app-file-upload>
      <app-exhibit-manager></app-exhibit-manager>
      <app-legal-research class="w-full lg:w-1/2"></app-legal-research>
      <app-legal-document-generator></app-legal-document-generator>
      <app-chat-interface></app-chat-interface>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block', // Ensures the component acts as a block element for layout
  },
})
export class AppComponent {
  caseService = inject(CaseService);

  // Expose caseDetails signal for binding
  caseDetails = this.caseService.caseDetails;

  // Fix: Correctly type the 'key' parameter to be a key of the CaseDetails interface.
  updateCaseDetail(key: keyof CaseDetails, value: any): void {
    this.caseService.updateCaseDetails({ [key]: value });
  }

  // Fix: The errors for this method were likely a cascade from the missing import and incorrect typing in `updateCaseDetail`.
  // The logic inside `resetAll` is correct and should now be properly recognized by the TypeScript compiler.
  resetAll(): void {
    if (confirm('Are you sure you want to reset all case data and exhibits? This action cannot be undone.')) {
      this.caseService.resetCase();
    }
  }
}