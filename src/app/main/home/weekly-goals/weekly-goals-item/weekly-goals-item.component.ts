import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsItemAnimations } from './weekly-goals-item.animations';
import { MatCheckbox } from '@angular/material/checkbox';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { Hashtag } from 'src/app/core/store/hashtag/hashtag.model';
import { HashtagStore } from 'src/app/core/store/hashtag/hashtag.store';
import { NgStyle } from '@angular/common';
import { WeeklyGoalData } from '../../home.model';

@Component({
  selector: 'app-weekly-goals-item',
  templateUrl: './weekly-goals-item.component.html',
  styleUrls: ['./weekly-goals-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsItemAnimations,
  standalone: true,
  imports: [
    MatCheckbox,
    NgStyle
  ],
})
export class WeeklyGoalsItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  goal = input.required<WeeklyGoalData>();
  checked = output<WeeklyGoalData>();
  
  currentUser: Signal<User> = this.authStore.user;


  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  
  checkGoal(): void{
    const g = this.goal();
    g.completed = !g.completed;
    this.checked.emit(g);
   }
    
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
