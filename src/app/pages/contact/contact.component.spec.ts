import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { MessageService } from '../../services/message.service';
import { UI_MESSAGES } from '../../constants/messages';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    messageService = jasmine.createSpyObj('MessageService', ['create']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: MessageService, useValue: messageService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── form validation ──────────────────────────────────────────────────────

  describe('form validation', () => {
    it('should be invalid when all fields are empty', () => {
      expect(component.contactForm.valid).toBeFalse();
    });

    it('should be invalid with a malformed email', () => {
      component.contactForm.setValue({ name: 'Alice', email: 'not-an-email', message: 'Hi' });
      expect(component.contactForm.get('email')?.valid).toBeFalse();
    });

    it('should be valid when all fields are correctly filled', () => {
      component.contactForm.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });
      expect(component.contactForm.valid).toBeTrue();
    });
  });

  // ── onSubmit ─────────────────────────────────────────────────────────────

  describe('onSubmit', () => {
    it('should not call MessageService when the form is invalid', () => {
      component.onSubmit();
      expect(messageService.create).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting an invalid form', () => {
      component.onSubmit();
      expect(component.contactForm.get('name')?.touched).toBeTrue();
    });

    it('should set successMessage and reset the form on success', () => {
      messageService.create.and.returnValue(of({} as any));
      component.contactForm.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });

      component.onSubmit();

      expect(component.successMessage()).toBe(UI_MESSAGES.CONTACT_SUCCESS);
      expect(component.submitting()).toBeFalse();
      expect(component.contactForm.value).toEqual({ name: '', email: '', message: '' });
    });

    it('should set errorMessage and clear submitting flag on error', () => {
      messageService.create.and.returnValue(throwError(() => new Error('Network error')));
      component.contactForm.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });

      component.onSubmit();

      expect(component.errorMessage()).toBe(UI_MESSAGES.CONTACT_ERROR);
      expect(component.submitting()).toBeFalse();
    });

    it('should clear previous messages before each submission', () => {
      messageService.create.and.returnValue(of({} as any));
      component.contactForm.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });
      component.errorMessage.set('old error');
      component.successMessage.set('old success');

      component.onSubmit();

      // After success the successMessage is set and errorMessage stays empty
      expect(component.errorMessage()).toBe('');
    });
  });
});
