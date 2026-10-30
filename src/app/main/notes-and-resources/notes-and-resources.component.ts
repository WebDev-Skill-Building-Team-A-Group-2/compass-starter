import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { NotesAndResourcesAnimations } from './notes-and-resources.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { ActivatedRoute } from '@angular/router';
import { QuarterlySidebarItemComponent } from './quarterly-goals-sidebar/quarterly-sidebar-item/quarterly-sidebar-item.component';
import { LongTermGoalStore } from '../../core/store/long-term-goal/long-term-goal.store';
import { QuarterlyGoalStore } from '../../core/store/quarterly-goal/quarterly-goal.store';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuarterlyGoalsModalComponent } from '../home/quarterly-goals/quarterly-goals-modal/quarterly-goals-modal.component';
import { FormArray } from '@angular/forms';
import { QuarterlyGoalData } from '../home/home.model';


@Component({
  selector: 'app-notes-and-resources',
  templateUrl: './notes-and-resources.component.html',
  styleUrls: ['./notes-and-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: NotesAndResourcesAnimations,
  standalone: true,
  imports: [
    QuarterlySidebarItemComponent,
    QuarterlyGoalsModalComponent,
  ],
})
/*This class displays a quarterly or long-term goal, by displaying notes and resources based on them.*/
export class NotesAndResourcesComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly longTermGoalStore = inject(LongTermGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  private _snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  // --------------- INPUTS AND OUTPUTS ------------------
  /** 
   * Route parameter value representing what goal we're taking notes on.
   * IMPORTANT: This can be either an id for a long term goal or quarterly goal,
   * which will significantly impact the UI and your queries!
   */
  goalId: Signal<string> = input.required<string>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  private dialogRef!: MatDialogRef<QuarterlyGoalsModalComponent>;

  // --------------- COMPUTED DATA -----------------------
  //entities for longTermGoals and quarterlyGoals.
  longTermGoal = computed(() =>
    this.longTermGoalStore.selectEntity(this.goalId())
  );

  quarterlyGoals = this.quarterlyGoalStore.entities;
  // --------------- EVENT HANDLING ----------------------
  
  //Opening a dialog box when the goal is checked off.
  onGoalToggled(goal: QuarterlyGoalData) {
    goal.completed = !goal.completed;
    this._snackBar.open(
      goal.completed ? 'Marked goal as complete' : 'Marked goal as incomplete',
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      }
    );
  }


  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit() {
    
  }
}
