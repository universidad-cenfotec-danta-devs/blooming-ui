import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * NoAuthGuard prevents access to routes (e.g., login or registration)
 * if the user is already authenticated (i.e. a token exists in localStorage).
 *
 * When a token is found, it navigates the user to a default authenticated route (e.g., '/home')
 * and returns false to block access to the guarded route.
 */
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  /**
   * @param router - Angular Router instance for navigation.
   * @param platformId - Identifier to check if code runs in the browser.
   */
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Determines if a route can be activated.
   *
   * @param route - The activated route snapshot.
   * @param state - The current router state snapshot.
   * @returns A boolean, UrlTree, Observable, or Promise that resolves to a boolean or UrlTree.
   *          Returns false if the user is authenticated, otherwise true.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // Only attempt to access localStorage if we're in the browser.
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        // If a token exists, the user is considered authenticated.
        // Redirect to the home page (or any designated route for authenticated users).
        this.router.navigate(['/home']);
        return false; // Block access to the guarded route.
      }
      // No token found, allow access.
      return true;
    } else {
      // In a server-side environment, simply allow access.
      return true;
    }
  }
}
