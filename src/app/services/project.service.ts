import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseCrudService<Project> {
  protected readonly apiUrl = `${environment.apiUrl}/projects`;
}
