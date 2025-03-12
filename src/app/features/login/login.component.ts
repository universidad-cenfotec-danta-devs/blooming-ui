import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthGoogleService } from '../../services/auth.google.service';

/**
 * LoginComponent manages three authentication forms:
 * - Login (email & password)
 * - Sign-Up (registration with additional fields)
 * - Password Recovery (reset via email)
 *
 * It also integrates Google Sign-In and displays a confirmation modal.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /** formState determines which form is shown: 'login', 'signup', or 'recover'. Default is 'login'. */
  formState: 'login' | 'signup' | 'recover' = 'login';

  /** Translation key for confirmation modal messages */
  modalMessageKey: string = 'AUTH.SIGNUP.SUCCESS_MESSAGE';

  /** Reference to the confirmation modal */
  modalRef: ModalComponent | undefined;

  /** Reactive forms for each authentication method */
  loginForm: FormGroup;
  signUpForm: FormGroup;
  recoveryPasswordForm: FormGroup;

  constructor(public authService: AuthService, private fb: FormBuilder, private googleauthService: AuthGoogleService) {
    // Build the Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    // Build the Sign-Up Form with extra fields
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });
    // Build the Password Recovery Form
    this.recoveryPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Initialize Google Identity Services
    this.authService.initGoogleAuth();
  }

  signInWithGoogle() {

    this.googleauthService.login();

  }


  /**
   * Switches between login, sign-up, and password recovery forms.
   * @param state - 'login' | 'signup' | 'recover'
   */
  switchForm(state: 'login' | 'signup' | 'recover'): void {
    this.formState = state;
  }

  /**
   * Handles login submission.
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => console.log('Login successful', response),
        error => console.error('Login failed', error)
      );
    } else {
      console.error('Login form is invalid.');
    }
  }

  /**
   * Handles sign-up submission.
   */
  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          this.modalMessageKey = 'AUTH.SIGNUP.SUCCESS_MESSAGE';
          this.modalRef?.openModal();
          this.switchForm('login'); // Switch back to login after sign-up
        },
        error => console.error('Registration failed', error)
      );
    } else {
      console.error('Sign-up form is invalid.');
    }
  }

  /**
   * Handles password recovery submission.
   */
  onRecoverPassword(): void {
    if (this.recoveryPasswordForm.valid) {
      this.authService.requestPasswordReset(this.recoveryPasswordForm.value.email).subscribe(
        response => {
          console.log('Password reset email sent', response);
          this.modalMessageKey = 'AUTH.RECOVER.SUCCESS_MESSAGE';
          this.modalRef?.openModal();
          this.switchForm('login'); // Switch back to login after recovery
        },
        error => console.error('Password recovery failed', error)
      );
    } else {
      console.error('Recovery form is invalid.');
    }
  }

  /**
   * Triggers Google Sign-In.
   */
  loginWithGoogle(): void {
    this.authService.googleSignIn();
  }
}
function inject(AuthGoogleService: any) {
  throw new Error('Function not implemented.');
}

