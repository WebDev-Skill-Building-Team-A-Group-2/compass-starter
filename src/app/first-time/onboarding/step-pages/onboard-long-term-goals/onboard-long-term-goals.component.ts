import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, effect, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OnboardLongTermGoalsAnimations } from './onboard-long-term-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';

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
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class OnboardLongTermGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** Optional initial values passed from parent container. */
  readonly initialValues = input<LongTermGoalsFormData | null>(null);

  /** Emits when user submits valid goals. */
  readonly next = output<LongTermGoalsFormData>();

  /** Emits when user clicks Back. */
  readonly back = output<void>();

  /** The current signed in user. */
  readonly currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** 1-Year goal input value. */
  readonly oneYear = signal<string>('');

  /** 5-Year goal input value. */
  readonly fiveYear = signal<string>('');

  /** Loading indicator. */
  readonly loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  /** Whether both goals satisfy the minimum length requirement. */
  readonly isValid: Signal<boolean> = computed(() => {
    return this.oneYear().trim().length > 0 && this.fiveYear().trim().length > 0;
  });

  // --------------- EVENT HANDLING ----------------------

  /** Handles advancing to the next step. */
  onNext(): void {
    if (this.isValid()) {
      this.next.emit({
        oneYear: this.oneYear().trim(),
        fiveYear: this.fiveYear().trim(),
      });
    }
  }

  /** Handles clicking the Back button. */
  onBack(): void {
    this.back.emit();
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
    effect(() => {
      const initial = this.initialValues();
      if (initial) {
        if (initial.oneYear) this.oneYear.set(initial.oneYear);
        if (initial.fiveYear) this.fiveYear.set(initial.fiveYear);
      }
    });
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
