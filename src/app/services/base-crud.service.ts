import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseCrudService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly apiUrl: string;

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(body: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, body);
  }

  update(id: string, body: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
