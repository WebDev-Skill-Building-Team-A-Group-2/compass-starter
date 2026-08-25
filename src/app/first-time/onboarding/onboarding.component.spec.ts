import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthStore: any;
  let mockBatchService: any;
  let mockDbService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthStore = {
      user: signal({ __id: 'test-user-123', email: 'test@example.com' }),
    };
    mockBatchService = {
      batchWrite: jasmine.createSpy('batchWrite').and.resolveTo(),
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

  it('should update local longTermGoals and invoke batchWrite on onLongTermGoalsNext', async () => {
    await component.onLongTermGoalsNext({
      oneYear: 'Land Internship',
      fiveYear: 'Lead Tech Projects',
    });

    expect(component.longTermGoals().oneYear).toBe('Land Internship');
    expect(component.longTermGoals().fiveYear).toBe('Lead Tech Projects');
    expect(mockBatchService.batchWrite).toHaveBeenCalled();
  });

  it('should navigate to landing on previous step', () => {
    component.onPreviousStep();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/landing']);
  });
});
