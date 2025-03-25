import { Injectable, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../enviroments/enviroment.development';
import { Subject } from 'rxjs';

/**
 * AuthGoogleService handles Google OAuth authentication using the angular-oauth2-oidc library.
 * It configures the OAuth service, sets up automatic token refresh, and manages OAuth events
 * for login and logout operations.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  // Inject OAuthService and Router using Angular's inject function
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  /**
   * Subject that emits the ID token when it becomes available.
   * Other parts of the application can subscribe to this subject to be notified of new tokens.
   */
  public tokenReceived$ = new Subject<string>();

  // Flag to check if the code is executing in a browser environment
  private isBrowser: boolean;

  /**
   * OAuth configuration object for Google authentication.
   * The redirectUri is set conditionally based on the environment.
   */
  authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: '', // Will be set based on the environment in the constructor
    clientId: environment.googleClientId,
    scope: 'openid profile email',
    responseType: 'token id_token',
    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
  };

  /**
   * Signal to hold the user's profile data reactively.
   * Initially, it is set to null.
   */
  profile = signal<any>(null);

  /**
   * Constructor that injects the necessary dependencies.
   * It sets the correct redirect URI depending on whether the code runs in a browser.
   *
   * @param platformId - The platform identifier provided by Angular, used to check if the code runs in a browser.
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if the code is executing in the browser
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Set the redirect URI based on the environment
    if (this.isBrowser) {
      this.authConfig.redirectUri = window.location.origin + '/login';
    } else {
      // Fallback value for non-browser environments (e.g., server-side rendering)
      this.authConfig.redirectUri = 'http://localhost:4200/login';
    }
    // Initialize OAuth configuration and event handling
    this.initConfiguration();
  }

  /**
   * Initializes the OAuth configuration and sets up the token listener.
   * It loads the discovery document and attempts auto-login if returning from Google.
   * The loading and login attempts are only executed in a browser environment.
   */
  initConfiguration(): void {
    // Configure the OAuthService with our settings
    this.oAuthService.configure(this.authConfig);
    // Set up automatic silent refresh of tokens
    this.oAuthService.setupAutomaticSilentRefresh();

    // Only execute browser-specific code if in the browser
    if (this.isBrowser) {
      // Load the discovery document and attempt to log in automatically
      this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        // If a valid ID token is present, update the profile signal and emit the token
        if (this.oAuthService.hasValidIdToken()) {
          this.profile.set(this.oAuthService.getIdentityClaims());
          const idToken = this.oAuthService.getIdToken();
          if (idToken) {
            console.log('Token received on init:', idToken);
            this.tokenReceived$.next(idToken);
          }
        }
      });
    }

    // Subscribe to OAuth events to capture new tokens as they are received
    // Note: Events may be emitted only if in browser, so this subscription is safe.
    this.oAuthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        const idToken = this.oAuthService.getIdToken();
        console.log('Token received in OAuth event:', idToken);
        if (idToken) {
          this.tokenReceived$.next(idToken);
        }
      }
    });
  }

  /**
   * Initiates the OAuth implicit flow by redirecting the user to Google's login page.
   * This method does not return the token immediately due to the redirect.
   */
  login(): void {
    // Ensure login is only attempted in a browser environment
    if (this.isBrowser) {
      this.oAuthService.initImplicitFlow();
    }
  }

  /**
   * Logs out the user by revoking the token and clearing the user profile.
   */
  logout(): void {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
  }

  /**
   * Returns the current user profile.
   *
   * @returns The user's profile data if available, otherwise null.
   */
  getProfile(): any {
    return this.profile();
  }

  /**
   * Returns the current ID token.
   *
   * @returns The ID token string if available, otherwise null.
   */
  getIdToken(): string | null {
    return this.oAuthService.getIdToken();
  }
}
