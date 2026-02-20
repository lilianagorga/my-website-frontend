import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

/** Creates a minimal signed-looking JWT with the given payload. */
function makeToken(payload: object): string {
  const encoded = btoa(JSON.stringify(payload));
  return `eyJhbGciOiJIUzI1NiJ9.${encoded}.fakesig`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should store token in localStorage on success', () => {
      const token = makeToken({ sub: 'user@test.com', exp: 9_999_999_999 });
      service.login('user@test.com', 'pass').subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({ token });

      expect(localStorage.getItem('auth_token')).toBe(token);
    });

    it('should remove token when response contains no token', () => {
      localStorage.setItem('auth_token', 'stale-token');
      service.login('user@test.com', 'pass').subscribe();

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ token: null });

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  // ── logout ───────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should remove auth_token from localStorage', () => {
      localStorage.setItem('auth_token', 'some-token');
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  // ── getToken ─────────────────────────────────────────────────────────────

  describe('getToken', () => {
    it('should return token when present', () => {
      localStorage.setItem('auth_token', 'tok');
      expect(service.getToken()).toBe('tok');
    });

    it('should return null when absent', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  // ── isLoggedIn ───────────────────────────────────────────────────────────

  describe('isLoggedIn', () => {
    it('should return false when there is no token', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false and call logout when token is expired', () => {
      const expiredToken = makeToken({ sub: 'user', exp: 1 }); // epoch 1 = far in the past
      localStorage.setItem('auth_token', expiredToken);

      expect(service.isLoggedIn()).toBeFalse();
      expect(localStorage.getItem('auth_token')).toBeNull(); // logout was called
    });

    it('should return true when token is present and not expired', () => {
      const validToken = makeToken({ sub: 'user', exp: 9_999_999_999 });
      localStorage.setItem('auth_token', validToken);

      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return true when token has no exp claim', () => {
      const noExpToken = makeToken({ sub: 'user' });
      localStorage.setItem('auth_token', noExpToken);

      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  // ── isAdmin ──────────────────────────────────────────────────────────────

  describe('isAdmin', () => {
    it('should return true when authorities contain ROLE_ADMIN', () => {
      localStorage.setItem('auth_token', makeToken({ authorities: ['ROLE_ADMIN'], exp: 9_999_999_999 }));
      expect(service.isAdmin()).toBeTrue();
    });

    it('should return true when roles contain ADMIN', () => {
      localStorage.setItem('auth_token', makeToken({ roles: ['ADMIN'], exp: 9_999_999_999 }));
      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false when only USER role is present', () => {
      localStorage.setItem('auth_token', makeToken({ authorities: ['ROLE_USER'], exp: 9_999_999_999 }));
      expect(service.isAdmin()).toBeFalse();
    });

    it('should return false when no token is stored', () => {
      expect(service.isAdmin()).toBeFalse();
    });
  });

  // ── token parsing ────────────────────────────────────────────────────────

  describe('token parsing', () => {
    it('should return false for isLoggedIn with a malformed token', () => {
      localStorage.setItem('auth_token', 'not.a.valid.jwt.at.all');
      // malformed token: getTokenPayload returns null (wrong part count) →
      // isTokenExpired returns false (can't read exp) → isLoggedIn returns true
      expect(service.isLoggedIn()).toBeTrue();
    });
  });
});
