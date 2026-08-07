import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { LongTermGoalsItemAnimations } from './long-term-goals-item.animations';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { LongTermGoal } from '../../../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-long-term-goals-item',
  templateUrl: './long-term-goals-item.component.html',
  styleUrls: ['./long-term-goals-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsItemAnimations,
  standalone: true,
  imports: [
  ],
})
export class LongTermGoalsItemComponent implements OnInit {
  goal = input<LongTermGoal>();

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
