import { Component, ChangeDetectionStrategy, input, output, Signal, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OnboardLongTermGoalsAnimations } from './onboard-long-term-goals.animations';

/** Initial values and return data for the long-term goals step. */
export interface LongTermGoalsFormData {
  oneYear: string;
  fiveYear: string;
}

@Component({
  selector: 'app-onboard-long-term-goals',
  templateUrl: './onboard-long-term-goals.component.html',
  styleUrls: ['./onboard-long-term-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: OnboardLongTermGoalsAnimations,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
  ],
})
export class OnboardLongTermGoalsComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Optional initial values passed from parent container. */
  readonly initialValues = input<LongTermGoalsFormData | null>(null);

  /** Emits when user submits valid goals. */
  readonly next = output<LongTermGoalsFormData>();

  /** Emits when user clicks Back. */
  readonly back = output<void>();

  // --------------- LOCAL UI STATE ----------------------

  /** 1-Year goal input value. */
  readonly oneYear = signal<string>('');

  /** 5-Year goal input value. */
  readonly fiveYear = signal<string>('');

  // --------------- COMPUTED DATA -----------------------

  /**
   * Computed boolean indicating whether both goal inputs are non-empty.
   * @returns {boolean} True if both inputs have valid non-whitespace text.
   */
  readonly isValid: Signal<boolean> = computed(() => {
    return this.oneYear().trim().length > 0 && this.fiveYear().trim().length > 0;
  });

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles advancing to the next step by emitting trimmed form data.
   */
  onNext(): void {
    if (this.isValid()) {
      this.next.emit({
        oneYear: this.oneYear().trim(),
        fiveYear: this.fiveYear().trim(),
      });
    }
  }

  /**
   * Handles clicking the Back button.
   */
  onBack(): void {
    this.back.emit();
  }

  // --------------- OTHER -------------------------------

  constructor() {
    effect(() => {
      const initial = this.initialValues();
      if (initial) {
        if (initial.oneYear) this.oneYear.set(initial.oneYear);
        if (initial.fiveYear) this.fiveYear.set(initial.fiveYear);
      }
    });
  }

  // --------------- LOAD AND CLEANUP --------------------
}
