import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { MessageService } from '../../services/message.service';
import { Project } from '../../models/project.model';
import { Message } from '../../models/message.model';
import { ProjectFormComponent } from './project-form.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ProjectFormComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  activeTab: 'projects' | 'messages' = 'projects';
  projects: Project[] = [];
  messages: Message[] = [];
  showProjectForm = false;
  editingProject: Project | null = null;

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadMessages();
  }

  switchTab(tab: 'projects' | 'messages'): void {
    this.activeTab = tab;
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => this.projects = data,
      error: () => this.projects = []
    });
  }

  loadMessages(): void {
    this.messageService.getAll().subscribe({
      next: (data) => this.messages = data,
      error: () => this.messages = []
    });
  }

  openAddProject(): void {
    this.editingProject = null;
    this.showProjectForm = true;
  }

  openEditProject(project: Project): void {
    this.editingProject = project;
    this.showProjectForm = true;
  }

  closeProjectForm(): void {
    this.showProjectForm = false;
    this.editingProject = null;
  }

  onProjectSaved(): void {
    this.closeProjectForm();
    this.loadProjects();
  }

  deleteProject(project: Project): void {
    if (confirm(`Eliminare il progetto "${project.title}"?`)) {
      this.projectService.delete(project.id!).subscribe(() => this.loadProjects());
    }
  }

  deleteMessage(message: Message): void {
    if (confirm('Eliminare questo messaggio?')) {
      this.messageService.delete(message.id!).subscribe(() => this.loadMessages());
    }
  }
}
