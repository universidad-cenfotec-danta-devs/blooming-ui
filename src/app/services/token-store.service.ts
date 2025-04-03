import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/auth.interfaces';

@Injectable({ providedIn: 'root' })
export class TokenStoreService {
  private TOKEN_KEY = 'access_token';
  private USER_KEY = 'auth_user';
  private EXPIRES_IN_KEY = 'expiresIn';

  public getToken(): string | null {
    // Retrieve token as plain string (no JSON.parse)
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public setToken(token: string): void {
    // Store token as plain string (no JSON.stringify)
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public getUser(): IUser {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : { email: '', authorities: [] };
  }

  public setUser(user: IUser): void {
    // For user objects, you *do* want JSON
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  public getExpiresIn(): number | null {
    const exp = localStorage.getItem(this.EXPIRES_IN_KEY);
    return exp ? JSON.parse(exp) : null;
  }

  public setExpiresIn(expiresIn: number): void {
    localStorage.setItem(this.EXPIRES_IN_KEY, JSON.stringify(expiresIn));
  }

  public removeExpiresIn(): void {
    localStorage.removeItem(this.EXPIRES_IN_KEY);
  }
}
