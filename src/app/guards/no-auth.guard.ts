import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

/**
 * NoAuthGuard prevents access to certain routes (e.g., login or registration)
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
   */
  constructor(private router: Router) {}

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
    // Retrieve the authentication token from localStorage.
    const token = localStorage.getItem('token');

    // If a token exists, the user is considered authenticated.
    if (token) {
      // Optionally, you could include additional logic here to verify that the token is valid or not expired.
      // Redirect the user to the home page (or any designated route for authenticated users).
      this.router.navigate(['/home']);
      return false; // Block access to the current route.
    }

    // If no token exists, allow access to the guarded route (e.g., login).
    return true;
  }
}
