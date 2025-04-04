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
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
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
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([
        accessTokenInterceptor,
        handleErrorsInterceptor
      ])
    ),

    importProvidersFrom(
      TranslateModule.forRoot(provideTranslation())
    ),

    provideClientHydration(),

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
