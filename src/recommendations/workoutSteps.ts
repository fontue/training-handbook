import type { ExerciseStage, WorkoutDay, WorkoutStep } from '../types/workout';

export function getWorkoutSteps(day:WorkoutDay,stages:ExerciseStage[]):WorkoutStep[]{return [day.primaryMuscleGroup,day.secondaryMuscleGroup].flatMap(group=>stages.filter(stage=>stage.muscleGroupId===group).sort((a,b)=>a.order-b.order).map(stage=>({muscleGroupId:group,stageId:stage.id,order:stage.order,optional:stage.optional})));}
