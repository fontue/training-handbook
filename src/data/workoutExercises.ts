import { exercises as legacyChestExercises } from './exercises';
import { exerciseStages } from './exerciseStages';
import type { ContentEvidence, EquipmentType, ExerciseFocus, ExerciseStageId, LoadLevel, LoadTargetId, MovementPattern, MuscleGroupId, ProgramRole, StimulusTag, WorkoutExercise } from '../types/workout';

const stageById = new Map(exerciseStages.map(stage => [stage.id, stage]));
const chestStageIds: Record<number, ExerciseStageId> = {1:'chest-heavy-press',2:'chest-volume',3:'chest-isolation'};
const roleMap: Record<string, ProgramRole> = {strength_base:'heavy_base',stable_overload:'stable_volume',main_volume:'main_volume',lengthened:'local_work',peak_contraction:'local_work',upper_chest_focus:'optional_specialization',lower_chest_focus:'optional_specialization'};
const difficultyMap: Record<string, LoadLevel> = {Низкая:'low',Средняя:'medium',Высокая:'high'};
const equipmentMap: Record<string, EquipmentType> = {barbell:'barbell',dumbbell:'dumbbell',cable:'cable',machine:'machine',bodyweight:'bodyweight'};
const FOCUS_DISCLAIMER='Это ориентировочное сравнение вариантов, а не точное измерение активности мышцы. Реальное распределение нагрузки зависит от техники, строения тела и оборудования.';
const CHEST_EVIDENCE:ContentEvidence={confidence:'moderate',basis:['longitudinal_training_study','biomechanics','anatomy'],sourceIds:['schoenfeld-load-2021','lauver-bench-angle-2016']};
const PRACTICE_EVIDENCE:ContentEvidence={confidence:'coaching_heuristic',basis:['biomechanics','anatomy','coaching_practice'],sourceIds:['resistance-training-position-stand']};

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
  reps:exercise.reps,sets:exercise.sets,rir:exercise.rir,rest:exercise.rest,role:roleMap[exercise.role],stimulusTags:[exercise.profile.lengthenedBias?'lengthened_emphasis':exercise.profile.contractionBias?'shortened_emphasis':'mid_range_emphasis',...(exercise.profile.angle==='incline'?['upper_region_focus' as const]:exercise.profile.angle==='decline'?['lower_region_focus' as const]:['middle_region_focus' as const])],programPurpose:exercise.roleDescription,
  weightGuidance:exercise.weight,tip:exercise.tip,progression:exercise.progression,progressionMethod:'double_progression',choose:exercise.choose,avoid:exercise.avoid,mistakes:exercise.mistakes,howto:exercise.howto,
  focus:{label:exercise.focus,metrics:[{id:'upper',label:'Верх',value:exercise.upper},{id:'middle',label:'Середина',value:exercise.middle},{id:'lower',label:'Низ',value:exercise.lower}],disclaimer:FOCUS_DISCLAIMER,evidence:CHEST_EVIDENCE},
  participation:{primary:['chest'],secondary:exercise.profile.movementType==='press'?['triceps','front_delts']:[],stabilizers:exercise.profile.freeWeight?['shoulders']:[]},
  practicalProperties:{equipment:equipmentFromName(exercise.name),requiresSpotter:exercise.profile.freeWeight&&exercise.name.includes('штанг'),lowerBackDemand:'low',elbowDemand:exercise.profile.movementType==='press'?'medium':'low',shoulderDemand:exercise.profile.fatigueCost,stabilityDemand:exercise.profile.stabilityDemand,systemicFatigue:exercise.profile.fatigueCost,unilateral:false},
  profile:{movementPattern:exercise.profile.angle === 'incline' ? 'incline_press' : exercise.profile.movementType === 'fly' ? 'chest_fly' : 'horizontal_press',lengthenedBias:exercise.profile.lengthenedBias ? 5 : 2,contractionBias:exercise.profile.contractionBias ? 5 : 2},
  expectedSecondaryExposure:{triceps:exercise.profile.movementType === 'press' ? (exercise.profile.freeWeight ? 4 : 3) : exercise.name.includes('Разведения') ? 0 : 1,front_delts:exercise.profile.movementType === 'press' ? (exercise.profile.angle==='incline'?4:3) : 1,elbows:exercise.profile.movementType === 'press'?2:0},evidence:CHEST_EVIDENCE,
  claims:exercise.profile.angle==='incline'?[{id:`${exercise.id}-upper-focus`,text:'Наклон чаще смещает акцент к верхней части груди; при большом угле возрастает участие передней дельты.',evidence:{confidence:'moderate',basis:['biomechanics','emg'],sourceIds:['lauver-bench-angle-2016']}}]:undefined,
  limitingFactors:exercise.profile.movementType==='press'?['способность сохранять траекторию','трицепс','устойчивость плечевого пояса']:['контроль положения плеча','способность сохранять угол в локте','комфортная амплитуда'],
  sensations:{target:['Напряжение грудных при движении плеча к центру корпуса.'],acceptable:exercise.profile.movementType==='press'?['Умеренная работа трицепса и передней дельты.']:['Небольшая работа передней дельты при устойчивом плече.'],warning:['Острая боль в передней части плеча.','Потеря контроля в нижней точке.']},
}));

type LegacyRole='strength_base'|'stable_overload'|'main_volume'|'lengthened'|'peak_contraction'|'complementary_pattern'|'low_fatigue_isolation'|'unilateral_control'|'secondary_muscle_focus';
interface SimpleSpec { id:string; stageId:string; name:string; pattern:MovementPattern; equipment?:EquipmentType; role?:LegacyRole; secondaryRole?:LegacyRole; focusLabel?:string; metrics?:Array<[string,string,number]>; fatigue?:LoadLevel; stability?:LoadLevel; jointStress?:LoadLevel; unilateral?:boolean; secondaryLoad?:Partial<Record<LoadTargetId,number>> }

function patternLoads(pattern:MovementPattern):Partial<Record<LoadTargetId,number>> {if(pattern==='knee_dominant')return{quads:4,glutes:2,systemic:2};if(pattern==='hip_hinge')return{hamstrings:4,glutes:4,lower_back:2,systemic:3};if(pattern==='vertical_pull')return{lats:4,biceps:3,grip:2};if(pattern==='horizontal_pull')return{upper_back:4,biceps:2,rear_delts:2};if(pattern==='vertical_press')return{front_delts:4,triceps:3,systemic:2};if(pattern==='lateral_raise')return{side_delts:4};if(pattern==='rear_delt_fly')return{rear_delts:4};if(pattern==='elbow_extension_overhead'||pattern==='elbow_extension_downward')return{elbows:2};return{};}

function defaultMetrics(group:MuscleGroupId,pattern:MovementPattern):Array<[string,string,number]>{
  if(group==='back')return[['lats','Широчайшие',pattern==='vertical_pull'||pattern==='lat_isolation'?5:3],['mid_back','Середина спины',pattern==='horizontal_pull'?5:2],['upper_back','Верх спины',pattern==='horizontal_pull'?4:2],['rear_delts','Задняя дельта',pattern==='horizontal_pull'?3:1],['lower_back','Поясница',pattern==='horizontal_pull'?2:1]];
  if(group==='biceps')return[['biceps','Бицепс',5],['forearms','Плечевая и предплечье',specNeutral(pattern)?3:2]];
  if(group==='legs')return[['quads','Квадрицепс',pattern==='knee_dominant'||pattern==='leg_extension'?5:1],['hamstrings','Задняя поверхность',pattern==='hip_hinge'||pattern==='leg_curl'?5:2],['glutes','Ягодицы',pattern==='hip_hinge'?5:3]];
  if(group==='shoulders')return[['side_delts','Средняя дельта',pattern==='lateral_raise'?5:2],['rear_delts','Задняя дельта',pattern==='rear_delt_fly'?5:1],['front_delts','Передняя дельта',pattern==='vertical_press'?5:1]];
  return[['target','Основная зона',4],['support','Вспомогательная работа',2]];
}
const specNeutral=(pattern:MovementPattern)=>pattern==='elbow_flexion';

function assembleExercise(muscleGroupId: MuscleGroupId, spec: SimpleSpec): WorkoutExercise {
  const stage = stageById.get(spec.stageId)!;
  const focus: ExerciseFocus = {label:spec.focusLabel ?? stage.shortTitle,metrics:(spec.metrics ?? defaultMetrics(muscleGroupId,spec.pattern)).map(([id,label,value]) => ({id,label,value})),disclaimer:FOCUS_DISCLAIMER,evidence:PRACTICE_EVIDENCE};
  const loads={...patternLoads(spec.pattern),...(spec.secondaryLoad??{})};
  const role:ProgramRole=spec.role==='strength_base'?'heavy_base':spec.role==='stable_overload'?'stable_volume':spec.role==='complementary_pattern'?'complementary_pattern':spec.role==='low_fatigue_isolation'||spec.role==='peak_contraction'||spec.role==='lengthened'?'local_work':spec.role==='secondary_muscle_focus'?'optional_specialization':'main_volume';
  const stimulusTags:StimulusTag[]=[...(spec.role==='lengthened'?['lengthened_emphasis' as const]:spec.role==='peak_contraction'?['shortened_emphasis' as const]:['mid_range_emphasis' as const]),...(spec.unilateral?['unilateral' as const]:[]),...(spec.stability==='low'?['supported' as const]:[]),...(spec.stability==='high'?['high_stability_demand' as const]:[])];
  const primary:LoadTargetId[]=muscleGroupId==='back'?(spec.pattern==='vertical_pull'||spec.pattern==='lat_isolation'?['lats']:['mid_back','upper_back']):muscleGroupId==='legs'?(spec.pattern==='hip_hinge'?['glutes','hamstrings']:spec.pattern==='calf_raise'?['calves']:['quads','glutes']):muscleGroupId==='shoulders'?(spec.pattern==='lateral_raise'?['side_delts']:spec.pattern==='rear_delt_fly'?['rear_delts']:['front_delts']):[muscleGroupId];
  return {id:spec.id,muscleGroupId,stageId:spec.stageId,name:spec.name,description:`${spec.name}: ${spec.pattern==='vertical_pull'?'тяга сверху с контролируемым движением плеча и лопатки':spec.pattern==='horizontal_pull'?'тяга к корпусу с устойчивой траекторией локтя':spec.pattern==='lat_isolation'?'движение плеча почти без сгибания локтя':spec.pattern==='leg_curl'?'прямое сгибание колена для задней поверхности бедра':spec.pattern==='lateral_raise'?'отведение плеча для средней дельты':spec.pattern==='rear_delt_fly'?'отведение плеча назад для задней дельты и мышц лопатки':spec.pattern==='elbow_flexion'?'сгибание локтя с выбранной позицией плеча и хвата':spec.pattern==='hip_hinge'?'разгибание таза с контролем корпуса и таза':'вариант движения с настраиваемой траекторией и сопротивлением'}.`,feature:stage.shortTitle,difficulty:spec.stability ?? 'medium',reps:stage.reps,sets:stage.sets,rir:stage.rir,rest:stage.rest,
    role,stimulusTags,programPurpose:`В этапе «${stage.title}» это движение даёт ${spec.pattern==='vertical_pull'?'вертикальную тягу':spec.pattern==='horizontal_pull'?'горизонтальную тягу':spec.pattern==='leg_curl'?'прямое сгибание колена':spec.pattern==='lateral_raise'?'прямую работу средней дельты':spec.pattern==='rear_delt_fly'?'работу задней дельты и лопатки':'нужный двигательный паттерн'} с учётом доступного оборудования.`,
    weightGuidance:`Вес подходит, если нижняя граница ${stage.reps} достигается с RIR ${stage.rir}, а траектория и рабочая амплитуда не меняются в последних повторениях.`,tip:`Настрой ${spec.equipment==='cable'?'высоту блока и линию тяги':spec.equipment==='machine'?'сиденье и ось тренажёра':spec.equipment==='dumbbell'?'хват и устойчивое положение корпуса':'исходное положение'} до начала рабочего подхода.`,progression:'Сначала добавляй повторения в заданном диапазоне. Достигнув верхней границы во всех подходах, повысь вес на минимальный шаг.',progressionMethod:spec.pattern==='vertical_pull'&&spec.equipment==='bodyweight'?'external_load_progression':'double_progression',
    choose:[`Доступно нужное оборудование: ${spec.equipment==='cable'?'блочная рама':spec.equipment==='barbell'?'штанга и безопасные упоры':spec.equipment==='dumbbell'?'гантели':spec.equipment==='bodyweight'?'турник или брусья':'подходящий тренажёр'}.`,'Рабочая траектория не вызывает боли и остаётся устойчивой.'],avoid:['Появляется боль, а настройка хвата или оборудования не решает проблему.'],mistakes:['Вес меняет заданную траекторию.','Рабочая амплитуда заметно сокращается к концу подхода.','Обратная фаза становится неконтролируемой.'],howto:[`Отрегулируй ${spec.equipment==='machine'?'сиденье, упоры и стартовую позицию':spec.equipment==='cable'?'высоту блока и выбранную рукоять':'опору, хват и положение корпуса'} под комфортную амплитуду.`,`Начинай каждое повторение из устойчивого положения и веди ${spec.pattern.includes('pull')?'локти по выбранной линии':'рабочий сегмент по одной траектории'}.`,'Верни сопротивление без броска, сохраняя положение суставов и корпуса.','Безопасно закончи подход до того, как техника начнёт заметно меняться.'],focus,
    participation:{primary,secondary:Object.keys(loads).filter(key=>!primary.includes(key as LoadTargetId)&&!['systemic','elbows','lower_back','grip'].includes(key)) as LoadTargetId[],stabilizers:Object.keys(loads).filter(key=>['lower_back','grip'].includes(key)) as LoadTargetId[]},
    practicalProperties:{equipment:spec.equipment??equipmentFromName(spec.name),requiresSpotter:spec.equipment==='barbell'&&(spec.pattern==='horizontal_press'||spec.pattern==='vertical_press'||spec.pattern==='knee_dominant'),lowerBackDemand:loads.lower_back?'high':'low',elbowDemand:spec.jointStress??'low',shoulderDemand:spec.pattern.includes('press')?'medium':'low',stabilityDemand:spec.stability??'medium',systemicFatigue:spec.fatigue??'medium',unilateral:spec.unilateral??false},
    profile:{movementPattern:spec.pattern,lengthenedBias:spec.role === 'lengthened' ? 5 : 2,contractionBias:spec.role === 'peak_contraction' ? 5 : 2},expectedSecondaryExposure:loads,evidence:PRACTICE_EVIDENCE,
    limitingFactors:[spec.pattern.includes('pull')?'сила хвата и сгибателей локтя':'контроль рабочей траектории',loads.lower_back?'устойчивость поясницы':'способность сохранять положение корпуса','доступная без компенсаций амплитуда'],sensations:{target:[`Рабочее напряжение в основной группе: ${primary.map(item=>item).join(', ')}.`],acceptable:['Умеренная работа вспомогательных мышц без потери траектории.'],warning:['Острая суставная боль.','Невозможность контролировать сопротивление в обратной фазе.']}};
}

const specs: Record<Exclude<MuscleGroupId,'chest'>, SimpleSpec[]> = {
  triceps:[
    {id:'triceps-rope-overhead',stageId:'triceps-overhead',name:'Разгибание рук с канатом над головой',pattern:'elbow_extension_overhead',equipment:'cable',role:'lengthened',focusLabel:'Все части трицепса · длинная головка в растяжении'},
    {id:'triceps-single-overhead',stageId:'triceps-overhead',name:'Одноручное разгибание над головой',pattern:'elbow_extension_overhead',equipment:'cable',role:'unilateral_control',unilateral:true},
    {id:'triceps-ez-extension',stageId:'triceps-overhead',name:'Французский жим EZ с локтями слегка за плечами',pattern:'elbow_extension_overhead',equipment:'barbell',role:'main_volume',fatigue:'medium',jointStress:'high'},
    {id:'triceps-rope-pushdown',stageId:'triceps-pushdown',name:'Разгибание с канатом',pattern:'elbow_extension_downward',equipment:'cable',role:'peak_contraction',fatigue:'low'},
    {id:'triceps-bar-pushdown',stageId:'triceps-pushdown',name:'Разгибание с прямой или V-рукоятью',pattern:'elbow_extension_downward',equipment:'cable',role:'stable_overload',fatigue:'low'},
    {id:'triceps-single-pushdown',stageId:'triceps-pushdown',name:'Одноручное разгибание',pattern:'elbow_extension_downward',equipment:'cable',role:'unilateral_control',fatigue:'low',unilateral:true},
    {id:'triceps-close-grip',stageId:'triceps-compound',name:'Жим узким хватом',pattern:'compound_triceps_press',equipment:'barbell',role:'strength_base',fatigue:'high',jointStress:'high'},
    {id:'triceps-dips',stageId:'triceps-compound',name:'Брусья с акцентом на трицепс',pattern:'compound_triceps_press',equipment:'bodyweight',role:'strength_base',fatigue:'high',jointStress:'high'},
  ],
  back:[
    {id:'weighted-pullup',stageId:'back-primary-pull',name:'Подтягивания с дополнительным весом',pattern:'vertical_pull',equipment:'bodyweight',role:'strength_base',fatigue:'high',stability:'high',secondaryLoad:{biceps:4}},
    {id:'barbell-row',stageId:'back-primary-pull',name:'Тяга штанги в наклоне',pattern:'horizontal_pull',equipment:'barbell',role:'strength_base',fatigue:'high',stability:'high',secondaryLoad:{biceps:3}},
    {id:'tbar-row',stageId:'back-primary-pull',name:'Тяга Т-грифа',pattern:'horizontal_pull',role:'stable_overload',fatigue:'high',secondaryLoad:{biceps:3}},
    {id:'heavy-chest-row',stageId:'back-primary-pull',name:'Тяжёлая тяга в тренажёре с упором грудью',pattern:'horizontal_pull',role:'stable_overload',stability:'low',secondaryLoad:{biceps:2}},
    {id:'neutral-pulldown-heavy',stageId:'back-primary-pull',name:'Вертикальная тяга нейтральным хватом',pattern:'vertical_pull',equipment:'cable',role:'stable_overload',secondaryLoad:{biceps:3}},
    ...['Верхний блок широким хватом','Верхний блок нейтральным хватом','Одноручная вертикальная тяга','Подтягивания без дополнительного веса'].map((name,i)=>({id:`back-vertical-${i}`,stageId:'back-complementary-pull',name,pattern:'vertical_pull' as const,role:'complementary_pattern' as const,secondaryLoad:{biceps:i===1?3:2}})),
    ...['Тяга нижнего блока','Тяга с упором грудью','Горизонтальная рычажная тяга','Тяга гантели одной рукой'].map((name,i)=>({id:`back-horizontal-${i}`,stageId:'back-complementary-pull',name,pattern:'horizontal_pull' as const,role:'complementary_pattern' as const,unilateral:i===3,secondaryLoad:{biceps:2}})),
    ...['Тяга прямыми руками','Пуловер на верхнем блоке','Пуловер в тренажёре','Лёгкая тяга с упором грудью'].map((name,i)=>({id:`back-local-${i}`,stageId:'back-local',name,pattern:i===3?'horizontal_pull' as const:'lat_isolation' as const,role:'low_fatigue_isolation' as const,fatigue:'low' as const,secondaryLoad:{biceps:i===3?1:0}})),
  ],
  biceps:[
    ...['Сгибание гантелей на наклонной скамье','Bayesian curl','Сгибание на блоке','Сгибание с гантелями стоя'].map((name,i)=>({id:`biceps-primary-${i}`,stageId:'biceps-primary',name,pattern:'elbow_flexion' as const,role:i<2?'lengthened' as const:'main_volume' as const,unilateral:i===1})),
    ...['Сгибание на скамье Скотта','Сгибание в тренажёре','Концентрированное сгибание','Молотковые сгибания','Одноручное сгибание на блоке'].map((name,i)=>({id:`biceps-complementary-${i}`,stageId:'biceps-complementary',name,pattern:'elbow_flexion' as const,role:i===0||i===1?'stable_overload' as const:i===3?'secondary_muscle_focus' as const:'main_volume' as const,stability:i<3?'low' as const:'medium' as const,unilateral:i===2||i===4})),
  ],
  legs:[
    ...['Присед со штангой','Hack squat','Жим ногами','Фронтальный присед','Присед в Смите'].map((name,i)=>({id:`legs-main-${i}`,stageId:'legs-main',name,pattern:'knee_dominant' as const,role:i===0||i===3?'strength_base' as const:'stable_overload' as const,fatigue:i===0||i===3?'high' as const:'medium' as const,stability:i===0||i===3?'high' as const:'low' as const})),
    ...['Румынская тяга','Ягодичный мост','Гиперэкстензия с акцентом на ягодицы'].map((name,i)=>({id:`legs-hip-${i}`,stageId:'legs-hip-extension',name,pattern:'hip_hinge' as const,role:i===0?'strength_base' as const:'main_volume' as const,fatigue:i===0?'high' as const:'medium' as const})),
    ...['Сгибание ног сидя','Сгибание ног лёжа','Разгибание ног','Болгарские выпады','Обратные выпады','Односторонний жим ногами'].map((name,i)=>({id:`legs-accessory-${i}`,stageId:'legs-accessory',name,pattern:i<2?'leg_curl' as const:i===2?'leg_extension' as const:'knee_dominant' as const,role:i<3?'low_fatigue_isolation' as const:'unilateral_control' as const,unilateral:i>2})),
    ...['Подъём на носки стоя','Подъём на носки сидя','Икры в жиме ногами'].map((name,i)=>({id:`legs-calves-${i}`,stageId:'legs-calves',name,pattern:'calf_raise' as const,role:'low_fatigue_isolation' as const,fatigue:'low' as const})),
  ],
  shoulders:[
    ...['Махи гантелями в стороны','Одноручные махи в кроссовере','Махи в тренажёре','Махи в кроссовере с рукой за корпусом'].map((name,i)=>({id:`shoulders-lateral-${i}`,stageId:'shoulders-lateral',name,pattern:'lateral_raise' as const,role:i===1||i===3?'unilateral_control' as const:'main_volume' as const,fatigue:'low' as const,unilateral:i===1||i===3})),
    ...['Обратный пек-дек','Разведения в кроссовере','Разведения с гантелями с упором грудью','Face pull'].map((name,i)=>({id:`shoulders-rear-${i}`,stageId:'shoulders-rear',name,pattern:'rear_delt_fly' as const,role:i===3?'complementary_pattern' as const:'peak_contraction' as const,fatigue:'low' as const})),
    ...['Жим гантелей сидя','Жим в тренажёре','Жим штанги над головой'].map((name,i)=>({id:`shoulders-press-${i}`,stageId:'shoulders-press',name,pattern:'vertical_press' as const,role:i===1?'stable_overload' as const:'strength_base' as const,fatigue:i===2?'high' as const:'medium' as const,stability:i===1?'low' as const:'medium' as const})),
  ],
};

export const workoutExercises: WorkoutExercise[] = [...chestExercises,...(Object.entries(specs) as Array<[Exclude<MuscleGroupId,'chest'>,SimpleSpec[]]>).flatMap(([group,items]) => items.map(item => assembleExercise(group,item)))];
