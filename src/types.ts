export type Stage = 1 | 2 | 3;

export type PressAngle = 'horizontal' | 'incline' | 'decline';
export type StabilityDemand = 'low' | 'medium' | 'high';
export type FatigueCost = 'low' | 'medium' | 'high';
export type MovementType = 'press' | 'fly';

export interface ExerciseProfile {
  angle: PressAngle;
  movementType: MovementType;
  stabilityDemand: StabilityDemand;
  fatigueCost: FatigueCost;
  freeWeight: boolean;
  lengthenedBias: boolean;
  contractionBias: boolean;
}

export type ExerciseRole =
  | 'strength_base'
  | 'stable_overload'
  | 'main_volume'
  | 'lengthened'
  | 'peak_contraction'
  | 'upper_chest_focus'
  | 'lower_chest_focus';

export interface Exercise {
  id: string;
  stage: Stage;
  name: string;
  focus: 'Вся грудь' | 'Верх груди' | 'Средняя часть' | 'Нижняя часть';
  feature: string;
  difficulty: string;
  role: ExerciseRole;
  secondaryRole?: ExerciseRole;
  roleDescription: string;
  profile: ExerciseProfile;
  upper: number;
  middle: number;
  lower: number;
  reps: string;
  sets: string;
  rir: string;
  rest: string;
  description: string;
  weight: string;
  tip: string;
  progression: string;
  choose: string[];
  avoid: string[];
  mistakes: string[];
  howto: string[];
}

export type RecommendationStatus = 'recommended' | 'suitable' | 'not_ideal';

export interface ExerciseRecommendation {
  exerciseId: string;
  status: RecommendationStatus;
  reasons: Array<{id:string;text:string;tone:'positive'|'neutral'|'negative';ruleId:string}>;
  score: number;
}

export type WorkoutSelection = Partial<Record<Stage, Exercise>>;
