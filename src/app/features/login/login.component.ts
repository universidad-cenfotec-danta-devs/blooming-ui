import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';

/**
 * LoginComponent handles the login view of the application.
 * It initializes the Google Authentication SDK on component load,
 * and provides a method to trigger the Google Sign-In popup.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  /**
   * Determines if the Google Sign-In button should be displayed.
   * It returns true if there is no token in session storage.
   */
  get showGoogleButton(): boolean {
    return !sessionStorage.getItem('blooming-token');
  }

  /**
   * Constructor injects the AuthService.
   * @param authService - Service handling authentication logic.
   */
  constructor(public authService: AuthService) {}

  /**
   * Angular lifecycle hook called on component initialization.
   * Calls the AuthService to initialize the Google Identity Services.
   */
  ngOnInit(): void {
    this.authService.initGoogleAuth();
  }

  /**
   * Triggers the Google Sign-In process.
   * This method calls the googleSignIn() function of AuthService,
   * which opens the Google Sign-In popup.
   */
  loginWithGoogle(): void {
    this.authService.googleSignIn();
  }
}
