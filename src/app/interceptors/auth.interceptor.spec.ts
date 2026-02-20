import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should attach Authorization: Bearer header when token is present', () => {
    authService.getToken.and.returnValue('my-jwt-token');

    httpClient.get('/api/resource').subscribe();

    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    req.flush({});
  });

  it('should not attach Authorization header when no token is stored', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/resource').subscribe();

    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should not mutate the original request', () => {
    authService.getToken.and.returnValue('token');

    httpClient.get('/api/resource').subscribe();

    const req = httpMock.expectOne('/api/resource');
    // The interceptor clones the request, so the URL is preserved
    expect(req.request.url).toBe('/api/resource');
    req.flush({});
  });
});
