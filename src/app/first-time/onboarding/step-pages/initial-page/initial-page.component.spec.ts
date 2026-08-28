import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InitialPageComponent } from './initial-page.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';

describe('InitialPageComponent', () => {
  let component: InitialPageComponent;
  let fixture: ComponentFixture<InitialPageComponent>;

  const mockUser: User = {
    __id: 'test-user-1',
    name: 'Jennifer Aniston',
    email: 'jennifer@example.com',
    onboardingState: OnboardingState.WELCOME,
  };

  const mockAuthStore = {
    user: signal<User | null>(mockUser),
  };

  beforeEach(async () => {
    mockAuthStore.user.set(mockUser);

    await TestBed.configureTestingModule({
      imports: [InitialPageComponent],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute firstName from user full name', () => {
    expect(component.firstName()).toBe('Jennifer');
  });

  it('should compute firstName from email when name is missing', () => {
    mockAuthStore.user.set({
      __id: 'test-user-2',
      email: 'alex@example.com',
      onboardingState: OnboardingState.WELCOME,
    });
    fixture.detectChanges();

    expect(component.firstName()).toBe('Alex');
  });

  it('should compute empty string when user is null', () => {
    mockAuthStore.user.set(null);
    fixture.detectChanges();

    expect(component.firstName()).toBe('');
  });

  it('should display Welcome greeting with first name in template', () => {
    const titleEl = fixture.debugElement.query(By.css('.welcome-title')).nativeElement;
    expect(titleEl.textContent.trim()).toBe('Welcome, Jennifer.');
  });

  it('should emit next output when clicking Next button', () => {
    let emitted = false;
    component.next.subscribe(() => {
      emitted = true;
    });

    const nextBtn = fixture.debugElement.query(By.css('.btn-step-next')).nativeElement;
    nextBtn.click();

    expect(emitted).toBeTrue();
  });
});
