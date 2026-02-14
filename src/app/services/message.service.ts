import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  create(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
