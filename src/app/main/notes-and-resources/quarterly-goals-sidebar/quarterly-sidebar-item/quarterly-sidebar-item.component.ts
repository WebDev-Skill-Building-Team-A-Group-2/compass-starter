import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlySidebarItemAnimations } from 'src/app/main/notes-and-resources/quarterly-goals-sidebar/quarterly-sidebar-item/quarterly-sidebar-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoalData } from 'src/app/main/home/home.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Timestamp } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { QUARTERLYGOAL_DB } from 'src/app/core/store/quarterly-goal/quarterly-goal.mock';
import { HashtagMockDB } from 'src/app/core/store/hashtag/hashtag.mock';
import { WEEKLYGOAL_DB } from 'src/app/core/store/weekly-goal/weekly-goal.mock';
@Component({
  selector: 'app-quarterly-sidebar-item',
  templateUrl: './quarterly-sidebar-item.component.html',
  styleUrls: ['./quarterly-sidebar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlySidebarItemAnimations,
  standalone: true,
  imports: [
        MatCheckboxModule,
        MatIconModule,
  ],
})
/*code for the component class*/
export class QuarterlySidebarItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagDB = inject(HashtagMockDB);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  editClicked = output<boolean>();
  // --------------- LOCAL UI STATE ----------------------
  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  quarterLabel = 'Fall 2026';
  /*Code for example quarterly goals*/
  quarterlyGoals = QUARTERLYGOAL_DB;
  // --------------- COMPUTED DATA -----------------------
  getHashtag(id: string) {
    return this.hashtagDB.selectEntity(id);
  }
  getWeeklyGoalsTotal(quarterlyGoalId: string): number {
    return WEEKLYGOAL_DB.filter(
      goal => goal.__quarterlyGoalId === quarterlyGoalId
    ).length;
  }

  getWeeklyGoalsComplete(quarterlyGoalId: string): number {
    return WEEKLYGOAL_DB.filter(
      goal => goal.__quarterlyGoalId === quarterlyGoalId &&
             goal.completed
    ).length;
  }

  // --------------- EVENT HANDLING ----------------------
  /*open a dialog box when goal is checked, telling whether goal
  is completed or not*/ 
   checkGoal(goalId: string): void {
    const goal = this.quarterlyGoals.find(
      g => g.__id === goalId
    );
  
    if (!goal) {
      return;
    }
  
    goal.completed = !goal.completed;
  
    const message = goal.completed
      ? 'Marked goal as complete'
      : 'Marked goal as incomplete';
  
    this.snackBar.open(message, '', {
      duration: 3000,
    });
 }
/*when you click the edit button the modal from quarterly-goals-sidebar.component.ts
opens*/
 onEditClicked(isEditing: boolean) {
    this.editClicked.emit(isEditing);  
 }
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
      private snackBar: MatSnackBar,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
