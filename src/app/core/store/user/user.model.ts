import { Timestamp } from '@angular/fire/firestore';

/** user data */
export interface User {
  __id: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
  name: string;
  email: string;
  photoURL?: string;
  tokens?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
  };
  onboardingState: OnboardingState;
}

export enum OnboardingState {
  WELCOME = 'welcome', // welcome page
  STEP_1 = 'step 1', // initial long-term goals
  STEP_2 = 'step 2', // transition to setting quarterly goals
  STEP_3 = 'step 3', // initial quarterly goals
  STEP_4 = 'step 4', // hashtags
  STEP_5 = 'step 5', // transition to setting weekly goals
  STEP_6 = 'step 6', // initial weekly goals
  STEP_7 = 'step 7', // set weekly goals hashtags
  DONE = 'done', // all done
}

/** Array of all onboarding states in chronological order. */
export const ONBOARDING_SEQUENCE: OnboardingState[] = Object.values(OnboardingState);

/** Maps onboarding states to the 5 progress bar milestone indices (0-4). */
export const ONBOARDING_STEP_INDEX: Partial<Record<OnboardingState, number>> = {
  [OnboardingState.WELCOME]: 0,
  [OnboardingState.STEP_1]: 0,
  [OnboardingState.STEP_2]: 0,
  [OnboardingState.STEP_3]: 1,
  [OnboardingState.STEP_4]: 2,
  [OnboardingState.STEP_5]: 2,
  [OnboardingState.STEP_6]: 3,
  [OnboardingState.STEP_7]: 4,
  [OnboardingState.DONE]: 4,
};