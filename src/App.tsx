import { useEffect, useMemo, useState } from 'react';
import { exercises } from './data/exercises';
import type { Exercise, Stage, TrainingPlan } from './types';

const stageLabels: Record<Stage, string> = {
  1: 'Силовое',
  2: 'Объём',
  3: 'Изоляция',
};

const initialPlan: TrainingPlan = { 1: null, 2: null, 3: null };

function StageCards() {
  const stages = [
    { number: 1, badge: 'Силовое', title: 'Тяжёлое базовое', text: 'Первое упражнение. Основная прогрессия по силе и рабочему весу.', reps: '5–8', sets: '3–4', rir: '1–2 RIR', rest: '2–3 мин', note: 'Вес подходит, если нижняя граница достигается без потери техники.' },
    { number: 2, badge: 'Основной объём', title: 'Средне-тяжёлый жим', text: 'Второе упражнение. Основная гипертрофийная работа без силового отказа.', reps: '8–12', sets: '3–4', rir: '1–2 RIR', rest: '90–120 сек', note: 'Последние повторы тяжёлые, но траектория остаётся стабильной.' },
    { number: 3, badge: 'Изоляция', title: 'Контроль и добивка', text: 'Третье упражнение. Минимум лишнего движения, максимум контроля грудных.', reps: '12–15', sets: '3–4', rir: '0–1 RIR', rest: '60–90 сек', note: 'Если амплитуда уменьшается или подключается корпус — вес завышен.' },
  ];

  return <div className="panel stages">
    {stages.map(stage => <article className="stage" key={stage.number}>
      <div className="stage-top"><div className="stage-number">{stage.number}</div><div className="stage-badge">{stage.badge}</div></div>
      <h3>{stage.title}</h3><p>{stage.text}</p>
      <div className="stage-grid">
        <div className="metric"><span>Повторения</span><strong>{stage.reps}</strong></div>
        <div className="metric"><span>Подходы</span><strong>{stage.sets}</strong></div>
        <div className="metric"><span>Запас</span><strong>{stage.rir}</strong></div>
        <div className="metric"><span>Отдых</span><strong>{stage.rest}</strong></div>
      </div>
      <div className="stage-note">{stage.note}</div>
    </article>)}
  </div>;
}

function FocusBars({ exercise }: { exercise: Exercise }) {
  const rows = [['Верх', exercise.upper], ['Серед.', exercise.middle], ['Низ', exercise.lower]] as const;
  return <div className="focus-cell">
    <div className="focus-title">{exercise.focus}</div>
    <div className="focus-bars">{rows.map(([label, value]) =>
      <div className="focus-row" key={label}>
        <span>{label}</span><span className="focus-track"><span className="focus-fill" style={{ width: `${value * 20}%` }} /></span><span className="focus-score">{value}/5</span>
      </div>)}</div>
  </div>;
}

function ExerciseTable({ items, onOpen }: { items: Exercise[]; onOpen: (exercise: Exercise) => void }) {
  return <div className="panel table-wrap"><table>
    <thead><tr><th>Этап</th><th>Упражнение</th><th>Повторы</th><th>Как понять, что вес подходит</th><th /></tr></thead>
    <tbody>{items.map((exercise, index) => <tr key={`${exercise.stage}-${exercise.name}-${index}`} onClick={() => onOpen(exercise)}>
      <td><span className={`stage-tag s${exercise.stage}`}>{exercise.stage}. {stageLabels[exercise.stage]}</span></td>
      <td><div className="exercise-name">{exercise.name}</div><FocusBars exercise={exercise} /></td>
      <td><strong>{exercise.reps}</strong></td>
      <td><div className="weight-fit">{exercise.weight}</div></td>
      <td><button className="open-btn" type="button">Подробнее</button></td>
    </tr>)}</tbody>
  </table></div>;
}

function CurrentWorkout({ plan, status, onCopy, onClear }: { plan: TrainingPlan; status: string; onCopy: () => void; onClear: () => void }) {
  const details: Record<Stage, string> = { 1: '1. Силовое · 4 × 5–8', 2: '2. Основной объём · 4 × 8–12', 3: '3. Изоляция · 4 × 12–15' };
  return <aside className="panel">
    <h2>Текущая тренировка</h2>
    {([1, 2, 3] as Stage[]).map(stage => <div className="slot" key={stage}>
      <small>{details[stage]}</small><strong className={plan[stage] ? '' : 'empty'}>{plan[stage]?.name ?? 'Не выбрано'}</strong>
    </div>)}
    <div className="plan-actions"><button className="primary" type="button" onClick={onCopy}>Копировать</button><button type="button" onClick={onClear}>Очистить</button></div>
    <div className="note">{status}</div>
  </aside>;
}

function InfoCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`info-card ${className}`.trim()}><h3>{title}</h3>{children}</section>;
}

function ExerciseModal({ exercise, onClose, onAdd }: { exercise: Exercise | null; onClose: () => void; onAdd: (exercise: Exercise) => void }) {
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
      <div className="modal-top">
        <div className="modal-summary">
          <div className="modal-kicker"><span className={`stage-tag s${exercise.stage}`}>{exercise.stage}. {stageLabels[exercise.stage]}</span><span className="page-chip">{exercise.focus}</span></div>
          <h2 className="modal-title" id="modalTitle">{exercise.name}</h2><p className="modal-description">{exercise.description}</p>
          <div className="modal-characteristics">
            {[['Повторения', exercise.reps], ['Подходы', exercise.sets], ['RIR', exercise.rir], ['Отдых', exercise.rest], ['Сложность', exercise.difficulty], ['Особенность', exercise.feature]].map(([label, value]) =>
              <div className="modal-characteristic" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
        </div>
        <div className="modal-visual"><div className="exercise-figure" /><div className="visual-caption">Место для фото или короткой анимации техники упражнения</div></div>
      </div>
      <div className="modal-body">
        <div className="modal-focus"><div><strong>{exercise.focus}</strong><span className="muted">Распределение акцента</span></div>
          <div className="focus-bars">{scores.map(([label, value]) => <div className="focus-row" key={label}><span>{label}</span><span className="focus-track"><span className="focus-fill" style={{ width: `${value * 20}%` }} /></span><span className="focus-score">{value}/5</span></div>)}</div>
        </div>
        <div className="modal-grid">
          <InfoCard title="Как выполнять" className="howto"><ol>{exercise.howto.map(item => <li key={item}>{item}</li>)}</ol></InfoCard>
          <InfoCard title="Подсказка тренера"><p>{exercise.tip}</p></InfoCard>
          <InfoCard title="Прогрессия"><p>{exercise.progression}</p></InfoCard>
          <InfoCard title="Когда выбирать"><ul>{exercise.choose.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Когда не выбирать"><ul>{exercise.avoid.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Частые ошибки"><ul>{exercise.mistakes.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Как понять, что вес подходит"><p>{exercise.weight}</p></InfoCard>
        </div>
        <div className="plan-actions" style={{ marginTop: 18, maxWidth: 360 }}><button className="primary" type="button" onClick={() => onAdd(exercise)}>Добавить в тренировку</button><button type="button" onClick={onClose}>Закрыть</button></div>
      </div>
    </div>
  </div>;
}

export function App() {
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState('');
  const [focus, setFocus] = useState('');
  const [plan, setPlan] = useState<TrainingPlan>(initialPlan);
  const [status, setStatus] = useState('Открой карточку упражнения и добавь его в тренировку.');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

  const filtered = useMemo(() => exercises.filter(exercise => {
    const haystack = `${exercise.name} ${exercise.focus} ${exercise.feature} ${exercise.description}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (!stage || String(exercise.stage) === stage) && (!focus || exercise.focus === focus);
  }), [query, stage, focus]);

  const resetFilters = () => { setQuery(''); setStage(''); setFocus(''); };
  const clearPlan = () => { setPlan({ ...initialPlan }); setStatus('Выбор очищен.'); };
  const addExercise = (exercise: Exercise) => { setPlan(previous => ({ ...previous, [exercise.stage]: exercise })); setStatus(`Этап ${exercise.stage}: ${exercise.name}`); setCurrentExercise(null); };
  const copyPlan = async () => {
    if (!plan[1] || !plan[2] || !plan[3]) { setStatus('Сначала выбери упражнение для каждого этапа.'); return; }
    const text = `Грудь\n\n1. ${plan[1].name}\n4×5–8 · отдых 2–3 мин\n\n2. ${plan[2].name}\n4×8–12 · отдых 90–120 сек\n\n3. ${plan[3].name}\n4×12–15 · отдых 60–90 сек`;
    try { await navigator.clipboard.writeText(text); setStatus('Тренировка скопирована.'); } catch { setStatus('Браузер не разрешил автоматическое копирование.'); }
  };

  return <>
    <nav className="topbar"><div className="topbar-inner"><div className="brand"><div className="brand-mark">TH</div><span>Training Handbook</span></div><div className="tabs"><a href="#stages">Этапы</a><a href="#exercises">Упражнения</a><a href="#weight">Прогрессия</a></div></div></nav>
    <main className="shell">
      <header className="page-head"><div><h1>Грудь</h1><p>Справочник для выбора упражнения по этапу, повторениям и текущему состоянию.</p></div><div className="page-chip"><span className="dot" /> 12 упражнений</div></header>
      <section className="section" id="stages"><div className="section-title"><h2>Этапы тренировки</h2><p>Выбирай по одному упражнению из каждого этапа.</p></div><StageCards /></section>
      <section className="section" id="exercises">
        <div className="section-title"><h2>Упражнения</h2><p>Нажми на строку или кнопку «Подробнее», чтобы открыть карточку упражнения.</p></div>
        <div className="panel toolbar"><input type="search" placeholder="Поиск упражнения…" value={query} onChange={event => setQuery(event.target.value)} /><select value={stage} onChange={event => setStage(event.target.value)}><option value="">Все этапы</option><option value="1">1. Силовое</option><option value="2">2. Основной объём</option><option value="3">3. Изоляция</option></select><select value={focus} onChange={event => setFocus(event.target.value)}><option value="">Любой акцент</option><option value="Вся грудь">Вся грудь</option><option value="Верх груди">Верх груди</option><option value="Средняя часть">Средняя часть</option><option value="Нижняя часть">Нижняя часть</option></select><button type="button" onClick={resetFilters}>Сбросить</button></div>
        <div className="layout"><section><p className="count">Показано: {filtered.length} из {exercises.length}</p><ExerciseTable items={filtered} onOpen={setCurrentExercise} /></section><CurrentWorkout plan={plan} status={status} onCopy={copyPlan} onClear={clearPlan} /></div>
      </section>
      <section className="section" id="weight"><div className="section-title"><h2>Прогрессия и рабочий вес</h2><p>Общие правила применяются к этапу, а детали — внутри карточки упражнения.</p></div><div className="rules"><article className="panel rule bad"><strong>Вес слишком большой</strong><p>Не достигаешь нижней границы, сокращаешь амплитуду или теряешь контроль — снизь вес на 5–10%.</p></article><article className="panel rule good"><strong>Вес подходит</strong><p>Попадаешь в нужный диапазон и в конце подхода сохраняешь заданный запас повторений.</p></article><article className="panel rule"><strong>Вес можно увеличить</strong><p>Достиг верхней границы во всех рабочих подходах с чистой техникой — добавь минимальный доступный шаг.</p></article></div><div className="panel coach-tip"><strong>Логика тренировки</strong><p>Одного тяжёлого жима обычно достаточно. Второе упражнение лучше использовать для объёма, а третье — для контролируемой изоляции.</p></div></section>
      <footer className="footer">Training Handbook · Грудь</footer>
    </main>
    <ExerciseModal exercise={currentExercise} onClose={() => setCurrentExercise(null)} onAdd={addExercise} />
  </>;
}
