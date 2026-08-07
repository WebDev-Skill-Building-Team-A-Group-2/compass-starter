import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { LongTermGoalsAnimations } from './long-term-goals.animations';
import { LongTermGoalsItemComponent } from './long-term-goals-item/long-term-goals-item.component';import { LongTermGoalData } from '../home.model';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-long-term-goals',
  templateUrl: './long-term-goals.component.html',
  styleUrls: ['./long-term-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsAnimations,
  standalone: true,
  imports: [LongTermGoalsItemComponent],
})
export class LongTermGoalsComponent implements OnInit {
  longTermGoals: LongTermGoal[] = [
    {
      __id: 'example-id',
      __userId: 'example-user-id',
      oneYear: 'Secure SWE or UX Engineering Internship',
      fiveYear: 'Working as a SWE in a team I love with some UX/Design oriented work'
    }
    ];
  // --------------- INPUTS AND OUTPUTS ------------------
  goal = this.longTermGoals[0];
  
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
