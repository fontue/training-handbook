import type { Exercise, ExerciseRecommendation, Stage } from '../types';
import { ExerciseCard } from './ExerciseCard';

const stageMeta: Record<Stage, { title: string; description: string; reps: string }> = {
  1: { title: 'Силовое', description: 'Основная прогрессия по силе и механическому напряжению.', reps: '5–8 повторений' },
  2: { title: 'Основной объём', description: 'Гипертрофийная работа, дополняющая первое упражнение.', reps: '8–12 повторений' },
  3: { title: 'Изоляция', description: 'Контролируемая работа на недостающий профиль нагрузки.', reps: '12–15 повторений' },
};

export function ExerciseSection({ stage, exercises, recommendations, selectedId, onOpen, onSelect }: {
  stage: Stage;
  exercises: Exercise[];
  recommendations: ExerciseRecommendation[];
  selectedId?: string;
  onOpen: (exercise: Exercise) => void;
  onSelect: (exercise: Exercise) => void;
}) {
  const meta = stageMeta[stage];
  const recommendationById = new Map(recommendations.map(item => [item.exerciseId, item]));
  return <section className="exercise-stage-section">
    <header className="exercise-stage-head"><div><span className={`stage-tag s${stage}`}>{stage}. {meta.title}</span><h2>{meta.title}</h2><p>{meta.description}</p></div><strong>{meta.reps}</strong></header>
    <div className="exercise-card-grid">{exercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} recommendation={recommendationById.get(exercise.id)} selected={selectedId === exercise.id} onOpen={() => onOpen(exercise)} onSelect={() => onSelect(exercise)} />)}</div>
  </section>;
}
