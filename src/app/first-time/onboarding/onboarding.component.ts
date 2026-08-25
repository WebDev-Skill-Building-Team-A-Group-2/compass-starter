import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OnboardingAnimations } from './onboarding.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { DATABASE_SERVICE, DatabaseService } from 'src/app/core/firebase/database.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OnboardLongTermGoalsComponent, LongTermGoalsFormData } from './step-pages/onboard-long-term-goals/onboard-long-term-goals.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: OnboardingAnimations,
  imports: [
    CommonModule,
    ProgressBarComponent,
    OnboardLongTermGoalsComponent,
  ],
})
export class OnboardingComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently signed in user. */
  readonly currentUser: Signal<User> = this.authStore.user;
  
  // --------------- LOCAL UI STATE ----------------------

  /** Loading state during asynchronous operations. */
  readonly loading = signal<boolean>(false);

  /** Long-term goals data for Step 1. */
  readonly longTermGoals = signal<LongTermGoalsFormData>({
    oneYear: '',
    fiveYear: '',
  });

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles the submission of long-term goals from the presenter card.
   * @param goals The 1-year and 5-year goal values.
   */
  async onLongTermGoalsNext(goals: LongTermGoalsFormData): Promise<void> {
    this.longTermGoals.set(goals);
    const user = this.currentUser();
    const userId = user?.__id || 'demo-user';

    try {
      await this.batch.batchWrite(
        async ({ batch }) => {
          const ltgId = this.db.createId();
          await this.db.addEntity('longTermGoals', {
            __id: ltgId,
            __userId: userId,
            oneYear: goals.oneYear,
            fiveYear: goals.fiveYear,
          }, batch as any);
        },
        {
          loading: this.loading,
          snackBarConfig: {
            successMessage: 'Long-term goals saved successfully!',
            failureMessage: 'Failed to save goals. Please try again.',
          },
        }
      );
    } catch (err) {
      console.error('Failed to save long-term goals:', err);
    }
  }

  /**
   * Handles back navigation (e.g. from top bar back button or card back button).
   */
  onPreviousStep(): void {
    this.router.navigate(['/landing']);
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
    @Inject(DATABASE_SERVICE) private db: DatabaseService,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
