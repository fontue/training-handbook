export type WorkoutDayId = 'chest-triceps' | 'back-biceps' | 'legs-shoulders';
export type MuscleGroupId = 'chest' | 'triceps' | 'back' | 'biceps' | 'legs' | 'shoulders';
export type LoadTargetId = MuscleGroupId | 'front_delts' | 'side_delts' | 'rear_delts' | 'lats' | 'mid_back' | 'upper_back' | 'lower_back' | 'forearms' | 'grip' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'elbows' | 'systemic';
export type ExerciseStageId = string;
export type LoadLevel = 'low' | 'medium' | 'high';
export type ExerciseDifficulty = LoadLevel;
export type MovementPattern = 'horizontal_press' | 'incline_press' | 'chest_fly' | 'vertical_pull' | 'horizontal_pull' | 'lat_isolation' | 'elbow_extension_overhead' | 'elbow_extension_downward' | 'compound_triceps_press' | 'elbow_flexion' | 'knee_dominant' | 'hip_hinge' | 'leg_extension' | 'leg_curl' | 'calf_raise' | 'vertical_press' | 'lateral_raise' | 'rear_delt_fly';
export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';
export type ProgramRole = 'heavy_base' | 'main_volume' | 'stable_volume' | 'complementary_pattern' | 'local_work' | 'optional_specialization';
export type StimulusTag = 'lengthened_emphasis' | 'mid_range_emphasis' | 'shortened_emphasis' | 'upper_region_focus' | 'middle_region_focus' | 'lower_region_focus' | 'unilateral' | 'neutral_grip' | 'supported' | 'high_stability_demand';
export type ProgressionMethod = 'double_progression' | 'repetition_progression' | 'load_progression' | 'range_of_motion_progression' | 'assistance_reduction' | 'external_load_progression';
export type EvidenceConfidence = 'high' | 'moderate' | 'limited' | 'coaching_heuristic';
export type EvidenceBasis = 'systematic_review' | 'longitudinal_training_study' | 'biomechanics' | 'anatomy' | 'emg' | 'coaching_practice';

export interface ContentEvidence { confidence: EvidenceConfidence; basis: EvidenceBasis[]; sourceIds: string[]; note?: string }
export interface EvidenceBackedText { text: string; evidence: ContentEvidence }
export interface FocusMetric { id: string; label: string; value: number }
export interface ExerciseFocus { label: string; metrics: FocusMetric[]; disclaimer: string; evidence: ContentEvidence }
export interface PracticalProperties { equipment: EquipmentType; requiresSpotter: boolean; lowerBackDemand: LoadLevel; elbowDemand: LoadLevel; shoulderDemand: LoadLevel; stabilityDemand: LoadLevel; systemicFatigue: LoadLevel; unilateral: boolean }
export interface MuscleParticipation { primary: LoadTargetId[]; secondary: LoadTargetId[]; stabilizers: LoadTargetId[] }
export interface ExerciseProfile { movementPattern: MovementPattern; lengthenedBias: number; contractionBias: number }
export interface ExerciseStage { id: ExerciseStageId; muscleGroupId: MuscleGroupId; order: number; title: string; shortTitle: string; description: string; reps: string; sets: string; rir: string; rest: string; optional?: boolean }
export interface WorkoutExercise {
  id: string; muscleGroupId: MuscleGroupId; stageId: ExerciseStageId; name: string; description: string; feature: string; difficulty: ExerciseDifficulty;
  reps: string; sets: string; rir: string; rest: string; role: ProgramRole; stimulusTags: StimulusTag[]; programPurpose: string;
  weightGuidance: string; tip: string; progression: string; progressionMethod: ProgressionMethod; choose: string[]; avoid: string[]; mistakes: string[]; howto: string[];
  focus: ExerciseFocus; participation: MuscleParticipation; practicalProperties: PracticalProperties; profile: ExerciseProfile;
  expectedSecondaryExposure: Partial<Record<LoadTargetId, number>>; evidence: ContentEvidence;
}
export interface WorkoutDay { id: WorkoutDayId; title: string; description: string; primaryMuscleGroup: MuscleGroupId; secondaryMuscleGroup: MuscleGroupId }
export type WorkoutDaySelection = Partial<Record<MuscleGroupId, Partial<Record<ExerciseStageId, string>>>>;
export type RecommendationStatus = 'recommended' | 'suitable' | 'not_ideal';
export interface WorkoutRecommendation { exerciseId: string; status: RecommendationStatus; reasons: string[]; score: number; confidence: EvidenceConfidence; rule: string }
export interface SecondaryGroupContext { exposureLevel: LoadLevel; jointLoad: { lowerBack: LoadLevel; grip: LoadLevel; elbows: LoadLevel; shoulders: LoadLevel; systemic: LoadLevel }; notes: string[] }
export interface WorkoutStep { muscleGroupId: MuscleGroupId; stageId: ExerciseStageId; order: number; optional?: boolean }
