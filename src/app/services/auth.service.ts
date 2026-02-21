import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private tokenFingerprintKey = 'auth_token_fp';

  login(email: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.tokenFingerprintKey, this.fingerprint(response.token));
          return;
        }
        this.clearTokenData();
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  logout(): void {
    this.clearTokenData();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    if (!this.isTokenIntact(token)) {
      this.clearTokenData();
      return false;
    }

    const payload = this.getTokenPayload();
    if (!payload) {
      this.clearTokenData();
      return false;
    }

    if (this.isTokenExpired(payload)) {
      this.clearTokenData();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }

  private isTokenIntact(token: string): boolean {
    const storedFp = localStorage.getItem(this.tokenFingerprintKey);
    if (!storedFp) {
      return true;
    }
    return this.fingerprint(token) === storedFp;
  }

  private fingerprint(value: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
  }

  private isTokenExpired(payload: Record<string, unknown>): boolean {
    const exp = payload['exp'];
    if (typeof exp !== 'number') {
      return false;
    }
    return exp * 1000 < Date.now();
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

  private clearTokenData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenFingerprintKey);
  }
}
