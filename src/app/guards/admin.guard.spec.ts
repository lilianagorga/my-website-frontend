import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('adminGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...args) =>
    TestBed.runInInjectionContext(() => adminGuard(...args));

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should redirect to /login and return false when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to / and return false when user is logged in but not admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return true and not redirect when user is logged in and is admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(true);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
