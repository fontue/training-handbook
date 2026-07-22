import { CompactExerciseCard } from './CompactExerciseCard';
import type { ExerciseStage, WorkoutExercise, WorkoutRecommendation } from '../types/workout';

interface ExerciseStepProps {
  stepNumber:number;
  total:number;
  stage:ExerciseStage;
  candidates:WorkoutExercise[];
  recommendations:Map<string,WorkoutRecommendation>;
  selectedId?:string;
  skipped:boolean;
  onOpen:(exercise:WorkoutExercise)=>void;
  onSelect:(exercise:WorkoutExercise)=>void;
  onSkip:()=>void;
}

export function ExerciseStep({stepNumber,total,stage,candidates,recommendations,selectedId,skipped,onOpen,onSelect,onSkip}:ExerciseStepProps){
  return <section className="active-exercise-step"><header className="workout-step-header"><span>Шаг {stepNumber} из {total}{stage.optional?' · необязательно':''}</span><h1>{stage.title}</h1><p>{stage.description}</p></header><div className="exercise-card-grid">{candidates.map(exercise=><CompactExerciseCard key={exercise.id} exercise={exercise} recommendation={recommendations.get(exercise.id)} selected={selectedId===exercise.id} onOpen={()=>onOpen(exercise)} onSelect={()=>onSelect(exercise)}/>)}</div>{stage.optional&&<div className="optional-step-action"><button className="skip-stage-button" onClick={onSkip}>{skipped?'Оставить пропущенным':'Пропустить этап'}</button></div>}</section>;
}
