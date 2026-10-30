import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlySidebarItemAnimations } from './quarterly-sidebar-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoalData } from '../../../home/home.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Timestamp } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon'; 
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-quarterly-sidebar-item',
  templateUrl: './quarterly-sidebar-item.component.html',
  styleUrls: ['./quarterly-sidebar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlySidebarItemAnimations,
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule
  ],
})
/*code for the component class*/
export class QuarterlySidebarItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  editClicked = output<boolean>();
  // --------------- LOCAL UI STATE ----------------------
  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  quarterLabel = 'Fall 2026';
  /*Code for example quarterly goals*/
  exampleQuarterlyGoals: QuarterlyGoalData[] = [
  {
    __id: 'qg1',
    __userId: this.currentUser()?.__id ?? '',
    __hashtagId: 'ht1',
    text: 'Do well in algorithms class',
    order: 1,
    completed: false,
    hashtag: {
      __id: 'ht1',
      __userId: this.currentUser()?.__id ?? '',
      name: 'class-algorithms',
      color: '#FFB987',
    },
    weeklyGoalsTotal: 5,
    weeklyGoalsComplete: 4,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
    __id: 'qg2',
    __userId: this.currentUser()?.__id ?? '',
    __hashtagId: 'ht2',
    text: 'Apply to all internships',
    order: 2,
    completed: false,
    hashtag: {
      __id: 'ht2',
      __userId: this.currentUser()?.__id ?? '',
      name: 'apply-internships',
      color: '#2DBDB1',
    },
    weeklyGoalsTotal: 3,
    weeklyGoalsComplete: 2,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
  __id: 'qg3',
  __userId: this.currentUser()?.__id ?? '',
  __hashtagId: 'ht3',
  text: 'Technical interview prep',
  order: 3,
  completed: false,
  hashtag: {
    __id: 'ht3',
    __userId: this.currentUser()?.__id ?? '',
    name: 'interview-technical',
    color: '#EE8B72',
  },
  weeklyGoalsTotal: 2,
  weeklyGoalsComplete: 1,
  _createdAt: Timestamp.now(),
  _updatedAt: Timestamp.now(),
  _deleted: false,
}
];
  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  //open a dialog box when goal is checked, telling whether goal
  //is completed or not 
   checkGoal(goalId: string): void {
    const goal = this.exampleQuarterlyGoals.find(
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
//when you click the edit button the modal from quarterly-goals-sidebar.component.ts
//opens
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
