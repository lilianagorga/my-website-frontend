import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { UI_MESSAGES } from '../../constants/messages';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── form validation ──────────────────────────────────────────────────────

  describe('form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should report passwordMismatch error when passwords do not match', () => {
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'secret123',
        confirmPassword: 'different1'
      });
      expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
    });

    it('should have no errors when passwords match and all fields are valid', () => {
      component.registerForm.setValue({
        username: 'alice',
        email: 'alice@example.com',
        password: 'secret123',
        confirmPassword: 'secret123'
      });
      expect(component.registerForm.valid).toBeTrue();
      expect(component.registerForm.errors).toBeNull();
    });

    it('should mark username invalid when shorter than 3 characters', () => {
      component.registerForm.patchValue({ username: 'ab' });
      expect(component.registerForm.get('username')?.valid).toBeFalse();
    });

    it('should mark password invalid when shorter than 8 characters', () => {
      component.registerForm.patchValue({ password: 'short' });
      expect(component.registerForm.get('password')?.valid).toBeFalse();
    });

    it('should mark email invalid when format is wrong', () => {
      component.registerForm.patchValue({ email: 'not-an-email' });
      expect(component.registerForm.get('email')?.valid).toBeFalse();
    });
  });

  // ── onSubmit ─────────────────────────────────────────────────────────────

  describe('onSubmit', () => {
    const validForm = {
      username: 'alice',
      email: 'alice@example.com',
      password: 'secret123',
      confirmPassword: 'secret123'
    };

    it('should not call authService.register when form is invalid', () => {
      component.onSubmit();
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should navigate to /login with query params on successful registration', () => {
      authService.register.and.returnValue(of({ message: 'User registered successfully.' }));
      component.registerForm.setValue(validForm);

      component.onSubmit();

      expect(component.successMessage()).toBe(UI_MESSAGES.REGISTER_SUCCESS);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { registered: '1', email: 'alice@example.com' } }
      );
    });

    it('should set errorMessage from backend validation details on 400', () => {
      const error = new HttpErrorResponse({
        error: { details: { email: 'Email già registrata.' } },
        status: 400
      });
      authService.register.and.returnValue(throwError(() => error));
      component.registerForm.setValue(validForm);

      component.onSubmit();

      expect(component.errorMessage()).toBe('Email già registrata.');
      expect(component.submitting()).toBeFalse();
    });

    it('should set errorMessage from backend message on generic error', () => {
      const error = new HttpErrorResponse({
        error: { message: 'Username già in uso.' },
        status: 409
      });
      authService.register.and.returnValue(throwError(() => error));
      component.registerForm.setValue(validForm);

      component.onSubmit();

      expect(component.errorMessage()).toBe('Username già in uso.');
    });

    it('should fall back to generic errorMessage when no backend details', () => {
      const error = new HttpErrorResponse({ status: 500 });
      authService.register.and.returnValue(throwError(() => error));
      component.registerForm.setValue(validForm);

      component.onSubmit();

      expect(component.errorMessage()).toBe(UI_MESSAGES.REGISTER_ERROR);
    });

    it('should set fallback message when backend returns an unexpected success response', () => {
      authService.register.and.returnValue(of({ message: 'Something unexpected.' }));
      component.registerForm.setValue(validForm);

      component.onSubmit();

      expect(component.errorMessage()).toBe('Something unexpected.');
      expect(component.submitting()).toBeFalse();
    });
  });
});
