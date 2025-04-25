import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment.development';
import { ILoginResponse, IUser } from '../interfaces/auth.interfaces';
import { IRoleType } from '../interfaces/roleType.interfaces';
import { TokenStoreService } from './token-store.service';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from './cart.service';

/**
 * The AuthService handles user authentication logic (login, register, logout).
 * It reads/writes token & user data using the TokenStoreService instead
 * of storing them directly, thus avoiding circular dependencies with interceptors.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http: HttpClient;
  private isBrowser: boolean;

  private BACKEND_URL = `${environment.apiUrl}/api/users`;

  GOOGLE_CLIENT_ID = environment.googleClientId;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    http: HttpClient,
    private tokenStore: TokenStoreService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.http = http;

    this.loadSessionData();
  }

  /**
   * Loads session data (user, token, and expiration time) from localStorage, if needed.
   */
  private loadSessionData(): void {
    if (!this.isBrowser) return;
  }

  /**
   * Logs in a user using email and password credentials.
   * @param credentials - { email: string; password: string }
   * @returns An Observable with the login response.
   */
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL}/logIn`, credentials)
      .pipe(
        // Check if the response indicates an error, then throw an error.
        map((response: ILoginResponse) => {
          console.log('Login response:', response);
          if (!response.token || response.error) {
            // Manually throw an HttpErrorResponse to trigger the error callback.
            throw new HttpErrorResponse({
              status: 401,
              error: response.error || { error: 'Invalid Credentials' }
            });
          }
          return response;
        }),
        tap((response: ILoginResponse) => {
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
        this.tokenStore.setToken(jwtResponse.token);
        this.tokenStore.setUser(response.authUser);
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
  public isDesignerOrNurseryAdmin(): boolean {
    const user = this.tokenStore.getUser();
    return user.authorities
      ? user.authorities.some(a =>
        a.authority === IRoleType.role_designer_user || a.authority === IRoleType.nursery || a.authority === IRoleType.role_designer_user)
      : false;
  }



}
