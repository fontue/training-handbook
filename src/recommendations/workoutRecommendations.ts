import type { ExerciseStage, LoadLevel, MuscleGroupId, SecondaryGroupContext, WorkoutExercise, WorkoutRecommendation } from '../types/workout';

const levelValue: Record<LoadLevel,number> = {low:1,medium:2,high:3};
export function getSecondaryGroupContext(primaryExercises: WorkoutExercise[], secondaryMuscleGroupId: MuscleGroupId): SecondaryGroupContext {
  const indirectLoad = primaryExercises.reduce((sum,exercise)=>sum+(exercise.secondaryLoad[secondaryMuscleGroupId]??0),0);
  const fatigueLevel: LoadLevel = indirectLoad >= 8 ? 'high' : indirectLoad >= 4 ? 'medium' : 'low';
  return {indirectLoad,fatigueLevel,notes:indirectLoad>=8?[`${secondaryMuscleGroupId==='triceps'?'Трицепс':'Бицепс'} уже получил высокую косвенную нагрузку.`]:indirectLoad>=4?['Второстепенная группа уже участвовала в основных движениях.']:['Косвенная нагрузка остаётся невысокой.']};
}

export function getIntraGroupRecommendations({stage,selectedExercises,candidates,secondaryContext}:{muscleGroupId:MuscleGroupId;stage:ExerciseStage;selectedExercises:WorkoutExercise[];candidates:WorkoutExercise[];secondaryContext?:SecondaryGroupContext}):WorkoutRecommendation[]{
  const previous=selectedExercises.at(-1);
  return candidates.map(candidate=>{let score=0;const reasons:string[]=[];
    if(previous){if(previous.profile.movementPattern!==candidate.profile.movementPattern){score+=2;reasons.push('Меняет профиль движения после предыдущего этапа.');}else{score-=1;reasons.push('Частично повторяет уже выполненный профиль.');}if(previous.profile.stabilityDemand==='high'&&candidate.profile.stabilityDemand==='low'){score+=2;reasons.push('Снижает требования к стабилизации.');}}
    if(candidate.profile.systemicFatigue==='low'){score+=1;reasons.push('Добавляет локальную работу с низкой общей усталостью.');}
    if(secondaryContext?.fatigueLevel==='high'){if(candidate.profile.movementPattern==='horizontal_press'||candidate.profile.systemicFatigue==='high'){score-=3;reasons.push('После основной группы дополнительное тяжёлое движение создаёт лишнюю усталость.');}else if(candidate.profile.stabilityDemand==='low'){score+=2;reasons.push('Учитывает уже полученную косвенную нагрузку.');}}
    if(stage.optional) reasons.push('Опциональный объём — добавляй при наличии времени.');
    const status=score>=3?'recommended':score<=-1?'not_ideal':'suitable';return{exerciseId:candidate.id,status,reasons:[...new Set(reasons)].slice(0,2),score};});
}
export function sortWorkoutRecommendations(items:WorkoutExercise[],recommendations:WorkoutRecommendation[]){const map=new Map(recommendations.map(r=>[r.exerciseId,r]));const order={recommended:0,suitable:1,not_ideal:2};return[...items].sort((a,b)=>{const ar=map.get(a.id),br=map.get(b.id);return ar&&br?order[ar.status]-order[br.status]||br.score-ar.score:0;});}
