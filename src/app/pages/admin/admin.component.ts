import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../services/project.service';
import { MessageService } from '../../services/message.service';
import { Project } from '../../models/project.model';
import { Message } from '../../models/message.model';
import { ProjectFormComponent } from './project-form.component';
import { UI_MESSAGES } from '../../constants/messages';

@Component({
  selector: 'app-admin',
  imports: [ProjectFormComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  activeTab = signal<'projects' | 'messages'>('projects');
  projects = signal<Project[]>([]);
  messages = signal<Message[]>([]);
  showProjectForm = signal(false);
  editingProject = signal<Project | null>(null);

  ngOnInit(): void {
    this.loadProjects();
    this.loadMessages();
  }

  switchTab(tab: 'projects' | 'messages'): void {
    this.activeTab.set(tab);
  }

  loadProjects(): void {
    this.projectService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.projects.set(data),
      error: () => this.projects.set([])
    });
  }

  loadMessages(): void {
    this.messageService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.messages.set(data),
      error: () => this.messages.set([])
    });
  }

  openAddProject(): void {
    this.editingProject.set(null);
    this.showProjectForm.set(true);
  }

  openEditProject(project: Project): void {
    this.editingProject.set(project);
    this.showProjectForm.set(true);
  }

  closeProjectForm(): void {
    this.showProjectForm.set(false);
    this.editingProject.set(null);
  }

  onProjectSaved(): void {
    this.closeProjectForm();
    this.loadProjects();
  }

  deleteProject(project: Project): void {
    if (confirm(UI_MESSAGES.ADMIN_CONFIRM_DELETE_PROJECT(project.title))) {
      this.projectService.delete(project.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadProjects());
    }
  }

  deleteMessage(message: Message): void {
    if (confirm(UI_MESSAGES.ADMIN_CONFIRM_DELETE_MESSAGE)) {
      this.messageService.delete(message.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadMessages());
    }
  }
}
