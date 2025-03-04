import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../enviroments/enviroment.development';
import {  ILoginResponse, IUser } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };
  private isBrowser: boolean;
  private http: HttpClient;
  private BACKEND_URL = `${environment.apiUrl}/auth/google`;
  GOOGLE_CLIENT_ID = environment.googleClientId;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.http = http;
    console.log('AuthService: Running in browser:', this.isBrowser);
    this.loadSessionData();
  }

  /**
   * Saves authentication details to localStorage to persist user session.
   */
  private saveSessionData(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', JSON.stringify(this.accessToken));
    if (this.expiresIn) localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  /**
   * Loads stored authentication data from localStorage when the application starts.
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
   * Retrieves the currently authenticated user.
   * @returns The authenticated user object or undefined if no user is logged in.
   */
  public getUser(): IUser | undefined {
    return this.user;
  }

  /**
   * Retrieves the stored JWT access token.
   * @returns The access token string or null if no token exists.
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }



  /**
   * Initializes Google Authentication services and sets up the sign-in callback.
   */
  public initGoogleAuth(): void {
    if (this.isBrowser && (window as any).google) {
      console.log('Initializing Google Identity Services with client ID:', environment.googleClientId);
      const boundCallback = this.handleGoogleResponse.bind(this);
      (window as any).google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: boundCallback,
        ux_mode: 'popup',
        auto_select: false,
      });
      console.log('Google Identity Services initialized.');
    } else {
      console.warn('Google Identity Services not available or not running in a browser.');
    }
  }

  /**
   * Triggers Google Sign-In using a popup window.
   */
  public googleSignIn(): void {
    if (this.isBrowser && (window as any).google) {
      console.log('Opening Google Sign-In popup...');
      (window as any).google.accounts.id.prompt((notification: any) => {
        console.log('Google Sign-In prompt notification:', notification);
        if (notification.isNotDisplayed) console.error('Google Sign-In prompt was not displayed:', notification);
        if (notification.isSkippedMoment) console.warn('Google Sign-In prompt was skipped:', notification);
      });
    } else {
      console.warn('Google Identity Services not available or not running in browser.');
    }
  }

  /**
   * Handles the response from Google Sign-In.
   * Sends the Google credential to the backend for authentication and stores the JWT.
   * @param response - The response object from Google Sign-In containing the credential.
   */
  public handleGoogleResponse(response: any): void {
    try {
      console.log('Google Auth Response received:', response);
      if (!response || !response.credential) {
        console.error('Invalid Google response. No credential found.');
        return;
      }

      // Send Google token to backend for verification
      this.sendGoogleTokenToBackend(response.credential).subscribe(
        jwtResponse => {
          if (jwtResponse.success) {
            if (this.isBrowser) {
              localStorage.setItem('access_token', jwtResponse.token);
              console.log('JWT stored successfully:', jwtResponse.token);
            }
            this.router.navigate(['/home']).then(navigated => console.log('Navigation successful:', navigated));
          } else {
            console.error('JWT exchange failed:', jwtResponse);
          }
        },
        error => console.error('Error during backend authentication:', error)
      );
    } catch (err) {
      console.error('Error in handleGoogleResponse:', err);
    }
  }

  /**
   * Sends the Google authentication token to the backend for verification and JWT retrieval.
   * @param googleToken - The token received from Google.
   * @returns An Observable emitting a response with a success flag and a JWT token.
   */
  public sendGoogleTokenToBackend(googleToken: string): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>(this.BACKEND_URL, { token: googleToken }).pipe(
      tap(response => console.log('Backend response:', response)),
      catchError(error => {
        console.error('Backend authentication error:', error);
        throw error;
      })
    );
  }

  /**
   * Logs in the user using email and password authentication.
   * @param credentials - The user's email and password.
   * @returns An Observable emitting the login response with the JWT token.
   */
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.accessToken = response.token;
        this.user = response.authUser;
        this.expiresIn = response.expiresIn;
        this.saveSessionData();
      })
    );
  }

  /**
   * Logs out the user by clearing authentication data.
   */
  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

    /**
   * Checks if the user is logged in.
   * @returns `true` if authenticated, otherwise `false`.
   */

  public check(): boolean {
    if (!this.accessToken){
      return false;
    } else {
      return true;
    }
  }
}

