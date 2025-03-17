import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthGoogleService } from '../../services/auth.google.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formState: 'login' | 'signup' | 'recover' = 'login';
  modalMessageKey: string = 'AUTH.SIGNUP.SUCCESS_MESSAGE';
  modalRef: ModalComponent | undefined;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  recoveryPasswordForm: FormGroup;

  constructor(
    @Inject(AuthService) public authService: AuthService,
    private fb: FormBuilder,
    @Inject(AuthGoogleService) private googleAuthService: AuthGoogleService
  ) {
    // Build the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    // Build the sign-up form with additional fields
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });
    // Build the password recovery form
    this.recoveryPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check if a token exists in AuthGoogleService (after redirect)
    const idToken = this.googleAuthService.getIdToken();
    if (idToken) {
      const action = sessionStorage.getItem('googleAuthAction') as 'login' | 'register';
      if (action) {
        sessionStorage.removeItem('googleAuthAction');
        console.log('Processing stored token with action:', action);
        this.authService.handleGoogleResponse({ credential: idToken }, action);
      }
    }
  }

  signInGoogle(action: 'login' | 'register'): void {
    sessionStorage.setItem('googleAuthAction', action);
    this.googleAuthService.login();
  }

  switchForm(state: 'login' | 'signup' | 'recover'): void {
    this.formState = state;
  }

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

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          this.modalMessageKey = 'AUTH.SIGNUP.SUCCESS_MESSAGE';
          this.modalRef?.openModal();
          this.switchForm('login');
        },
        error => console.error('Registration failed', error)
      );
    } else {
      console.error('Sign-up form is invalid.');
    }
  }

  onRecoverPassword(): void {
    if (this.recoveryPasswordForm.valid) {
      this.authService.requestPasswordReset(this.recoveryPasswordForm.value.email).subscribe(
        response => {
          console.log('Password reset email sent', response);
          this.modalMessageKey = 'AUTH.RECOVER.SUCCESS_MESSAGE';
          this.modalRef?.openModal();
          this.switchForm('login');
        },
        error => console.error('Password recovery failed', error)
      );
    } else {
      console.error('Recovery form is invalid.');
    }
  }
}
