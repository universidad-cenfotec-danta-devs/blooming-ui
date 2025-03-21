import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../enviroments/enviroment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  // Inject OAuthService and Router dependencies
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  // Subject to emit the ID token when available
  public tokenReceived$ = new Subject<string>();

  // OAuth configuration for Google authentication
  authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin + '/login',
    clientId: environment.googleClientId,
    scope: 'openid profile email',
    responseType: 'token id_token',
    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
  };

  // Signal to hold the user's profile data reactively
  profile = signal<any>(null);

  constructor() {
    this.initConfiguration();
  }

  /**
   * Initializes the OAuth configuration and sets up the token listener.
   * Loads the discovery document and subscribes to OAuth events to capture the token.
   */
  initConfiguration(): void {
    this.oAuthService.configure(this.authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    // Load discovery document and attempt auto-login if returning from Google.
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        // Set the user profile based on the received token.
        this.profile.set(this.oAuthService.getIdentityClaims());
        const idToken = this.oAuthService.getIdToken();
        if (idToken) {
          console.log('Token received on init:', idToken);
          this.tokenReceived$.next(idToken);
        }
      }
    });

    // Listen to OAuth events to capture new tokens.
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
   * Because of the redirect, this method does not return the token immediately.
   */
  login(): void {
    this.oAuthService.initImplicitFlow();
  }

  /**
   * Logs out the user.
   */
  logout(): void {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
  }

  /**
   * Returns the current user profile extracted from the ID token.
   * @returns The user profile data, or null if not available.
   */
  getProfile(): any {
    return this.profile();
  }

  /**
   * Returns the current ID token.
   * @returns The ID token as a string if available, otherwise null.
   */
  getIdToken(): string | null {
    return this.oAuthService.getIdToken();
  }
}
