import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthGoogleService } from '../../services/auth.google.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/** 
 * Custom validator for Date of Birth.  
 * Checks that the input date is not in the future and that the user is at least 18 years old.
 * Returns a "futureDate" error if the date is in the future, or a "dobAge" error if the age is less than 18.
 */
export function dateOfBirthValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight for comparison
  
  if (inputDate > today) {
    return { futureDate: true };
  }

  let age = today.getFullYear() - inputDate.getFullYear();
  const monthDiff = today.getMonth() - inputDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
    age--;
  }
  if (age < 18) {
    return { dobAge: { requiredAge: 18, actualAge: age } };
  }
  return null;
}

/**
 * Custom validator for a strong password.
 * Validates that the password:
 * - Has at least 8 characters.
 * - Contains at least one uppercase letter.
 * - Contains at least one lowercase letter.
 * - Contains at least one digit.
 * - Contains at least one special character.
 * Returns a specific error key for each missing requirement.
 */
export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;
  if (!value) return null;
  const errors: any = {};
  
  if (value.length < 8) {
    errors.passwordTooShort = true;
  }
  if (!/[A-Z]/.test(value)) {
    errors.passwordMissingUppercase = true;
  }
  if (!/[a-z]/.test(value)) {
    errors.passwordMissingLowercase = true;
  }
  if (!/\d/.test(value)) {
    errors.passwordMissingDigit = true;
  }
  if (!/[@$!%*?&]/.test(value)) {
    errors.passwordMissingSpecial = true;
  }
  
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Form state: 'login', 'signup', or 'recover'.
  formState: 'login' | 'signup' | 'recover' = 'login';
  // Translation key for displaying a success message in the modal after registration.
  modalMessageKey: string = 'AUTH.SIGNUP.SUCCESS_MESSAGE';
  modalRef: ModalComponent | undefined;
  
  // Form groups for login, sign-up, and password recovery.
  loginForm: FormGroup;
  signUpForm: FormGroup;
  recoveryPasswordForm: FormGroup;

  constructor(
    @Inject(AuthService) public authService: AuthService,
    private fb: FormBuilder,
    @Inject(AuthGoogleService) private googleAuthService: AuthGoogleService, 
    private toastr: ToastrService, 
    private router: Router
  ) {
    // Initialize login form.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Initialize sign-up form with custom validators.
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      name: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, dateOfBirthValidator]],
      gender: ['', Validators.required],
      role: this.fb.group({
        name: ['', Validators.required]
      })
    });

    // Initialize password recovery form.
    this.recoveryPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check for a Google ID token (after a redirect) and handle authentication if present.
    const idToken = this.googleAuthService.getIdToken();
    if (idToken) {
      const action = sessionStorage.getItem('googleAuthAction') as 'login' | 'register';
      if (action) {
        sessionStorage.removeItem('googleAuthAction');
        this.authService.handleGoogleResponse({ credential: idToken }, action);
      }
    }
  }

  // Trigger Google Sign-In for login or registration.
  signInGoogle(action: 'login' | 'register'): void {
    console.log('Google sign-in action:', action);
    sessionStorage.setItem('googleAuthAction', action);
    this.googleAuthService.login();
  }

  // Switch the form view.
  switchForm(state: 'login' | 'signup' | 'recover'): void {
    this.formState = state;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          const toastSuccess = this.toastr.success('Login successful', 'Success');
          toastSuccess.onHidden.subscribe(() => {
            this.router.navigate(['/home']);
          });
        },
        error: (err: any) => {
          console.error('Error in login:', err);
          // Check if status is 401 and error payload indicates "Invalid Credentials"
          if (err.status === 401 ) {
            this.toastr.error('Invalid credentials', 'Error');
          } else {
            // Display a generic error message or a specific one if available
            this.toastr.error(err.error?.message || 'Login failed', 'Error');
          }
        }
      });
    } else {
      this.toastr.error('Login form is invalid.', 'Error');
    }
  }
  
  

  // Handle registration submission.
  onSignUp(): void {
    // Mark all fields as touched so that validation messages are displayed immediately.
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe({
        next: (response: any) => {
          const toastSuccess = this.toastr.success('Registration successful', 'Success');
          toastSuccess.onHidden.subscribe(() => {
            this.switchForm('login');
          });
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message, 'Error');
        }
      });
    } else {
      this.toastr.error('Sign-up form is invalid. Please complete all required fields with valid values.', 'Error');
    }
  }

  // Handle password recovery submission.
  onRecoverPassword(): void {
    if (this.recoveryPasswordForm.valid) {
      this.authService.requestPasswordReset(this.recoveryPasswordForm.value.email).subscribe(
        response => {
          this.modalMessageKey = 'AUTH.RECOVER.SUCCESS_MESSAGE';
          this.modalRef?.openModal();
          this.switchForm('login');
        },
        error => {
          console.error('Password recovery failed', error);
          this.toastr.error('Password recovery failed.', 'Error');
        }
      );
    } else {
      console.error('Recovery form is invalid.');
      this.toastr.error('Recovery form is invalid.', 'Error');
    }
  }
}
