import { useState } from 'react';
import type { Stage, WorkoutSelection } from '../types';

export function CurrentWorkout({ selection, onClear }: { selection: WorkoutSelection; onClear: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const selectedCount = Object.keys(selection).length;
  const copyWorkout = async () => {
    if (!selectedCount) return;
    const text = ([1, 2, 3] as Stage[]).filter(stage => selection[stage]).map(stage => `${stage}. ${selection[stage]!.name}`).join('\n');
    await navigator.clipboard.writeText(`Грудь\n\n${text}`);
  };
  return <aside className={`current-workout panel${expanded ? ' expanded' : ''}`}>
    <button className="current-workout-toggle" type="button" onClick={() => setExpanded(value => !value)}><span><strong>Текущая тренировка</strong><small>{selectedCount} из 3</small></span><span>{expanded ? '−' : '+'}</span></button>
    <div className="current-workout-content">
      {([1, 2, 3] as Stage[]).map(stage => <div className="workout-slot" key={stage}><small>{stage} этап</small><strong>{selection[stage]?.name ?? 'Не выбрано'}</strong></div>)}
      <div className="workout-actions"><button type="button" onClick={copyWorkout} disabled={!selectedCount}>Копировать</button><button type="button" onClick={onClear} disabled={!selectedCount}>Очистить</button></div>
    </div>
  </aside>;
}
