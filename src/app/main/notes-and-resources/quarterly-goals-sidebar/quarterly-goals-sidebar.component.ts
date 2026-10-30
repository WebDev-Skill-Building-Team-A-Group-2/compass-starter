import { Component,
         OnInit,
         ChangeDetectionStrategy,
         input,
         output,
         inject,
         WritableSignal,
         Signal,
         signal,
         computed,
         Inject,
         Injector } from '@angular/core';
import { QuarterlyGoalsSidebarAnimations } from './quarterly-goals-sidebar.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService,
         BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlySidebarItemComponent } from './quarterly-sidebar-item/quarterly-sidebar-item.component';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog,
         MatDialogRef } from '@angular/material/dialog';
import { QuarterlyGoalsModalComponent } from '../../home/quarterly-goals/quarterly-goals-modal/quarterly-goals-modal.component';
import { QuarterlyGoalData } from '../../home/home.model';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-quarterly-goals-sidebar',
  templateUrl: './quarterly-goals-sidebar.component.html',
  styleUrls: ['./quarterly-goals-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsSidebarAnimations,
  standalone: true,
  imports: [
    QuarterlySidebarItemComponent,
    QuarterlyGoalsModalComponent
  ],
})
export class QuarterlyGoalsSidebarComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  private _snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog)
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  private dialogRef!: MatDialogRef<QuarterlyGoalsModalComponent>;

  // --------------- COMPUTED DATA -----------------------

  quarterlyGoals = this.quarterlyGoalStore.entities;

  // --------------- EVENT HANDLING ----------------------
  openModal(isEditing: boolean) {
    this.dialogRef = this.dialog.open(QuarterlyGoalsModalComponent, {
      height: '90%',
      width: '80%',
      position: { bottom: '0' },
      panelClass: 'goal-modal-panel',
       data: {
         goalDatas: this.quarterlyGoals,
         updateQuarterlyGoals: async (goalsFormArray: FormArray) => {
           try {
             this._snackBar.open('Goals were updated', '', {
               duration: 3000,
               verticalPosition: 'bottom',
               horizontalPosition: 'center',
               });
               this.dialogRef.close();
             } catch (e) {
               console.error(e);
            }
           },
        },
    });
  }
  
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
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
