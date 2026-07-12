export type Stage = 1 | 2 | 3;

export type ExerciseRole =
  | 'strength_base'
  | 'stable_overload'
  | 'main_volume'
  | 'lengthened'
  | 'peak_contraction'
  | 'upper_chest_focus'
  | 'lower_chest_focus';

export interface Exercise {
  stage: Stage;
  name: string;
  focus: 'Вся грудь' | 'Верх груди' | 'Средняя часть' | 'Нижняя часть';
  feature: string;
  difficulty: string;
  role: ExerciseRole;
  secondaryRole?: ExerciseRole;
  roleDescription: string;
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
