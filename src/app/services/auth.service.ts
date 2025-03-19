import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment.development';
import { ILoginResponse, IUser } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Stores the authentication token received from the backend
  private accessToken!: string;
  // Stores the expiration time of the token
  private expiresIn!: number;
  // Stores the authenticated user details
  private user: IUser = { email: '', authorities: [] };

  // Indicates if the code is running in the browser
  private isBrowser: boolean;
  // HttpClient instance for making API calls
  private http: HttpClient;

  // URL of the backend authentication API
  private BACKEND_URL = `${environment.apiUrl}/api/users`;
  private BACKEND_URL2 = `${environment.apiUrl2}/api/users`
  // Google Client ID from the environment configuration
  GOOGLE_CLIENT_ID = environment.googleClientId;

  /**
   * Constructor for the AuthService.
   * @param router - Angular Router used for navigation.
   * @param platformId - Platform identifier to check if code runs in the browser.
   * @param http - HttpClient used for API calls.
   */
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    http: HttpClient
  ) {
    // Check if the code is running in the browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.http = http;
    // Load session data from localStorage if available
    this.loadSessionData();
  }

  /**
   * Saves session data (user, token, and expiration time) to localStorage.
   */
  private saveSessionData(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));
    if (this.expiresIn)
      localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  /**
   * Loads session data (user, token, and expiration time) from localStorage.
   */
  private loadSessionData(): void {
    if(this.isBrowser) {
      const token = localStorage.getItem('access_token');
      if (token) this.accessToken = JSON.parse(token);

      const exp = localStorage.getItem('expiresIn');
      if (exp) this.expiresIn = JSON.parse(exp);

      const user = localStorage.getItem('auth_user');
      if (user) this.user = JSON.parse(user);
    }
  }

  /**
   * Retrieves the authenticated user.
   * @returns The authenticated user object or undefined if not logged in.
   */
  public getUser(): IUser | undefined {
    return this.user;
  }

  /**
   * Retrieves the stored access token.
   * @returns The access token string if available, otherwise null.
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Handles the response from Google Sign-In.
   * It sends the Google credential (ID token) along with the intended action
   * (either 'login' or 'register') to the backend for processing.
   * Based on the action, it redirects the user to the appropriate route.
   * 
   * @param response - Object containing the Google ID token as 'credential'.
   * @param action - A string ('login' or 'register') indicating the intended operation.
   */
  public handleGoogleResponse(response: any, action: 'login' | 'register'): void {
    if (!response || !response.credential) return;
    console.log('Google response', response, 'Action', action);
    this.sendGoogleTokenToBackend(response.credential, action).subscribe(
      jwtResponse => {
        if (jwtResponse.success) {
          // Save the received token in localStorage
          localStorage.setItem('access_token', jwtResponse.token);
          // Redirect based on the action
          if (action === 'login') {
            // If logging in, navigate to home page
            this.router.navigate(['/home']);
          } else if (action === 'register') {
            // If registering, navigate to a registration success or welcome page
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  /**
   * Sends the Google authentication token along with an action parameter to the backend.
   * The backend uses the 'action' parameter to decide whether to register a new user
   * or simply log in an existing one.
   * @param googleToken - The Google ID token.
   * @param action - 'login' or 'register' to indicate the desired operation.
   * @returns An Observable with the backend response containing a success flag and token.
   */
  public sendGoogleTokenToBackend(
    googleToken: string,
    action: 'login' | 'register'
  ): Observable<{ success: boolean; token: string }> {
    const body = new HttpParams()
      .set('token', googleToken);
    return this.http.post<{ success: boolean; token: string }>(
      `${this.BACKEND_URL}/logInWithGoogle`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  /**
   * Logs in a user using email and password credentials.
   * @param credentials - Object containing email and password.
   * @returns An Observable with the login response.
   */
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL2}/logIn`, credentials).pipe(
      tap(response => {
        // Store token, user details, and expiration time
        this.accessToken = response.token;
        this.user = response.authUser;
        this.expiresIn = response.expiresIn;
        this.saveSessionData();
      })
    );
  }

  /**
   * Registers a new user.
   * @param data - Object containing user registration details.
   * @returns An Observable with the registration response.
   */
  public register(data: any): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.BACKEND_URL2}/signup`, data);
  }

  /**
   * Requests a password reset by sending the user's email to the backend.
   * @param email - The user's email address.
   * @returns An Observable with a message response.
   */
  public requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.BACKEND_URL}/reset-password`, { email });
  }

  /**
   * Logs out the user by clearing stored session data.
   */
  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  /**
   * Checks if a user is currently logged in.
   * @returns True if an access token exists, otherwise false.
   */
  public check(): boolean {
    return !!this.accessToken;
  }
}
