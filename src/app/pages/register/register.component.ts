import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';

interface BackendValidationError {
  message?: string;
  details?: Record<string, string>;
}

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: RegisterRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(payload).subscribe({
      next: response => {
        if (response.message === 'User registered successfully.') {
          this.successMessage = 'Registrazione completata. Ora puoi accedere.';
          this.router.navigate(['/login'], {
            queryParams: { registered: '1', email: payload.email }
          });
          return;
        }

        this.errorMessage = response.message || 'Registrazione non riuscita.';
        this.submitting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.extractErrorMessage(error);
        this.submitting = false;
      }
    });
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const payload = error.error as BackendValidationError | undefined;
    if (payload?.details) {
      const firstValidationError = Object.values(payload.details)[0];
      if (firstValidationError) {
        return firstValidationError;
      }
    }
    if (payload?.message) {
      return payload.message;
    }
    return 'Qualcosa è andato storto. Riprova più tardi.';
  }
}
