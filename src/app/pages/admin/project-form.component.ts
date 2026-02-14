import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.project?.title ?? '', Validators.required],
      description: [this.project?.description ?? '', Validators.required],
      techStack: [this.project?.techStack?.join(', ') ?? ''],
      imageUrl: [this.project?.imageUrl ?? ''],
      githubUrl: [this.project?.githubUrl ?? ''],
      demoUrl: [this.project?.demoUrl ?? '']
    });
  }

  get isEditing(): boolean {
    return this.project !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    const payload: Project = {
      ...formValue,
      techStack: formValue.techStack
        ? formValue.techStack.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        : []
    };

    const request = this.isEditing
      ? this.projectService.update(this.project!.id!, payload)
      : this.projectService.create(payload);

    request.subscribe({
      next: () => this.saved.emit(),
      error: () => {
        this.errorMessage = 'Failed to save project. Please try again.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }
}
