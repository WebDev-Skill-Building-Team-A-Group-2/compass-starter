import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector, DestroyRef } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormControl, FormArray, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDropList, CdkDrag, CdkDragHandle, CdkDragDrop } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


// TODO: swap for your real store models
interface Hashtag { id: string; name: string; }
interface WeeklyGoal { id: string; name: string; hashtag: Hashtag | null; }
interface QuarterlyGoal { hashtags: Hashtag[]; }

interface WeeklyGoalsModalData {
  weeklyGoals: WeeklyGoal[];
  quarterlyGoals: QuarterlyGoal[];
  openWithEmptyRow: boolean;
  week: string;
}

type GoalRow = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string>;
  hashtagId: FormControl<string | null>;
}>;

interface Edits {
  added: number;
  edited: number;
  removed: number;
}

// custom validator: rejects values that are empty or only
const notBlank = (c: AbstractControl) => (c.value ?? '').trim() ? null : { blank: true };

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class WeeklyGoalsModalComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------
  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  
  // data in
  data = inject<WeeklyGoalsModalData>(MAT_DIALOG_DATA, { optional: true });

  // data out
  private dialogRef = inject(MatDialogRef<WeeklyGoalsModalComponent>, { optional: true });

  
  // --------------- LOCAL UI STATE ----------------------
  week = '';
  hashtags: Hashtag[] = [];
  
  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // form holds goal rows
  form = this.fb.group({ goals: this.fb.array([]) });
  

  // save original goals for recountEdits and keep track of edits
  private original: WeeklyGoal[] = [];
  private edits = signal<Edits>({ added: 0, edited: 0, removed: 0 });

  
  // --------------- COMPUTED DATA -----------------------
  get goals(): FormArray { 
    return this.form.controls.goals; 
  }

  // edit summary
  summary = computed(() => {
   const { added, edited, removed } = this.edits();
    const edits: string[] = [];
 
    if (added) edits.push(`Adding ${added}`);
    if (edited) edits.push(`Editing ${edited}`);
    if (removed) edits.push(`Deleting ${removed}`);
 
    return edits.join(', ');
  });

  
  // --------------- EVENT HANDLING ----------------------
  // reorder goals after a drag-and-drop.
  drop(event: CdkDragDrop<FormArray>): void {
    const c = this.goals.at(event.previousIndex);
    this.goals.removeAt(event.previousIndex);
    this.goals.insert(event.currentIndex, c);
  }
  // add weekly goal
  add(): void {
    this.goals.push(this.createRow());
  }

  // remove goal i
  remove(idx: number): void {
    this.goals.removeAt(idx);
  }
  
  // map the form rows back to goal objects and return them via close().
  save(): void {
    const goals: WeeklyGoal[] = this.goals.getRawValue().map((row) => ({
      id: row.id!,
      name: row.name.trim(),
      hashtag: this.hashtags.find((h) => h.id === row.hashtagId) ?? null,
    }));
 
    this.dialogRef?.close(goals);
  }

  
  close(): void {
    this.dialogRef?.close();
  }

  
  // --------------- OTHER -------------------------------
  // build one row's FormGroup; prefilled when a goal is passed, empty otherwise.

  private createRow(goal?: WeeklyGoal): GoalRow {
    return this.fb.group({
      id: this.fb.control(goal?.id ?? null),

      // must exist and not be a whitespace
      name: this.fb.nonNullable.control(goal?.name ?? '', [Validators.required, notBlank]),

      // must pick a hashtag
      hashtagId: this.fb.control(goal?.hashtag?.id ?? null, Validators.required),
    });
  }


  private recountEdits(): void {
    const rows = this.goals.getRawValue();
    const remainingIds = new Set(rows.map((row) => row.id));
    let added = 0;
    let edited = 0;
    let removed = 0;

  // main loop
  for (const row of rows) {

    // save original goals from init
    const before = this.original.find((goal) => goal.id === row.id);

    // if row is not original increase added
     if (!before) {
        added++;
        continue;
      }

      // if name and hashtag are changed increase edited
     const nameChanged = row.name.trim() !== before.name.trim();
     const hashtagChanged = row.hashtagId !== (before.hashtag?.id ?? null);

     if (nameChanged || hashtagChanged){
       
       edited++;
     }
    
  }
  // if original and remaining do not have same length
  for (const goal of this.original) {
      if (!remainingIds.has(goal.id)){
        removed++;
      }
    }
 
    this.edits.set({ added, edited, removed });
  }
    
  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }
  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
    // Hardcoded fallback used only while no opener passes MAT_DIALOG_DATA.
    const fallback: WeeklyGoalsModalData = {
      week: '9/24 - 9/30',
      weeklyGoals: [
        { id: '1', name: 'Finish Google cover letter', hashtag: { id: 'h1', name: 'apply-internships' } },
        { id: '2', name: 'Apply to Microsoft', hashtag: { id: 'h1', name: 'apply-internships' } },
        { id: '3', name: 'Review data structures', hashtag: { id: 'h2', name: 'class-algorithms' } },
      ],
      quarterlyGoals: [
        { hashtags: [
          { id: 'h1', name: 'apply-internships' },
          { id: 'h2', name: 'class-algorithms' },
          { id: 'h3', name: 'finish-project' },
        ] },
      ],
      openWithEmptyRow: true,
    };
    const data = this.data ?? fallback;

    this.week = data.week ?? '';                                        // header label
    this.original = data.weeklyGoals ?? [];                             // snapshot for diffing
    this.hashtags = (data.quarterlyGoals ?? []).flatMap(q => q.hashtags ?? []); // flatten dropdown options
    
    for (const goal of this.original) {
      this.goals.push(this.createRow(goal));
    }
 
    if (data.openWithEmptyRow) this.add();                            // optional starting blank row
    
    // Keep the summary live on every edit; auto-unsubscribes on close.
    this.goals.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recountEdits());
 
    this.recountEdits(); // initial count before any user input
  }
}