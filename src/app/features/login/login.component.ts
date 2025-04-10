import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthGoogleService } from '../../services/auth.google.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    @Inject(AuthGoogleService) private googleAuthService: AuthGoogleService, 
    private toastr: ToastrService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)]],
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      role: this.fb.group({
        name: ['', Validators.required]
      })
    });

    this.recoveryPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const idToken = this.googleAuthService.getIdToken();
    if (idToken) {
      const action = sessionStorage.getItem('googleAuthAction') as 'login' | 'register';
      if (action) {
        sessionStorage.removeItem('googleAuthAction');
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
      this.authService.login(this.loginForm.value).subscribe({
        next:(response: any) => {
          const toastSuccess = this.toastr.success('Login successful', 'Success');
          toastSuccess.onHidden.subscribe(() => {
            this.router.navigate(['/home']);
          });
        },
        error:(err: any) => {
          console.error(err);
          this.toastr.error(err, 'Error');
        }
      });
    } else {
      this.toastr.error('Login form is invalid.', 'Error');
    }
  }

  onSignUp(): void {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe({
        next:(response: any) => {
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
      this.toastr.error('Sign-up form invalid', 'Error');
    }
  }

  onRecoverPassword(): void {
    if (this.recoveryPasswordForm.valid) {
      this.authService.requestPasswordReset(this.recoveryPasswordForm.value.email).subscribe(
        response => {
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