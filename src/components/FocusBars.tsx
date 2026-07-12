import type { Exercise } from '../types';

export function FocusBars({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  const rows = [['Верх', exercise.upper], ['Серед.', exercise.middle], ['Низ', exercise.lower]] as const;
  return <div className={`focus-cell${compact ? ' compact' : ''}`}>
    <div className="focus-bars">{rows.map(([label, value]) =>
      <div className="focus-row" key={label}>
        <span>{label}</span><span className="focus-track"><span className="focus-fill" style={{ width: `${value * 20}%` }} /></span><span className="focus-score">{value}/5</span>
      </div>)}</div>
  </div>;
}
