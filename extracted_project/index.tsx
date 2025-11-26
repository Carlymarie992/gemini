
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Removed withHashLocation import here
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common'; // New imports for LocationStrategy

bootstrapApplication(AppComponent, {
  providers: [
    provideProtractorTestingSupport(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    { provide: APP_BASE_HREF, useValue: '/' },
    // Explicitly provide HashLocationStrategy instead of using withHashLocation()
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideRouter([]), // No router features needed here as LocationStrategy is provided directly
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.