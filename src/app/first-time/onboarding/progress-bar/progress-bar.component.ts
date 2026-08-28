import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ProgressBarAnimations } from './progress-bar.animations';

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
  imports: [],
})
export class ProgressBarComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently active step index (0-indexed). */
  readonly currentStep = input<number>(0);

  /** Emitted when the top-left back button is clicked. */
  readonly navigateBack = output<void>();

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
