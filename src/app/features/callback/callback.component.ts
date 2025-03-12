import { Component, inject, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit{
  constructor (private oauthService: OAuthService) {

  }
  ngOnInit() {
    // Procesa el callback de OAuth
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        console.log('Login successful');
        // Aquí puedes redirigir al usuario a su página de inicio o mostrar su perfil
      } else {
        console.log('Login failed');
        // Si el login falla, redirigir o manejar el error
      }
    });
  }
}
