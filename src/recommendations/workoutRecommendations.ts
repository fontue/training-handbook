import type { ExerciseStage, LoadLevel, LoadTargetId, MuscleGroupId, SecondaryGroupContext, WorkoutExercise, WorkoutRecommendation } from '../types/workout';

const levelValue:Record<LoadLevel,number>={low:1,medium:2,high:3};
const toLevel=(value:number):LoadLevel=>value>=8?'high':value>=4?'medium':'low';
const sets=(value:string)=>Number.parseInt(value,10)||3;
const effort=(rir:string)=>rir.startsWith('0')?1.15:rir.startsWith('1')?1:rir.startsWith('2')?.85:.7;
const exposure=(exercise:WorkoutExercise,target:LoadTargetId,index:number)=>(exercise.expectedSecondaryExposure[target]??0)*sets(exercise.sets)*effort(exercise.rir)*(index===0?1:.9)/3;

export function getSecondaryGroupContext(primaryExercises:WorkoutExercise[],secondaryMuscleGroupId:MuscleGroupId):SecondaryGroupContext{
  const total=(target:LoadTargetId)=>primaryExercises.reduce((sum,exercise,index)=>sum+exposure(exercise,target,index),0);
  const exposureLevel=toLevel(total(secondaryMuscleGroupId));
  const maxProperty=(key:'lowerBackDemand'|'elbowDemand'|'shoulderDemand'|'systemicFatigue'):LoadLevel=>primaryExercises.reduce<LoadLevel>((max,item)=>levelValue[item.practicalProperties[key]]>levelValue[max]?item.practicalProperties[key]:max,'low');
  const grip=toLevel(total('grip'));
  return{exposureLevel,jointLoad:{lowerBack:maxProperty('lowerBackDemand'),grip,elbows:maxProperty('elbowDemand'),shoulders:maxProperty('shoulderDemand'),systemic:maxProperty('systemicFatigue')},notes:[exposureLevel==='high'?'Второстепенная группа уже заметно участвовала в основных упражнениях.':exposureLevel==='medium'?'Второстепенная группа получила умеренное косвенное участие.':'Косвенное участие второстепенной группы остаётся невысоким.']};
}

export function getIntraGroupRecommendations({muscleGroupId,stage,selectedExercises,candidates,secondaryContext}:{muscleGroupId:MuscleGroupId;stage:ExerciseStage;selectedExercises:WorkoutExercise[];candidates:WorkoutExercise[];secondaryContext?:SecondaryGroupContext}):WorkoutRecommendation[]{
  const previous=selectedExercises.at(-1);const patterns=new Set(selectedExercises.map(item=>item.profile.movementPattern));
  return candidates.map(candidate=>{let score=0;const reasons:string[]=[];let rule='Базовое сравнение профиля упражнения.';
    const pattern=candidate.profile.movementPattern;const props=candidate.practicalProperties;
    if(previous&&previous.profile.movementPattern!==pattern){score+=2;reasons.push(previous.profile.movementPattern==='horizontal_press'&&pattern==='incline_press'?'После горизонтального жима добавляет работу верхней части груди.':previous.profile.movementPattern==='vertical_pull'&&pattern==='horizontal_pull'?'После вертикальной тяги добавляет горизонтальное направление.':previous.profile.movementPattern==='horizontal_pull'&&pattern==='vertical_pull'?'После горизонтальной тяги добавляет вертикальное направление.':'Дополняет предыдущее движение другой траекторией.');rule='Дополнение предыдущего направления движения.';}
    if(previous&&previous.practicalProperties.lowerBackDemand==='high'&&props.lowerBackDemand==='low'){score+=2;reasons.push('После тяги без опоры снижает нагрузку на уставшую поясницу.');rule='После высокой нагрузки на поясницу повышается вариант с опорой.';}
    if(selectedExercises.filter(item=>(item.expectedSecondaryExposure.biceps??0)>=2).length>=2&&(pattern==='lat_isolation')){score+=3;reasons.push('Бицепс уже участвовал в двух тягах, поэтому движение прямыми руками меньше его ограничивает.');rule='После двух тяг повышается локальная работа широчайших.';}
    if(muscleGroupId==='legs'&&selectedExercises.some(item=>item.profile.movementPattern==='hip_hinge')&&pattern==='leg_curl'){score+=3;reasons.push('После разгибания таза добавляет сгибание колена, которого ещё не было.');rule='Тазобедренное движение дополняется сгибанием колена.';}
    if(muscleGroupId==='triceps'&&secondaryContext?.exposureLevel==='high'){if(pattern==='compound_triceps_press'){score-=4;reasons.push('Трицепс уже получил высокую нагрузку в грудных жимах.');rule='После двух грудных жимов тяжёлый жим на трицепс понижается.';}else{score+=2;reasons.push('После грудных жимов добавляет локальную работу без ещё одного тяжёлого жима.');rule='После грудных жимов повышаются блоковые разгибания.';}}
    if(muscleGroupId==='shoulders'&&stage.optional&&props.systemicFatigue==='high'){score-=2;reasons.push('После тяжёлой тренировки ног дополнительный жим создаёт высокую общую усталость.');}
    if(patterns.has(pattern)){score-=1;if(reasons.length<2)reasons.push('Частично повторяет уже выбранное направление движения.');}
    if(props.systemicFatigue==='low'){score+=1;if(reasons.length<2)reasons.push('Добавляет работу с невысокой общей усталостью.');}
    if(stage.optional&&reasons.length<2)reasons.push('Это необязательный объём — добавляй его при достаточном восстановлении.');
    const status=score>=3?'recommended':score<=-1?'not_ideal':'suitable';return{exerciseId:candidate.id,status,reasons:[...new Set(reasons)].slice(0,2),score,confidence:'moderate',rule};
  });
}
export function sortWorkoutRecommendations(items:WorkoutExercise[],recommendations:WorkoutRecommendation[]){const map=new Map(recommendations.map(r=>[r.exerciseId,r]));const order={recommended:0,suitable:1,not_ideal:2};return[...items].sort((a,b)=>{const ar=map.get(a.id),br=map.get(b.id);return ar&&br?order[ar.status]-order[br.status]||br.score-ar.score:0;});}
