import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { Exhibit } from '../../models/case.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-exhibit-manager',
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Exhibit Log & Manager</h2>

      @if (caseService.exhibits().length === 0) {
        <p class="text-gray-500 italic">No exhibits have been uploaded yet.</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exh. No.
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relevance
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NDR Evd Rule
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Potential Objections
                </th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (exhibit of caseService.exhibits(); track exhibit.id) {
                <tr>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ exhibit.id }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ exhibit.fileName }}</td>
                  <td class="px-3 py-2 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{{ exhibit.description }}</td>
                  <td class="px-3 py-2 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{{ exhibit.relevance }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ exhibit.ndrEvdRule }}</td>
                  <td class="px-3 py-2 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{{ exhibit.potentialObjections }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="viewExhibitContent(exhibit)"
                      class="text-blue-600 hover:text-blue-900 mr-2"
                      title="View Content"
                    >
                      View
                    </button>
                    <button
                      (click)="editExhibit(exhibit)"
                      class="text-indigo-600 hover:text-indigo-900 mr-2"
                      title="Edit Details"
                    >
                      Edit
                    </button>
                    <button
                      (click)="removeExhibit(exhibit.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Remove Exhibit"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Exhibit View/Edit Modal -->
      @if (selectedExhibitForModal()) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div class="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <h3 class="text-xl font-bold text-gray-800 mb-4">{{ editingExhibit() ? 'Edit Exhibit Details' : 'View Exhibit' }}: {{ selectedExhibitForModal()?.id }}</h3>

            <div class="mb-4 flex justify-center max-h-64 overflow-hidden">
              @if (selectedExhibitForModal()?.fileType.startsWith('image/')) {
                <img [src]="'data:' + selectedExhibitForModal()!.fileType + ';base64,' + selectedExhibitForModal()!.base64Content" class="max-w-full max-h-full object-contain" alt="Exhibit Image" />
              } @else if (selectedExhibitForModal()?.fileType.startsWith('text/') || selectedExhibitForModal()?.fileType === 'application/pdf') {
                <pre class="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md w-full max-h-64 overflow-y-auto">{{ getDecodedText(selectedExhibitForModal()!.base64Content) | slice:0:1000 }}</pre>
              } @else {
                <p class="text-gray-600 italic">No visual preview available for this file type.</p>
              }
            </div>

            <form (ngSubmit)="saveExhibitChanges()" class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">File Name:</label>
                <input type="text" [(ngModel)]="currentExhibitEdit!.fileName" name="fileName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-50" readonly />
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  id="description"
                  [(ngModel)]="currentExhibitEdit!.description"
                  name="description"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  [readonly]="!editingExhibit()"
                ></textarea>
              </div>
              <div>
                <label for="relevance" class="block text-sm font-medium text-gray-700">Relevance (AI-Generated):</label>
                <textarea
                  id="relevance"
                  [(ngModel)]="currentExhibitEdit!.relevance"
                  name="relevance"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  [readonly]="!editingExhibit()"
                ></textarea>
              </div>
              <div>
                <label for="ndrEvdRule" class="block text-sm font-medium text-gray-700">NDR Evd Rule (AI-Suggested):</label>
                <input
                  type="text"
                  id="ndrEvdRule"
                  [(ngModel)]="currentExhibitEdit!.ndrEvdRule"
                  name="ndrEvdRule"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  [readonly]="!editingExhibit()"
                />
              </div>
              <div>
                <label for="potentialObjections" class="block text-sm font-medium text-gray-700">Potential Objections (AI-Suggested):</label>
                <textarea
                  id="potentialObjections"
                  [(ngModel)]="currentExhibitEdit!.potentialObjections"
                  name="potentialObjections"
                  rows="2"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  [readonly]="!editingExhibit()"
                ></textarea>
              </div>
              <div>
                <label for="proposedResponses" class="block text-sm font-medium text-gray-700">Proposed Responses (AI-Suggested):</label>
                <textarea
                  id="proposedResponses"
                  [(ngModel)]="currentExhibitEdit!.proposedResponses"
                  name="proposedResponses"
                  rows="2"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  [readonly]="!editingExhibit()"
                ></textarea>
              </div>
              <div>
                <label for="aiLegalTheorySupport" class="block text-sm font-medium text-gray-700">AI Legal Theory Support:</label>
                <textarea
                  id="aiLegalTheorySupport"
                  [(ngModel)]="currentExhibitEdit!.aiLegalTheorySupport"
                  name="aiLegalTheorySupport"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                  readonly
                ></textarea>
              </div>

              <div class="flex justify-end space-x-2 mt-4">
                @if (editingExhibit()) {
                  <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                  <button type="button" (click)="cancelEdit()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                } @else {
                  <button type="button" (click)="closeModal()" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Close</button>
                }
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExhibitManagerComponent {
  caseService = inject(CaseService);

  // Fix: Use WritableSignal for reactivity and type safety.
  selectedExhibitForModal: WritableSignal<Exhibit | null> = signal(null);
  // Fix: Use a separate signal for the exhibit being edited to avoid direct mutation of source data.
  currentExhibitEdit: WritableSignal<Exhibit | null> = signal(null);
  editingExhibit = signal(false);

  /**
   * Opens the modal to view an exhibit's content and details.
   * Initializes `currentExhibitEdit` with a copy for potential editing.
   * @param exhibit The exhibit to view.
   */
  viewExhibitContent(exhibit: Exhibit): void {
    this.selectedExhibitForModal.set(exhibit);
    this.currentExhibitEdit.set({ ...exhibit }); // Create a shallow copy for the form
    this.editingExhibit.set(false); // Default to view mode
  }

  /**
   * Opens the modal in edit mode for a specific exhibit.
   * @param exhibit The exhibit to edit.
   */
  editExhibit(exhibit: Exhibit): void {
    this.selectedExhibitForModal.set(exhibit);
    this.currentExhibitEdit.set({ ...exhibit }); // Create a modifiable copy
    this.editingExhibit.set(true);
  }

  /**
   * Saves changes made to an exhibit in the modal.
   */
  saveExhibitChanges(): void {
    const updatedExhibit = this.currentExhibitEdit();
    if (updatedExhibit) {
      this.caseService.updateExhibit(updatedExhibit);
      this.selectedExhibitForModal.set(updatedExhibit); // Update the view with saved changes
      this.editingExhibit.set(false); // Exit edit mode
    }
  }

  /**
   * Cancels the editing process and reverts any unsaved changes in the modal.
   */
  cancelEdit(): void {
    this.editingExhibit.set(false);
    // Revert changes by restoring the original exhibit content to currentExhibitEdit
    this.currentExhibitEdit.set(this.selectedExhibitForModal() ? { ...this.selectedExhibitForModal()! } : null);
  }

  /**
   * Removes an exhibit from the case.
   * @param id The ID of the exhibit to remove.
   */
  removeExhibit(id: string): void {
    if (confirm(`Are you sure you want to remove exhibit ${id}?`)) {
      this.caseService.removeExhibit(id);
      if (this.selectedExhibitForModal()?.id === id) {
        this.closeModal(); // Close modal if the removed exhibit was open
      }
    }
  }

  /**
   * Closes the exhibit view/edit modal.
   */
  closeModal(): void {
    this.selectedExhibitForModal.set(null);
    this.currentExhibitEdit.set(null);
    this.editingExhibit.set(false);
  }

  /**
   * Decodes a base64 string to a regular string.
   * @param base64 The base64 string to decode.
   * @returns The decoded string, or an error message if decoding fails.
   */
  getDecodedText(base64: string): string {
    try {
      return atob(base64);
    } catch (e) {
      console.error("Failed to decode base64 string:", e);
      return "Error: Could not decode content.";
    }
  }
}