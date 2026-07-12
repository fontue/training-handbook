import { exercises as legacyChestExercises } from './exercises';
import { exerciseStages } from './exerciseStages';
import type { EquipmentType, ExerciseFocus, ExerciseStageId, LoadLevel, MovementPattern, MuscleGroupId, UniversalExerciseRole, WorkoutExercise } from '../types/workout';

const stageById = new Map(exerciseStages.map(stage => [stage.id, stage]));
const chestStageIds: Record<number, ExerciseStageId> = {1:'chest-heavy-press',2:'chest-volume',3:'chest-isolation'};
const roleMap: Record<string, UniversalExerciseRole> = {strength_base:'strength_base',stable_overload:'stable_overload',main_volume:'main_volume',lengthened:'lengthened',peak_contraction:'peak_contraction',upper_chest_focus:'angle_focus',lower_chest_focus:'angle_focus'};
const difficultyMap: Record<string, LoadLevel> = {Низкая:'low',Средняя:'medium',Высокая:'high'};
const equipmentMap: Record<string, EquipmentType> = {barbell:'barbell',dumbbell:'dumbbell',cable:'cable',machine:'machine',bodyweight:'bodyweight'};

function equipmentFromName(name: string): EquipmentType {
  const value = name.toLowerCase();
  if (value.includes('гантел')) return 'dumbbell';
  if (value.includes('штанг') || value.includes('ez')) return 'barbell';
  if (value.includes('блок') || value.includes('кроссовер') || value.includes('канат')) return 'cable';
  if (value.includes('подтяг') || value.includes('брусь')) return 'bodyweight';
  return 'machine';
}

export const chestExercises: WorkoutExercise[] = legacyChestExercises.map(exercise => ({
  id:exercise.id,muscleGroupId:'chest',stageId:chestStageIds[exercise.stage],name:exercise.name,description:exercise.description,feature:exercise.feature,difficulty:difficultyMap[exercise.difficulty],
  reps:exercise.reps,sets:exercise.sets,rir:exercise.rir,rest:exercise.rest,role:roleMap[exercise.role],secondaryRole:exercise.secondaryRole ? roleMap[exercise.secondaryRole] : undefined,roleDescription:exercise.roleDescription,
  weight:exercise.weight,tip:exercise.tip,progression:exercise.progression,choose:exercise.choose,avoid:exercise.avoid,mistakes:exercise.mistakes,howto:exercise.howto,
  focus:{label:exercise.focus,metrics:[{id:'upper',label:'Верх',value:exercise.upper},{id:'middle',label:'Середина',value:exercise.middle},{id:'lower',label:'Низ',value:exercise.lower}]},
  profile:{movementPattern:exercise.profile.angle === 'incline' ? 'incline_press' : exercise.profile.movementType === 'fly' ? 'chest_fly' : 'horizontal_press',equipment:equipmentFromName(exercise.name),stabilityDemand:exercise.profile.stabilityDemand,systemicFatigue:exercise.profile.fatigueCost,jointStress:exercise.profile.fatigueCost,lengthenedBias:exercise.profile.lengthenedBias ? 5 : 2,contractionBias:exercise.profile.contractionBias ? 5 : 2,unilateral:false},
  secondaryLoad:{triceps:exercise.profile.movementType === 'press' ? (exercise.profile.freeWeight ? 4 : 3) : exercise.name.includes('Разведения') ? 0 : 1},
}));

interface SimpleSpec { id:string; stageId:string; name:string; pattern:MovementPattern; equipment?:EquipmentType; role?:UniversalExerciseRole; secondaryRole?:UniversalExerciseRole; focusLabel?:string; metrics?:Array<[string,string,number]>; fatigue?:LoadLevel; stability?:LoadLevel; jointStress?:LoadLevel; unilateral?:boolean; secondaryLoad?:Partial<Record<MuscleGroupId,number>> }

function makeExercise(muscleGroupId: MuscleGroupId, spec: SimpleSpec): WorkoutExercise {
  const stage = stageById.get(spec.stageId)!;
  const focus: ExerciseFocus = {label:spec.focusLabel ?? stage.shortTitle,metrics:(spec.metrics ?? [['target','Основная зона',4],['support','Дополнение',2]]).map(([id,label,value]) => ({id,label,value}))};
  return {id:spec.id,muscleGroupId,stageId:spec.stageId,name:spec.name,description:`${spec.name} — рабочий вариант этапа «${stage.title}».`,feature:stage.shortTitle,difficulty:spec.stability ?? 'medium',reps:stage.reps,sets:stage.sets,rir:stage.rir,rest:stage.rest,
    role:spec.role ?? 'main_volume',secondaryRole:spec.secondaryRole,roleDescription:'Помогает закрыть задачу текущего этапа без неоправданного дублирования предыдущей работы.',
    weight:`Вес подходит, если выполняется диапазон ${stage.reps} с заданным запасом и стабильной техникой.`,tip:'Сохраняй контролируемую амплитуду и не ускоряй негативную фазу.',progression:'Достиг верхней границы повторений во всех подходах — добавь минимальный доступный шаг.',
    choose:['Соответствует задаче текущего этапа.','Траектория комфортна для суставов.'],avoid:['Появляется боль или теряется контроль.'],mistakes:['Слишком большой вес.','Сокращение амплитуды.'],howto:['Настрой исходное положение.','Выполни движение подконтрольно.','Сохрани одинаковую технику во всех повторениях.'],focus,
    profile:{movementPattern:spec.pattern,equipment:spec.equipment ?? equipmentFromName(spec.name),stabilityDemand:spec.stability ?? 'medium',systemicFatigue:spec.fatigue ?? 'medium',jointStress:spec.jointStress ?? 'medium',lengthenedBias:spec.role === 'lengthened' ? 5 : 2,contractionBias:spec.role === 'peak_contraction' ? 5 : 2,unilateral:spec.unilateral ?? false},secondaryLoad:spec.secondaryLoad ?? {}};
}

const specs: Record<Exclude<MuscleGroupId,'chest'>, SimpleSpec[]> = {
  triceps:[
    {id:'triceps-rope-overhead',stageId:'triceps-lengthened',name:'Разгибание рук из-за головы с канатом',pattern:'elbow_extension_overhead',equipment:'cable',role:'lengthened',secondaryRole:'secondary_muscle_focus',focusLabel:'Длинная головка'},
    {id:'triceps-single-overhead',stageId:'triceps-lengthened',name:'Разгибание одной руки из-за головы на блоке',pattern:'elbow_extension_overhead',equipment:'cable',role:'lengthened',secondaryRole:'unilateral_control',unilateral:true},
    {id:'triceps-ez-extension',stageId:'triceps-lengthened',name:'Французский жим EZ лёжа',pattern:'elbow_extension_overhead',equipment:'barbell',role:'stable_overload',fatigue:'medium',jointStress:'high'},
    {id:'triceps-rope-pushdown',stageId:'triceps-shortened',name:'Разгибание рук с канатом',pattern:'elbow_extension_downward',equipment:'cable',role:'peak_contraction',fatigue:'low'},
    {id:'triceps-bar-pushdown',stageId:'triceps-shortened',name:'Разгибание с прямой или V-образной рукоятью',pattern:'elbow_extension_downward',equipment:'cable',role:'stable_overload',fatigue:'low'},
    {id:'triceps-single-pushdown',stageId:'triceps-shortened',name:'Одноручное разгибание на блоке',pattern:'elbow_extension_downward',equipment:'cable',role:'unilateral_control',fatigue:'low',unilateral:true},
    {id:'triceps-close-grip',stageId:'triceps-shortened',name:'Жим узким хватом',pattern:'horizontal_press',equipment:'barbell',role:'strength_base',fatigue:'high',jointStress:'high'},
    {id:'triceps-dips',stageId:'triceps-shortened',name:'Отжимания на брусьях с акцентом на трицепс',pattern:'horizontal_press',equipment:'bodyweight',role:'strength_base',fatigue:'high',jointStress:'high'},
  ],
  back:[
    {id:'weighted-pullup',stageId:'back-primary-pull',name:'Подтягивания с дополнительным весом',pattern:'vertical_pull',equipment:'bodyweight',role:'strength_base',fatigue:'high',stability:'high',secondaryLoad:{biceps:4}},
    {id:'barbell-row',stageId:'back-primary-pull',name:'Тяга штанги в наклоне',pattern:'horizontal_pull',equipment:'barbell',role:'strength_base',fatigue:'high',stability:'high',secondaryLoad:{biceps:3}},
    {id:'tbar-row',stageId:'back-primary-pull',name:'Тяга Т-грифа',pattern:'horizontal_pull',role:'stable_overload',fatigue:'high',secondaryLoad:{biceps:3}},
    {id:'heavy-chest-row',stageId:'back-primary-pull',name:'Тяжёлая тяга в тренажёре с упором грудью',pattern:'horizontal_pull',role:'stable_overload',stability:'low',secondaryLoad:{biceps:2}},
    {id:'neutral-pulldown-heavy',stageId:'back-primary-pull',name:'Вертикальная тяга нейтральным хватом',pattern:'vertical_pull',equipment:'cable',role:'stable_overload',secondaryLoad:{biceps:3}},
    ...['Верхний блок широким хватом','Верхний блок нейтральным хватом','Одноручная вертикальная тяга','Подтягивания без дополнительного веса'].map((name,i)=>({id:`back-vertical-${i}`,stageId:'back-complementary-pull',name,pattern:'vertical_pull' as const,role:'complementary_pattern' as const,secondaryLoad:{biceps:i===1?3:2}})),
    ...['Тяга нижнего блока','Тяга с упором грудью','Горизонтальный Hammer','Тяга гантели одной рукой'].map((name,i)=>({id:`back-horizontal-${i}`,stageId:'back-complementary-pull',name,pattern:'horizontal_pull' as const,role:'complementary_pattern' as const,unilateral:i===3,secondaryLoad:{biceps:2}})),
    ...['Тяга прямыми руками','Пуловер на верхнем блоке','Пуловер в тренажёре','Лёгкая тяга с упором грудью'].map((name,i)=>({id:`back-local-${i}`,stageId:'back-local',name,pattern:i===3?'horizontal_pull' as const:'lat_isolation' as const,role:'low_fatigue_isolation' as const,fatigue:'low' as const,secondaryLoad:{biceps:i===3?1:0}})),
  ],
  biceps:[
    ...['Сгибание гантелей на наклонной скамье','Bayesian curl на нижнем блоке','Одноручное сгибание на блоке с рукой за корпусом'].map((name,i)=>({id:`biceps-lengthened-${i}`,stageId:'biceps-lengthened',name,pattern:'elbow_flexion_lengthened' as const,role:'lengthened' as const,unilateral:i>0})),
    ...['Сгибание на скамье Скотта','Сгибание в тренажёре','Концентрированное сгибание','Сгибание на блоке','Молотковые сгибания'].map((name,i)=>({id:`biceps-supported-${i}`,stageId:'biceps-supported',name,pattern:'elbow_flexion_supported' as const,role:i===4?'secondary_muscle_focus' as const:'peak_contraction' as const,stability:'low' as const})),
  ],
  legs:[
    ...['Приседания со штангой','Hack squat','Жим ногами','Присед в Смите','Фронтальный присед'].map((name,i)=>({id:`legs-knee-${i}`,stageId:'legs-knee-dominant',name,pattern:'knee_dominant' as const,role:i===0||i===4?'strength_base' as const:'stable_overload' as const,fatigue:i===0||i===4?'high' as const:'medium' as const,stability:i===0||i===4?'high' as const:'low' as const})),
    ...['Румынская тяга','Ягодичный мост','Гиперэкстензия с акцентом на ягодицы','Тяга на прямых ногах'].map((name,i)=>({id:`legs-hip-${i}`,stageId:'legs-hip-dominant',name,pattern:'hip_hinge' as const,role:i===0?'strength_base' as const:'main_volume' as const,fatigue:i===0||i===3?'high' as const:'medium' as const})),
    ...['Болгарские выпады','Обратные выпады','Разгибание ног','Сгибание ног лёжа или сидя','Односторонний жим ногами'].map((name,i)=>({id:`legs-accessory-${i}`,stageId:'legs-accessory',name,pattern:i===2?'leg_extension' as const:i===3?'leg_curl' as const:'knee_dominant' as const,role:i===2||i===3?'low_fatigue_isolation' as const:'unilateral_control' as const,unilateral:i!==2&&i!==3})),
    ...['Подъём на носки стоя','Подъём на носки сидя','Икры в жиме ногами'].map((name,i)=>({id:`legs-calves-${i}`,stageId:'legs-calves',name,pattern:'calf_raise' as const,role:'low_fatigue_isolation' as const,fatigue:'low' as const})),
  ],
  shoulders:[
    ...['Жим гантелей сидя','Жим в тренажёре','Жим штанги над головой','Махи в стороны в тренажёре'].map((name,i)=>({id:`shoulders-primary-${i}`,stageId:'shoulders-primary',name,pattern:i===3?'lateral_raise' as const:'vertical_press' as const,role:i===1?'stable_overload' as const:i===3?'secondary_muscle_focus' as const:'strength_base' as const,fatigue:i===2?'high' as const:'medium' as const,stability:i===1||i===3?'low' as const:'medium' as const})),
    ...['Махи гантелями в стороны','Одноручные махи в кроссовере','Махи в тренажёре','Махи в кроссовере с рукой за корпусом'].map((name,i)=>({id:`shoulders-lateral-${i}`,stageId:'shoulders-lateral',name,pattern:'lateral_raise' as const,role:i===1||i===3?'unilateral_control' as const:'main_volume' as const,fatigue:'low' as const,unilateral:i===1||i===3})),
    ...['Обратный пек-дек','Разведения в кроссовере','Разведения с гантелями с упором грудью','Face pull'].map((name,i)=>({id:`shoulders-rear-${i}`,stageId:'shoulders-rear',name,pattern:'rear_delt_fly' as const,role:i===3?'complementary_pattern' as const:'peak_contraction' as const,fatigue:'low' as const})),
  ],
};

export const workoutExercises: WorkoutExercise[] = [...chestExercises,...(Object.entries(specs) as Array<[Exclude<MuscleGroupId,'chest'>,SimpleSpec[]]>).flatMap(([group,items]) => items.map(item => makeExercise(group,item)))];
