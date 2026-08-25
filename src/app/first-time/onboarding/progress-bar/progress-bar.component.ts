import { Component, ChangeDetectionStrategy, input, output, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarAnimations } from './progress-bar.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';

/** Step definition for progress bar stepper. */
export interface StepItem {
  label: string;
  index: number;
}

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ProgressBarAnimations,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ProgressBarComponent {
  readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently active step index (0-indexed). */
  readonly currentStep = input<number>(0);

  /** Emitted when the top-left back button is clicked. */
  readonly navigateBack = output<void>();

  /** The current signed in user. */
  readonly currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** 5 primary wizard milestones. */
  readonly steps: StepItem[] = [
    { label: 'LONG TERM GOALS', index: 0 },
    { label: 'QUARTER GOALS', index: 1 },
    { label: 'ORGANIZE', index: 2 },
    { label: 'WEEKLY GOALS', index: 3 },
    { label: 'ORGANIZE', index: 4 },
  ];

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles clicking the top-left back button and emits navigation event.
   */
  onBackClick(): void {
    this.navigateBack.emit();
  }

  // --------------- OTHER -------------------------------

  // --------------- LOAD AND CLEANUP --------------------
}
