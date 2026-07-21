// Add any extra data types you'll need here!
import { QuarterlyGoal } from '../../core/store/quarterly-goal/quarterly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';

export interface QuarterlyGoalData extends QuarterlyGoal {
  hashtag: Hashtag;
  weeklyGoalsTotal: number;
  weeklyGoalsComplete: number;
}