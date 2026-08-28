import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { Router } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OnboardingState, User } from 'src/app/core/store/user/user.model';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthStore: { user: WritableSignal<User | null> };
  let mockBatchService: any;
  let mockDbService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthStore = {
      user: signal<User | null>({
        __id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        onboardingState: OnboardingState.STEP_1,
      }),
    };
    mockBatchService = {
      batchWrite: jasmine.createSpy('batchWrite').and.callFake(async (fn: any) => {
        const mockBatch = {};
        await fn({ batch: mockBatch });
      }),
    };
    mockDbService = {
      createId: jasmine.createSpy('createId').and.returnValue('mock-goal-id'),
      addEntity: jasmine.createSpy('addEntity').and.resolveTo(),
      updateEntity: jasmine.createSpy('updateEntity').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [
        OnboardingComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
        { provide: BATCH_WRITE_SERVICE, useValue: mockBatchService },
        { provide: DATABASE_SERVICE, useValue: mockDbService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update local longTermGoals, save goals, and advance user state on onLongTermGoalsNext', async () => {
    await component.onLongTermGoalsNext({
      oneYear: 'Land Internship',
      fiveYear: 'Lead Tech Projects',
    });

    expect(component.longTermGoals().oneYear).toBe('Land Internship');
    expect(component.longTermGoals().fiveYear).toBe('Lead Tech Projects');
    expect(mockBatchService.batchWrite).toHaveBeenCalled();
    expect(mockDbService.addEntity).toHaveBeenCalledWith(
      'longTermGoals',
      jasmine.objectContaining({
        __id: 'mock-goal-id',
        __userId: 'test-user-123',
        oneYear: 'Land Internship',
        fiveYear: 'Lead Tech Projects',
      }),
      jasmine.anything(),
    );
    expect(mockDbService.updateEntity).toHaveBeenCalledWith(
      'users',
      'test-user-123',
      { onboardingState: OnboardingState.STEP_2 },
      jasmine.anything(),
    );
  });

  it('should not save goals or advance state when user is null', async () => {
    mockAuthStore.user.set(null);
    mockBatchService.batchWrite.calls.reset();

    await component.onLongTermGoalsNext({
      oneYear: 'Land Internship',
      fiveYear: 'Lead Tech Projects',
    });

    expect(mockBatchService.batchWrite).not.toHaveBeenCalled();
  });

  it('should navigate to landing when onPreviousStep is called from STEP_1', async () => {
    mockAuthStore.user.set({
      __id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      onboardingState: OnboardingState.STEP_1,
    });

    await component.onPreviousStep();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/landing']);
  });
});
