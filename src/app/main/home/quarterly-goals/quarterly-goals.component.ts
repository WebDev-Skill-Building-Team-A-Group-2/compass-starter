import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsAnimations } from './quarterly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoalsItemComponent } from './quarterly-goals-item/quarterly-goals-item.component';
import { QuarterlyGoalsHeaderComponent } from './quarterly-goals-header/quarterly-goals-header.component';
import { QuarterlyGoalData } from '../home.model';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuarterlyGoalsModalComponent } from './quarterly-goals-modal/quarterly-goals-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-quarterly-goals',
  templateUrl: './quarterly-goals.component.html',
  styleUrls: ['./quarterly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsAnimations,
  standalone: true,
  imports: [
    QuarterlyGoalsItemComponent,
    QuarterlyGoalsModalComponent,
    QuarterlyGoalsHeaderComponent,
  ],
})
export class QuarterlyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private _snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  /** Mock quarterly goals data for testing. */
  quarterlyGoals: QuarterlyGoalData[] = [
    {
      __id: 'qg1',
      __userId: 'test-user',
      __hashtagId: 'ht1',
      text: 'Finish cover letters',
      order: 1,
      completed: false,
      hashtag: {
        __id: 'ht1',
        __userId: 'test-user',
        name: 'coverletter',
        color: '#EE8B72',
      },
      weeklyGoalsTotal: 3,
      weeklyGoalsComplete: 1,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
    {
      __id: 'qg2',
      __userId: 'test-user',
      __hashtagId: 'ht2',
      text: 'Apply to internships',
      order: 2,
      completed: false,
      hashtag: {
        __id: 'ht2',
        __userId: 'test-user',
        name: 'apply',
        color: '#2DBDB1',
      },
      weeklyGoalsTotal: 2,
      weeklyGoalsComplete: 2,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
  ];

private dialogRef!: MatDialogRef<QuarterlyGoalsModalComponent>;
  
  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  
  editQuarterlyGoals(isEditing: boolean) {
    this._snackBar.open('Edit quarter goals', '', {
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  openModal() {
    this.dialogRef = this.dialog.open(QuarterlyGoalsModalComponent, {
      height: '90%',
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
