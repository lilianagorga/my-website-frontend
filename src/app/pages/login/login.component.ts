import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UI_MESSAGES } from '../../constants/messages';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

const STRICT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(STRICT_EMAIL_PATTERN)]],
    password: ['', Validators.required]
  });
  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    const registered = this.route.snapshot.queryParamMap.get('registered');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (registered === '1') {
      this.successMessage.set(UI_MESSAGES.LOGIN_REGISTERED);
    }
    if (email) {
      this.loginForm.patchValue({ email });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.router.navigate([this.authService.isAdmin() ? '/admin' : '/']);
      },
      error: () => {
        this.errorMessage.set(UI_MESSAGES.LOGIN_ERROR);
        this.submitting.set(false);
      }
    });
  }
}
