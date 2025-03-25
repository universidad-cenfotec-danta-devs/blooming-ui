import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { handleErrorsInterceptor } from './interceptors/handle-error.interceptor';
import { accessTokenInterceptor } from './interceptors/access-token.interceptor';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';

/**
 * Factory function to create an instance of TranslateHttpLoader.
 * This loader is responsible for loading translation JSON files from a specified folder.
 *
 * @param http The HttpClient instance used to make HTTP requests.
 * @returns A new instance of TranslateHttpLoader configured with the HttpClient.
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

/**
 * Provider for translation configuration for the TranslateModule.
 * It sets up the TranslateLoader using the HttpLoaderFactory function.
 *
 * @returns An object with the configuration for the TranslateLoader.
 */
export const provideTranslation = () => ({
  loader: {
    provide: TranslateLoader,          // Provider for TranslateLoader.
    useFactory: HttpLoaderFactory,     // Uses HttpLoaderFactory to create the loader.
    deps: [HttpClient],                // Dependency: HttpClient.
  },
});

/**
 * Application configuration object that aggregates all required providers.
 * This includes providers for:
 * - Zone-based change detection.
 * - HttpClient with custom interceptors.
 * - Translation module.
 * - Client hydration for SSR.
 * - Application routing.
 * - OAuth client for authentication flows.
 * - Animations and Toastr notifications.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Enable zone-based change detection with event coalescing for performance optimization.
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Provide HttpClient with custom interceptors: base URL, access token, and error handling.
    provideHttpClient(
      withInterceptors([
     //   baseUrlInterceptor,
        accessTokenInterceptor,
        handleErrorsInterceptor
      ])
    ),

    // Import the TranslateModule and configure it with the translation provider.
    importProvidersFrom(
      TranslateModule.forRoot(provideTranslation())
    ),

    // Provide client hydration for SSR, ensuring that the client app is synchronized with the server-rendered view.
    provideClientHydration(),

    // Set up the application's routing using the defined routes.
    provideRouter(routes),

    // Provide the OAuth client to handle OAuth-based authentication flows.
    provideOAuthClient(),

    // Enable animations in the application.
    provideAnimations(),

    // Configure and provide Toastr for notifications with custom parameters.
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
