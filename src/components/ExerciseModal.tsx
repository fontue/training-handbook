import { useEffect } from 'react';
import { exerciseRoles } from '../config/exerciseRoles';
import type { Exercise, ExerciseRole, Stage } from '../types';

const stageLabels: Record<Stage, string> = { 1: 'Силовое', 2: 'Объём', 3: 'Изоляция' };

function InfoCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`info-card ${className}`.trim()}><h3>{title}</h3>{children}</section>;
}

function RoleBadge({ role, secondary = false }: { role: ExerciseRole; secondary?: boolean }) {
  const config = exerciseRoles[role];
  return <span className={`role-badge ${config.className}${secondary ? ' secondary' : ''}`}>{config.label}</span>;
}

function ModalCharacteristics({ exercise, className }: { exercise: Exercise; className: string }) {
  return <div className={`modal-characteristics ${className}`}>
    {[['Повторения', exercise.reps], ['Подходы', exercise.sets], ['RIR', exercise.rir], ['Отдых', exercise.rest], ['Сложность', exercise.difficulty], ['Особенность', exercise.feature]].map(([label, value]) =>
      <div className="modal-characteristic" key={label}><span>{label}</span><strong>{value}</strong></div>)}
    <div className="modal-characteristic role-characteristic"><span>Роль</span><div className="role-badges"><RoleBadge role={exercise.role} />{exercise.secondaryRole && <RoleBadge role={exercise.secondaryRole} secondary />}</div></div>
  </div>;
}

export function ExerciseModal({ exercise, selected, onClose, onSelect }: { exercise: Exercise | null; selected: boolean; onClose: () => void; onSelect: (exercise: Exercise) => void }) {
  useEffect(() => {
    if (!exercise) return;
    document.body.classList.add('modal-open');
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', closeOnEscape); };
  }, [exercise, onClose]);

  if (!exercise) return null;
  const scores = [['Верх', exercise.upper], ['Серед.', exercise.middle], ['Низ', exercise.lower]] as const;
  return <div className="modal-backdrop open" aria-hidden="false" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button className="modal-close" type="button" aria-label="Закрыть" onClick={onClose}>✕</button>
      <div className="modal-top"><div className="modal-summary"><div className="modal-kicker"><span className={`stage-tag s${exercise.stage}`}>{exercise.stage}. {stageLabels[exercise.stage]}</span><span className="page-chip">{exercise.focus}</span></div><h2 className="modal-title" id="modalTitle">{exercise.name}</h2><p className="modal-description">{exercise.description}</p><ModalCharacteristics exercise={exercise} className="desktop-characteristics" /></div><div className="modal-visual"><div className="exercise-figure" /><div className="visual-caption">Место для фото или короткой анимации техники упражнения</div></div></div>
      <ModalCharacteristics exercise={exercise} className="mobile-characteristics" />
      <div className="modal-body">
        <div className="modal-focus"><div><strong>{exercise.focus}</strong><span className="muted">Распределение акцента</span></div><div className="focus-bars">{scores.map(([label, value]) => <div className="focus-row" key={label}><span>{label}</span><span className="focus-track"><span className="focus-fill" style={{ width: `${value * 20}%` }} /></span><span className="focus-score">{value}/5</span></div>)}</div></div>
        <div className="modal-grid"><InfoCard title="Зачем это упражнение в программе" className="role-description"><p>{exercise.roleDescription}</p></InfoCard><InfoCard title="Как выполнять" className="howto"><ol>{exercise.howto.map(item => <li key={item}>{item}</li>)}</ol></InfoCard><InfoCard title="Подсказка тренера"><p>{exercise.tip}</p></InfoCard><InfoCard title="Прогрессия"><p>{exercise.progression}</p></InfoCard><InfoCard title="Когда выбирать"><ul>{exercise.choose.map(item => <li key={item}>{item}</li>)}</ul></InfoCard><InfoCard title="Когда не выбирать"><ul>{exercise.avoid.map(item => <li key={item}>{item}</li>)}</ul></InfoCard><InfoCard title="Частые ошибки"><ul>{exercise.mistakes.map(item => <li key={item}>{item}</li>)}</ul></InfoCard><InfoCard title="Как понять, что вес подходит"><p>{exercise.weight}</p></InfoCard></div>
        <button className={`modal-select-exercise${selected ? ' selected' : ''}`} type="button" onClick={() => onSelect(exercise)}>{selected ? 'Выбрано' : 'Выбрать упражнение'}</button>
      </div>
    </div>
  </div>;
}
