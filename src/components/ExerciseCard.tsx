import { exerciseRoles } from '../config/exerciseRoles';
import type { Exercise, ExerciseRecommendation } from '../types';
import { FocusBars } from './FocusBars';
import { RecommendationBadge } from './RecommendationBadge';

export function ExerciseCard({ exercise, recommendation, selected, onOpen, onSelect }: {
  exercise: Exercise;
  recommendation?: ExerciseRecommendation;
  selected: boolean;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const primaryRole = exerciseRoles[exercise.role];
  const secondaryRole = exercise.secondaryRole ? exerciseRoles[exercise.secondaryRole] : null;

  return <article className={`exercise-card panel${selected ? ' selected' : ''}`} role="button" tabIndex={0} onClick={onOpen} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') onOpen(); }}>
    <div className="exercise-card-head">
      <div><h3>{exercise.name}</h3>{recommendation && <RecommendationBadge status={recommendation.status} />}</div>
      <button className={`select-exercise${selected ? ' selected' : ''}`} type="button" onKeyDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onSelect(); }}>{selected ? 'Выбрано' : 'Выбрать'}</button>
    </div>
    <div className="exercise-card-facts">
      <div><span>Повторы</span><strong>{exercise.reps}</strong></div>
      <div><span>Акцент</span><strong>{exercise.focus}</strong></div>
    </div>
    <div className="card-role-badges"><span className={`role-badge ${primaryRole.className}`}>{primaryRole.label}</span>{secondaryRole && <span className={`role-badge secondary ${secondaryRole.className}`}>{secondaryRole.label}</span>}</div>
    <FocusBars exercise={exercise} compact />
    <div className="exercise-card-weight"><strong>Как понять, что вес подходит</strong><p>{exercise.weight}</p></div>
    {recommendation && <div className="recommendation-reason"><strong>Почему такой статус</strong>{recommendation.reasons.map(reason => <p key={reason}>{reason}</p>)}</div>}
  </article>;
}
