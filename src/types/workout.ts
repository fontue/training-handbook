export type WorkoutDayId = 'chest-triceps' | 'back-biceps' | 'legs-shoulders';
export type MuscleGroupId = 'chest' | 'triceps' | 'back' | 'biceps' | 'legs' | 'shoulders';
export type LoadTargetId = MuscleGroupId | 'front_delts' | 'side_delts' | 'rear_delts' | 'lats' | 'upper_back' | 'lower_back' | 'forearms' | 'grip' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'elbows' | 'systemic';
export type ExerciseStageId = string;
export type LoadLevel = 'low' | 'medium' | 'high';
export type ExerciseDifficulty = LoadLevel;
export type MovementPattern = 'horizontal_press' | 'incline_press' | 'chest_fly' | 'vertical_pull' | 'horizontal_pull' | 'lat_isolation' | 'elbow_extension_overhead' | 'elbow_extension_downward' | 'elbow_flexion_lengthened' | 'elbow_flexion_supported' | 'knee_dominant' | 'hip_hinge' | 'leg_extension' | 'leg_curl' | 'calf_raise' | 'vertical_press' | 'lateral_raise' | 'rear_delt_fly';
export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';
export type UniversalExerciseRole = 'strength_base' | 'stable_overload' | 'main_volume' | 'lengthened' | 'peak_contraction' | 'angle_focus' | 'complementary_pattern' | 'low_fatigue_isolation' | 'unilateral_control' | 'technical_skill' | 'secondary_muscle_focus';

export interface FocusMetric { id: string; label: string; value: number }
export interface ExerciseFocus { label: string; metrics: FocusMetric[] }
export interface UniversalExerciseProfile { movementPattern: MovementPattern; equipment: EquipmentType; stabilityDemand: LoadLevel; systemicFatigue: LoadLevel; jointStress: LoadLevel; lengthenedBias: number; contractionBias: number; unilateral: boolean }
export interface ExerciseStage { id: ExerciseStageId; muscleGroupId: MuscleGroupId; order: number; title: string; shortTitle: string; description: string; reps: string; sets: string; rir: string; rest: string; optional?: boolean }
export interface WorkoutExercise {
  id: string; muscleGroupId: MuscleGroupId; stageId: ExerciseStageId; name: string; description: string; feature: string; difficulty: ExerciseDifficulty;
  reps: string; sets: string; rir: string; rest: string; role: UniversalExerciseRole; secondaryRole?: UniversalExerciseRole; roleDescription: string;
  weight: string; tip: string; progression: string; choose: string[]; avoid: string[]; mistakes: string[]; howto: string[];
  focus: ExerciseFocus; profile: UniversalExerciseProfile; secondaryLoad: Partial<Record<LoadTargetId, number>>;
}
export interface WorkoutDay { id: WorkoutDayId; title: string; description: string; primaryMuscleGroup: MuscleGroupId; secondaryMuscleGroup: MuscleGroupId }
export type WorkoutDaySelection = Partial<Record<MuscleGroupId, Partial<Record<ExerciseStageId, string>>>>;
export type RecommendationStatus = 'recommended' | 'suitable' | 'not_ideal';
export interface WorkoutRecommendation { exerciseId: string; status: RecommendationStatus; reasons: string[]; score: number }
export interface SecondaryGroupContext { indirectLoad: number; fatigueLevel: LoadLevel; notes: string[] }
export interface WorkoutStep { muscleGroupId: MuscleGroupId; stageId: ExerciseStageId; order: number; optional?: boolean }
