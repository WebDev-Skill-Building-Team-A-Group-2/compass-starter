import { Component, ChangeDetectionStrategy, inject, Signal, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingAnimations } from './onboarding.animations';
import { OnboardingState, ONBOARDING_SEQUENCE, ONBOARDING_STEP_INDEX } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { OnboardLongTermGoalsComponent, LongTermGoalsFormData } from './step-pages/onboard-long-term-goals/onboard-long-term-goals.component';
import { OnboardLongTermTransitionComponent } from './step-pages/onboard-long-term-transition/onboard-long-term-transition.component';
import { OnboardQuarterlyGoalsComponent } from './step-pages/onboard-quarterly-goals/onboard-quarterly-goals.component';
import { OrganizeQuarterlyGoalsComponent } from './step-pages/organize-quarterly-goals/organize-quarterly-goals.component';
import { OnboardWeeklyGoalsComponent } from './step-pages/onboard-weekly-goals/onboard-weekly-goals.component';
import { FinalPageComponent } from './step-pages/final-page/final-page.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: OnboardingAnimations,
  imports: [
    ProgressBarComponent,
    OnboardLongTermGoalsComponent,
    OnboardLongTermTransitionComponent,
    OnboardQuarterlyGoalsComponent,
    OrganizeQuarterlyGoalsComponent,
    OnboardWeeklyGoalsComponent,
    FinalPageComponent,
  ],
})
export class OnboardingComponent {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly batch = inject(BATCH_WRITE_SERVICE);
  private readonly db = inject(DATABASE_SERVICE);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  /** Expose OnboardingState enum for template switch-case matching. */
  readonly OnboardingState = OnboardingState;

  /** Loading state during asynchronous operations. */
  readonly loading = signal<boolean>(false);

  /** Long-term goals data for Step 1. */
  readonly longTermGoals = signal<LongTermGoalsFormData>({
    oneYear: '',
    fiveYear: '',
  });

  // --------------- COMPUTED DATA -----------------------

  /** Active milestone index (0-4) mapped from current user onboarding state. */
  readonly currentStepIndex: Signal<number> = computed(() => {
    const state = this.authStore.user()?.onboardingState;
    return (state && ONBOARDING_STEP_INDEX[state]) ?? 0;
  });

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles the submission of long-term goals and advances to Step 2 transition.
   * @param {LongTermGoalsFormData} goals - The 1-year and 5-year goal values.
   * @returns {Promise<void>}
   */
  async onLongTermGoalsNext(goals: LongTermGoalsFormData): Promise<void> {
    this.longTermGoals.set(goals);
    const user = this.authStore.user();
    if (!user?.__id) {
      console.error('No authenticated user found while saving long-term goals.');
      return;
    }
    const userId = user.__id;

    try {
      await this.batch.batchWrite(
        async ({ batch }) => {
          const ltgId = this.db.createId();
          await this.db.addEntity('longTermGoals', {
            __id: ltgId,
            __userId: userId,
            oneYear: goals.oneYear,
            fiveYear: goals.fiveYear,
          }, batch);

          await this.db.updateEntity('users', userId, {
            onboardingState: OnboardingState.STEP_2,
          }, batch);
        },
        {
          loading: this.loading,
          snackBarConfig: {
            successMessage: 'Long-term goals saved successfully!',
            failureMessage: 'Failed to save goals. Please try again.',
          },
        },
      );
    } catch (err) {
      console.error('Failed to save long-term goals:', err);
    }
  }

  /**
   * Handles back navigation to the previous onboarding step or the landing page.
   * @returns {Promise<void>}
   */
  async onPreviousStep(): Promise<void> {
    const user = this.authStore.user();
    const state = user?.onboardingState;
    const currentIndex = state ? ONBOARDING_SEQUENCE.indexOf(state) : -1;

    if (user && currentIndex > 0) {
      const prevState = ONBOARDING_SEQUENCE[currentIndex - 1];
      await this.db.updateEntity('users', user.__id, {
        onboardingState: prevState,
      });
    } else {
      this.router.navigate(['/landing']);
    }
  }

  // --------------- OTHER -------------------------------

  // --------------- LOAD AND CLEANUP --------------------
}
