import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';
import { UI_MESSAGES } from '../../constants/messages';

interface BackendValidationError {
  message?: string;
  details?: Record<string, string>;
}

interface RegisterForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

const STRICT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  registerForm: FormGroup<RegisterForm> = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(STRICT_EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });
  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const { username, email, password } = this.registerForm.getRawValue();
    const payload: RegisterRequest = { username, email, password };

    this.authService.register(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => {
        if (response.message === 'User registered successfully.') {
          this.successMessage.set(UI_MESSAGES.REGISTER_SUCCESS);
          this.router.navigate(['/login'], {
            queryParams: { registered: '1', email: payload.email }
          });
          return;
        }

        this.errorMessage.set(response.message || UI_MESSAGES.REGISTER_FAILED);
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.extractErrorMessage(error));
        this.submitting.set(false);
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
    return UI_MESSAGES.REGISTER_ERROR;
  }
}
