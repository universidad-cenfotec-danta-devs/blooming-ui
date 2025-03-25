/*import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * NoAuthGuard
 *
 * This guard prevents authenticated users from accessing certain routes.
 * It checks the authentication status only when running in a browser environment.
 *
 * - If in the browser and the user is not authenticated, the route is activated.
 * - If in the browser and the user is authenticated, the user is redirected to `/home`.
 * - When running on the server (e.g., during server-side rendering), the authentication
 *   check is skipped to avoid potential issues with browser-specific code.
 */
/*
export const NoAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

if (isPlatformBrowser(platformId)) {
    // Only run the authentication check on the browser
    console.log('checking')
    if (!authService.check()) {
      return true;
    }
    return router.parseUrl('/home');
  }

  // On the server, skip the authentication check and allow route activation
  return true;

};

*/