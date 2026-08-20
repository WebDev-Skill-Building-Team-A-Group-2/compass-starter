import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { QuarterlyGoalsModalAnimations } from './quarterly-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuarterlyGoalData, QuarterlyGoalInForm } from '../../home.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragHandle, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatPrefix } from '@angular/material/form-field';


@Component({
  selector: 'app-quarterly-goals-modal',
  templateUrl: './quarterly-goals-modal.component.html',
  styleUrls: ['./quarterly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsModalAnimations,
  standalone: true,
  imports: [
    MatIconButton,
    MatDialogClose,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgFor,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatPrefix,
  ],
})
export class QuarterlyGoalsModalComponent implements OnInit {
  // --------------- LOCAL UI STATE ----------------------

  quarterlyGoalsForm = this.fb.group({
    allGoals: this.fb.array([]),
  });

  quarter = 'Fall 2025';

  // --------------- COMPUTED DATA -----------------------

  get allGoals() {
    return this.quarterlyGoalsForm.get('allGoals') as FormArray;
  }

  get addedGoalsCount() {
    return this.allGoals.controls.filter(
      (goal) => goal.value._new && !goal.value._deleted
    ).length;
  }

  get editedGoalsCount() {
    return this.allGoals.controls.filter(
      (goal) =>
        goal.dirty &&
        goal.value.text !== goal.value.originalText &&
        !goal.value._new &&
        !goal.value._deleted
    ).length;
  }

  get deletedGoalsCount() {
    return this.allGoals.controls.filter((goal) => goal.value._deleted).length;
  }

  // --------------- EVENT HANDLING ----------------------

  drop(event: CdkDragDrop<string[]>) {
  const control = this.allGoals.at(event.previousIndex);
  this.allGoals.removeAt(event.previousIndex);
  this.allGoals.insert(event.currentIndex, control);
  this.allGoals.markAsDirty();
}
  async saveGoals() {
    await this.data.updateQuarterlyGoals(this.allGoals);
  }

  // --------------- OTHER -------------------------------

  addGoalToForm(goal: QuarterlyGoalInForm | null) {
    this.allGoals.push(
      this.fb.group({
        text: [goal ? goal.text : '', Validators.required],
        hashtagName: [goal ? goal.hashtagName : '', Validators.required],
        hashtagColor: [goal ? goal.hashtagColor : ''],
        originalText: [goal ? goal.text : ''],
        originalOrder: [goal ? goal.originalOrder : 1],
        __quarterlyGoalId: [goal ? goal.__quarterlyGoalId : ''],
        _deleted: [goal ? goal._deleted : false],
        _new: [goal ? false : true],
      })
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      goalDatas: QuarterlyGoalData[];
      updateQuarterlyGoals: (goals: FormArray) => Promise<void>;
    },
    private fb: FormBuilder
  ) {}

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
    this.allGoals.clear();
    if (this.data.goalDatas.length === 0) {
      this.addGoalToForm(null);
    } else {
      this.data.goalDatas.forEach((goal) => {
        this.addGoalToForm({
          text: goal.text,
          hashtagName: goal.hashtag.name,
          hashtagColor: goal.hashtag.color,
          originalText: goal.text,
          originalOrder: goal.order,
          __quarterlyGoalId: goal.__id,
          _deleted: goal._deleted,
          _new: false,
        });
      });
    }
  }
}