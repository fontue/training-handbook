export type Stage = 1 | 2 | 3;

export interface Exercise {
  stage: Stage;
  name: string;
  focus: 'Вся грудь' | 'Верх груди' | 'Средняя часть' | 'Нижняя часть';
  feature: string;
  difficulty: string;
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

export type TrainingPlan = Record<Stage, Exercise | null>;
