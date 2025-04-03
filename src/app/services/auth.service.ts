import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment.development';
import { ILoginResponse, IUser } from '../interfaces/auth.interfaces';
import { IRoleType } from '../interfaces/roleType.interfaces';
import { TokenStoreService } from './token-store.service';

/**
 * The AuthService handles user authentication logic (login, register, logout).
 * It reads/writes token & user data using the TokenStoreService instead
 * of storing them directly, thus avoiding circular dependencies with interceptors.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // HttpClient for making API calls
  private http: HttpClient;
  // Indicates if the code is running in the browser
  private isBrowser: boolean;

  // URL of the backend authentication API
  private BACKEND_URL = `${environment.apiUrl}/api/users`;

  // Google Client ID from the environment configuration
  GOOGLE_CLIENT_ID = environment.googleClientId;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    http: HttpClient,
    private tokenStore: TokenStoreService
  ) {
    // Check if code is running in the browser
    this.isBrowser = isPlatformBrowser(platformId);
    this.http = http;

    this.loadSessionData();
  }

  /**
   * Loads session data (user, token, and expiration time) from localStorage, if needed.
   */
  private loadSessionData(): void {
    if (!this.isBrowser) return;
   // We can use thjis is the future
  }

  /**
   * Logs in a user using email and password credentials.
   * @param credentials - { email: string; password: string }
   * @returns An Observable with the login response.
   */
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL}/logIn`, credentials)
      .pipe(
        tap(response => {
          // Store token, user details, and expiration time in the TokenStore
          this.tokenStore.setToken(response.token);
          this.tokenStore.setUser(response.authUser);
          if (response.expiresIn) {
            this.tokenStore.setExpiresIn(response.expiresIn);
          }
        })
      );
  }

  /**
   * Logs out the user by clearing stored session data.
   */
  public logout(): void {
    this.tokenStore.removeToken();
    this.tokenStore.removeUser();
    this.tokenStore.removeExpiresIn();
    // Optionally redirect user after logout
    this.router.navigateByUrl('/login');
  }

  /**
   * Checks if a user is currently logged in by seeing if a token exists in the store.
   */
  public check(): boolean {
    const token = this.tokenStore.getToken();
    return !!token;
  }

  /**
   * Retrieves the authenticated user from the TokenStore.
   * @returns The user object (or a default/empty user if not present).
   */
  public getUser(): IUser {
    return this.tokenStore.getUser();
  }

  /**
   * Retrieves the stored access token from the TokenStore.
   * @returns The token string, or null if not present.
   */
  public getAccessToken(): string | null {
    return this.tokenStore.getToken();
  }

  /**
   * Example: Handle Google Sign-In token from the front-end.
   */
  public handleGoogleResponse(response: any, action: 'login' | 'register'): void {
    if (!response || !response.credential) return;

    this.sendGoogleTokenToBackend(response.credential, action).subscribe(jwtResponse => {
      if (jwtResponse.success) {
        // Save the received token
        this.tokenStore.setToken(jwtResponse.token);
        // Redirect based on the action
        if (action === 'login') {
          this.router.navigate(['/home']);
        } else if (action === 'register') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Sends the Google authentication token along with an action param to the backend.
   */
  public sendGoogleTokenToBackend(
    googleToken: string,
    action: 'login' | 'register'
  ): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>(
      `${this.BACKEND_URL}/logInWithGoogle/${googleToken}`,
      null
    );
  }

  /**
   * Registers a new user with the provided data.
   */
  public register(data: any): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL}/signup`, data);
  }

  /**
   * Requests a password reset by sending the user's email.
   */
  public requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BACKEND_URL}/reset-password`, { email });
  }

  /**
   * Checks if the user has the specified role.
   * @param role - The role to check (e.g. "ADMIN").
   */
  public hasRole(role: string): boolean {
    const user = this.tokenStore.getUser();
    return user.authorities
      ? user.authorities.some(a => a.authority === role)
      : false;
  }

  /**
   * Checks if the user is an admin (assuming the role is "ADMIN").
   */
  public isAdmin(): boolean {
    const user = this.tokenStore.getUser();
    return user.authorities
      ? user.authorities.some(a => a.authority === IRoleType.admin)
      : false;
  }
}
