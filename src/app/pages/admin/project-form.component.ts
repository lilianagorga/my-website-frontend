import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { UI_MESSAGES } from '../../constants/messages';

interface ProjectForm {
  title: FormControl<string>;
  description: FormControl<string>;
  techStack: FormControl<string>;
  imageUrl: FormControl<string>;
  githubUrl: FormControl<string>;
  demoUrl: FormControl<string>;
}

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() project: Project | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup<ProjectForm>;
  submitting = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const urlPattern = /^https?:\/\/.*/;

    this.form = this.fb.nonNullable.group({
      title: [this.project?.title ?? '', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      description: [this.project?.description ?? '', [
        Validators.required,
        Validators.maxLength(500)
      ]],
      techStack: [this.project?.techStack?.join(', ') ?? ''],
      imageUrl: [this.project?.imageUrl ?? '', [
        Validators.required,
        Validators.pattern(urlPattern)
      ]],
      githubUrl: [this.project?.githubUrl ?? '', [
        Validators.required,
        Validators.pattern(urlPattern)
      ]],
      demoUrl: [this.project?.demoUrl ?? '', [
        Validators.required,
        Validators.pattern(urlPattern)
      ]]
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

    this.submitting.set(true);
    this.errorMessage.set('');

    const formValue = this.form.getRawValue();
    const payload: Project = {
      ...formValue,
      techStack: formValue.techStack
        ? formValue.techStack.split(',').map(t => t.trim()).filter(t => t)
        : []
    };

    const request = this.isEditing
      ? this.projectService.update(this.project!.id!, payload)
      : this.projectService.create(payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.saved.emit(),
      error: () => {
        this.errorMessage.set(UI_MESSAGES.PROJECT_SAVE_ERROR);
        this.submitting.set(false);
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
