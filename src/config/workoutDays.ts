import type { MuscleGroupId, WorkoutDay, WorkoutDayId } from '../types/workout';

export const muscleGroupLabels: Record<MuscleGroupId, string> = { chest:'Грудь',triceps:'Трицепс',back:'Спина',biceps:'Бицепс',legs:'Ноги',shoulders:'Плечи' };

export const workoutDays: Record<WorkoutDayId, WorkoutDay> = {
  'chest-triceps': { id:'chest-triceps',title:'Грудь → Трицепс',description:'Сначала собирается тренировка груди. При выборе трицепса учитывается нагрузка от жимов.',primaryMuscleGroup:'chest',secondaryMuscleGroup:'triceps' },
  'back-biceps': { id:'back-biceps',title:'Спина → Бицепс',description:'Направления тяг дополняют друг друга, а упражнения на бицепс подбираются с учётом его работы в тягах.',primaryMuscleGroup:'back',secondaryMuscleGroup:'biceps' },
  'legs-shoulders': { id:'legs-shoulders',title:'Ноги → Плечи',description:'Ноги строятся вокруг коленного и тазобедренного паттернов. Плечи тренируются после них как локально свежая группа.',primaryMuscleGroup:'legs',secondaryMuscleGroup:'shoulders' },
};
