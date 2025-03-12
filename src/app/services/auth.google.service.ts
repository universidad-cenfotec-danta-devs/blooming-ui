import { Injectable, inject, signal } from '@angular/core';

import { Router } from '@angular/router';

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../enviroments/enviroment.development';



@Injectable({

  providedIn: 'root',
})

export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  authConfig: AuthConfig = {
          issuer: 'https://accounts.google.com',
          redirectUri: window.location.origin + '/login',
          clientId: environment.googleClientId,
          scope: 'openid profile email',
          responseType: 'token id_token',
          showDebugInformation: true,
          strictDiscoveryDocumentValidation: false,
        };

  profile = signal<any>(null);

  // https://serengetitech.com/tech/implementing-oauth2-login-in-angular-18-with-google-cloud-client-id-integration/
  //https://www.npmjs.com/package/angular-oauth2-oidc

  constructor() {

    this.initConfiguration();

  }

  initConfiguration() {

    this.oAuthService.configure(this.authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.oAuthService.hasValidIdToken()) {

        this.profile.set(this.oAuthService.getIdentityClaims());

      }

    });

  }

  login(): void {

    this.oAuthService.initImplicitFlow();

  }

  logout() {

    this.oAuthService.revokeTokenAndLogout();

    this.oAuthService.logOut();

    this.profile.set(null);

  }

  getProfile() {

    return this.profile();

  } 
}