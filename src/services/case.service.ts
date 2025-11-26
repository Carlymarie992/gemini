// Fix: Implement CaseService to manage case details and exhibits using signals.

import { Injectable, signal, WritableSignal } from '@angular/core';
import { CaseDetails, Exhibit } from '../models/case.model';

@Injectable({ providedIn: 'root' })
export class CaseService {
  public caseDetails: WritableSignal<CaseDetails>;
  public exhibits: WritableSignal<Exhibit[]>;

  constructor() {
    // Initialize with default or empty values
    this.caseDetails = signal<CaseDetails>({
      caseName: '',
      clientName: '',
      opposingPartyName: '',
      caseType: '',
      coreIssue: '',
      legalTheory: '',
    });

    this.exhibits = signal<Exhibit[]>([]);
  }

  updateCaseDetails(updates: Partial<CaseDetails>): void {
    this.caseDetails.update((currentDetails) => ({
      ...currentDetails,
      ...updates,
    }));
  }

  addExhibit(exhibit: Exhibit): void {
    this.exhibits.update((currentExhibits) => {
      // Ensure unique IDs
      if (currentExhibits.some(e => e.id === exhibit.id)) {
        console.warn(`Exhibit with ID ${exhibit.id} already exists. Skipping.`);
        return currentExhibits;
      }
      return [...currentExhibits, exhibit];
    });
  }

  updateExhibit(updatedExhibit: Exhibit): void {
    this.exhibits.update((currentExhibits) =>
      currentExhibits.map((ex) => (ex.id === updatedExhibit.id ? updatedExhibit : ex))
    );
  }

  removeExhibit(exhibitId: string): void {
    this.exhibits.update((currentExhibits) =>
      currentExhibits.filter((ex) => ex.id !== exhibitId)
    );
  }

  resetCase(): void {
    this.caseDetails.set({
      caseName: '',
      clientName: '',
      opposingPartyName: '',
      caseType: '',
      coreIssue: '',
      legalTheory: '',
    });
    this.exhibits.set([]);
  }
}
