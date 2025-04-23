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
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  /**
   * Subject that emits the ID token when it becomes available.
   * Other parts of the application can subscribe to this subject to be notified of new tokens.
   */
  public tokenReceived$ = new Subject<string>();

  private isBrowser: boolean;

  /**
   * OAuth configuration object for Google authentication.
   * The redirectUri is set conditionally based on the environment.
   */
  authConfig: AuthConfig = {
    issuer: 'enviroment.googleIssuer',
    redirectUri: '',
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
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.authConfig.redirectUri = window.location.origin + '/login';
    } else {
      this.authConfig.redirectUri = 'http://localhost:4200/login';
    }
    this.initConfiguration();
  }

  /**
   * Initializes the OAuth configuration and sets up the token listener.
   * It loads the discovery document and attempts auto-login if returning from Google.
   * The loading and login attempts are only executed in a browser environment.
   */
  initConfiguration(): void {
    this.oAuthService.configure(this.authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    if (this.isBrowser) {
      this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (this.oAuthService.hasValidIdToken()) {
          this.profile.set(this.oAuthService.getIdentityClaims());
          const idToken = this.oAuthService.getIdToken();
          if (idToken) {
            this.tokenReceived$.next(idToken);
          }
        }
      });
    }

    this.oAuthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        const idToken = this.oAuthService.getIdToken();
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
