import { RecommendationBadge } from './RecommendationBadge';
import { stimulusTagLabels, universalExerciseRoles } from '../config/universalExerciseRoles';
import type { WorkoutExercise, WorkoutRecommendation } from '../types/workout';

const negativeReason=(reason:string)=>/повтор|устал|тяж[её]л|достаточн|не лучший/i.test(reason);

export function CompactExerciseCard({exercise,recommendation,selected,onOpen,onSelect}:{exercise:WorkoutExercise;recommendation?:WorkoutRecommendation;selected:boolean;onOpen:()=>void;onSelect:()=>void}){
  const primary=universalExerciseRoles[exercise.role];
  const secondary=exercise.stimulusTags[0]?stimulusTagLabels[exercise.stimulusTags[0]]:null;
  return <article className={`exercise-card compact-exercise-card panel${selected?' selected':''}`} onClick={onOpen}>
    <div className="exercise-card-head"><div><h3>{exercise.name}</h3>{recommendation&&<RecommendationBadge status={recommendation.status}/>}</div><button className={`select-exercise${selected?' selected':''}`} onClick={event=>{event.stopPropagation();if(!selected)onSelect();}}>{selected?'Выбрано':'Выбрать'}</button></div>
    <div className="exercise-card-facts"><div><span>Повторы</span><strong>{exercise.reps}</strong></div><div><span>Ориентировочный акцент</span><strong>{exercise.focus.label}</strong></div></div>
    <div className="card-role-badges"><span className={`role-badge ${primary.className}`}>{primary.label}</span>{secondary&&<span className={`role-badge secondary ${secondary.className}`}>{secondary.label}</span>}</div>
    <div className="focus-cell compact"><div className="focus-bars">{exercise.focus.metrics.map(metric=><div className="focus-row" key={metric.id}><span>{metric.label}</span><span className="focus-track"><span className="focus-fill" style={{width:`${metric.value*20}%`}}/></span><span className="focus-score">{metric.value}/5</span></div>)}</div></div>
    {recommendation&&<div className="recommendation-reason"><strong>Оценка сочетания</strong><ul>{recommendation.reasons.slice(0,2).map(reason=><li className={recommendation.status==='not_ideal'||negativeReason(reason)?'negative':'positive'} key={reason}>{reason}</li>)}</ul><div className="recommendation-explanation"><strong>Почему приложение так считает</strong><p>{recommendation.rule} Уверенность: {recommendation.confidence==='moderate'?'умеренная':'ограниченная'}.</p></div></div>}
  </article>;
}
