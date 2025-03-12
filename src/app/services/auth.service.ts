import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../enviroments/enviroment.development';
import { ILoginResponse, IUser } from '../interfaces/auth.interfaces';


/**
 * AuthService - Manages user authentication.
 *
 * Features:
 * - Login with email and password.
 * - User registration.
 * - Google Sign-In authentication.
 * - Password recovery.
 * - Session storage and retrieval.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Stores authentication token, expiration time, and user details
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  // Checks if the code runs in the browser
  private isBrowser: boolean;
  private http: HttpClient;

  // Backend authentication API endpoints
  private BACKEND_URL = `${environment.apiUrl}/auth`;
  GOOGLE_CLIENT_ID = environment.googleClientId;

  /**
   * AuthService Constructor.
   * @param router - Angular Router for navigation.
   * @param platformId - Identifies if the code is running in the browser.
   * @param http - HttpClient for API calls.
   */
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.http = http;
    this.loadSessionData();
  }

  /**
   * Saves session data (user, token, expiration) to localStorage.
   */
  private saveSessionData(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', JSON.stringify(this.accessToken));
    if (this.expiresIn) localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  /**
   * Loads session data from localStorage when the application starts.
   */
  private loadSessionData(): void {
    const token = localStorage.getItem('access_token');
    if (token) this.accessToken = JSON.parse(token);

    const exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);

    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  /**
   * Retrieves the authenticated user.
   * @returns The IUser object or undefined if no session exists.
   */
  public getUser(): IUser | undefined {
    return this.user;
  }

  /**
   * Retrieves the stored authentication token.
   * @returns The session token string or null if not available.
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Initializes Google Identity Services for authentication.
   */
  public initGoogleAuth(): void {
    if (this.isBrowser && (window as any).google) {
       const boundCallback = this.handleGoogleResponse.bind(this);
       (window as any).google.accounts.id.initialize({
         client_id: environment.googleClientId,
         callback: 'https:fw16p146-4200.use.devtunnels.ms/callback',
         ux_mode: 'popup',
         auto_select: false,
       });
    }
  }

  /**
   * Opens the Google Sign-In prompt.
   */
  public googleSignIn(): void {
    if (this.isBrowser && (window as any).google) {
      (window as any).google.accounts.id.prompt();
    }
  }

  /**
   * Handles the response from Google Sign-In.
   * Sends the Google credential to the backend for authentication.
   * @param response - Google authentication response object.
   */
  public handleGoogleResponse(response: any): void {
    if (!response || !response.credential) return;
    console.log('Google response',response)
    this.sendGoogleTokenToBackend(response.credential).subscribe(
      jwtResponse => {
        if (jwtResponse.success) {
          localStorage.setItem('access_token', jwtResponse.token);
          this.router.navigate(['/home']);
        }
      }
    );
  }

  /**
   * Sends the Google authentication token to the backend.
   * @param googleToken - Google authentication credential token.
   */
  public sendGoogleTokenToBackend(googleToken: string): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>(`${this.BACKEND_URL}/google`, { token: googleToken });
  }

  /**
   * Logs in a user with email and password.
   * @param credentials - Object containing email and password.
   */
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL}/login`, credentials).pipe(
      tap(response => {
        this.accessToken = response.token;
        this.user = response.authUser;
        this.expiresIn = response.expiresIn;
        this.saveSessionData();
      })
    );
  }

  /**
   * Registers a new user.
   * @param data - User registration details.
   */
  public register(data: any): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL}/register`, data);
  }

  /**
   * Requests a password reset.
   * @param email - User's email address.
   */
  public requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BACKEND_URL}/reset-password`, { email });
  }

  /**
   * Logs out the user.
   */
  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  /**
   * Checks if a user is currently logged in.
   * @returns `true` if a session exists, otherwise `false`.
   */
  public check(): boolean {
    return !!this.accessToken;
  }
}
