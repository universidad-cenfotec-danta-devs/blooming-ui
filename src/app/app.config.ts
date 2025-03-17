import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'

/**
 * Factory function to create an instance of TranslateHttpLoader.
 * This loader is responsible for loading translation JSON files from a specified assets folder.
 *
 * @param http The HttpClient instance used to perform HTTP requests.
 * @returns A new instance of TranslateHttpLoader configured with the given HttpClient.
 */
export function HttpLoaderFactory(http: HttpClient) {
  // The loader will look for translation files in '/assets/i18n/' with '.json' extension
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

/**
 * Provides translation configuration for the TranslateModule.
 * It sets up the TranslateLoader using the HttpLoaderFactory function.
 *
 * @returns An object containing the loader configuration for TranslateModule.
 */
export const provideTranslation = () => ({
  loader: {
    provide: TranslateLoader,            // Specifies that this provider is for TranslateLoader
    useFactory: HttpLoaderFactory,       // Uses the HttpLoaderFactory to create an instance of the loader
    deps: [HttpClient],                  // Specifies that HttpClient is a dependency for the factory
  },
});

/**
 * Application configuration object that aggregates providers used for the Angular application.
 * It includes providers for change detection, HTTP client with fetch support, translation module,
 * client hydration for SSR, and application routing.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Enable zone-based change detection with event coalescing for performance optimizations
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Provide the HttpClient with fetch support
    provideHttpClient(withFetch()),

    // Import the TranslateModule and configure it with our translation provider
    importProvidersFrom(
      TranslateModule.forRoot(provideTranslation())
    ),

    // Provide client hydration for SSR, ensuring that the client app is synchronized with the server-rendered view
    provideClientHydration(),

    // Set up routing for the application using the imported routes configuration
    provideRouter(routes),
    provideOAuthClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 2000,
      extendedTimeOut: 1000,
      tapToDismiss: true,
      preventDuplicates: true,
      newestOnTop: false,
      progressBar: true,
      progressAnimation: 'decreasing',
      maxOpened: 1,
      easeTime: 300,
      positionClass: 'toast-bottom-right',
      closeButton: true
    })
  ],
};