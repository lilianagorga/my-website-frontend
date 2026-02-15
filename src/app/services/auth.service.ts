import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          return;
        }
        localStorage.removeItem(this.tokenKey);
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }

  private getUserRoles(): string[] {
    const payload = this.getTokenPayload();
    if (!payload) {
      return [];
    }

    const authoritiesClaim = payload['authorities'];
    const rolesClaim = payload['roles'];

    const roles = Array.isArray(authoritiesClaim)
      ? authoritiesClaim
      : Array.isArray(rolesClaim)
        ? rolesClaim
        : [];

    return roles
      .filter((role): role is string => typeof role === 'string')
      .map(role => role.replace(/^ROLE_/, '').toUpperCase());
  }

  private getTokenPayload(): Record<string, unknown> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    try {
      const normalizedPayload = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const paddedPayload = normalizedPayload + '='.repeat((4 - normalizedPayload.length % 4) % 4);
      return JSON.parse(atob(paddedPayload));
    } catch {
      return null;
    }
  }
}
