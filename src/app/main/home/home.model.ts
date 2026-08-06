// Add any extra data types you'll need here!
import { QuarterlyGoal } from '../../core/store/quarterly-goal/quarterly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';

export interface QuarterlyGoalData extends QuarterlyGoal {
  hashtag: Hashtag;
  weeklyGoalsTotal: number;
  weeklyGoalsComplete: number;
}

export interface QuarterlyGoalInForm {
  text: string;
  hashtagName: string;
  hashtagColor: string;
  originalText: string;
  originalOrder: number;
  __quarterlyGoalId: string;
  _deleted: boolean;
  _new: boolean;
}