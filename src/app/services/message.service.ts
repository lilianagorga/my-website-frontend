import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends BaseCrudService<Message> {
  protected readonly apiUrl = `${environment.apiUrl}/messages`;
}
