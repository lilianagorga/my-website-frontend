import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { UI_MESSAGES } from '../../constants/messages';

interface ContactForm {
  name: FormControl<string>;
  email: FormControl<string>;
  message: FormControl<string>;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  contactForm: FormGroup<ContactForm> = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });
  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.messageService.create(this.contactForm.getRawValue()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage.set(UI_MESSAGES.CONTACT_SUCCESS);
        this.contactForm.reset();
        this.submitting.set(false);
      },
      error: () => {
        this.errorMessage.set(UI_MESSAGES.CONTACT_ERROR);
        this.submitting.set(false);
      }
    });
  }
}
