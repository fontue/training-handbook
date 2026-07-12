import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { exerciseRoles } from '../config/exerciseRoles';
import { exercises } from '../data/exercises';
import type { Exercise, ExerciseRole, Stage } from '../types';

const stageLabels: Record<Stage, string> = {
  1: 'Силовое',
  2: 'Объём',
  3: 'Изоляция',
};

function StageCards() {
  const stages = [
    { number: 1, badge: 'Силовое', title: 'Тяжёлое базовое', text: 'Первое упражнение. Основная прогрессия по силе и рабочему весу.', reps: '5–8', sets: '3–4', rir: '1–2 RIR', rest: '2–3 мин', note: 'Вес подходит, если нижняя граница достигается без потери техники.' },
    { number: 2, badge: 'Основной объём', title: 'Средне-тяжёлый жим', text: 'Второе упражнение. Основная гипертрофийная работа без силового отказа.', reps: '8–12', sets: '3–4', rir: '1–2 RIR', rest: '90–120 сек', note: 'Последние повторы тяжёлые, но траектория остаётся стабильной.' },
    { number: 3, badge: 'Изоляция', title: 'Контроль и добивка', text: 'Третье упражнение. Минимум лишнего движения, максимум контроля грудных.', reps: '12–15', sets: '3–4', rir: '0–1 RIR', rest: '60–90 сек', note: 'Если амплитуда уменьшается или подключается корпус — вес завышен.' },
  ];

  return <div className="panel stages">
    {stages.map(stage => <article className="stage" key={stage.number}>
      <div className="stage-top"><div className="stage-number">{stage.number}</div><div className={`stage-tag s${stage.number}`}>{stage.badge}</div></div>
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
    <thead><tr><th>Этап</th><th>Упражнение</th><th>Акцент</th><th>Повторы</th></tr></thead>
    <tbody>{items.map((exercise, index) => <tr key={`${exercise.stage}-${exercise.name}-${index}`} onClick={() => onOpen(exercise)}>
      <td><span className={`stage-tag table-stage-tag s${exercise.stage}`}><span>{exercise.stage}</span><span className="table-stage-label">. {stageLabels[exercise.stage]}</span></span></td>
      <td><div className="mobile-exercise-stage"><span className={`stage-tag s${exercise.stage}`}>{exercise.stage}. {stageLabels[exercise.stage]}</span></div><div className="exercise-name">{exercise.name}</div></td>
      <td><FocusBars exercise={exercise} /></td>
      <td><strong>{exercise.reps}</strong></td>
    </tr>)}</tbody>
  </table></div>;
}

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
    <div className="modal-characteristic role-characteristic">
      <span>Роль</span>
      <div className="role-badges"><RoleBadge role={exercise.role} />{exercise.secondaryRole && <RoleBadge role={exercise.secondaryRole} secondary />}</div>
    </div>
  </div>;
}

type ReferenceModalType = 'stages' | 'progression';

function ReferenceModal({ type, onClose }: { type: ReferenceModalType | null; onClose: () => void }) {
  useEffect(() => {
    if (!type) return;
    document.body.classList.add('modal-open');
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', closeOnEscape); };
  }, [type, onClose]);

  if (!type) return null;
  const isStages = type === 'stages';

  return <div className="modal-backdrop open" aria-hidden="false" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <div className="modal reference-modal" role="dialog" aria-modal="true" aria-labelledby="referenceModalTitle">
      <button className="modal-close" type="button" aria-label="Закрыть" onClick={onClose}>✕</button>
      <div className="reference-modal-head">
        <h2 id="referenceModalTitle">{isStages ? 'Этапы тренировки' : 'Прогрессия и рабочий вес'}</h2>
        <p>{isStages ? 'Выбирай по одному упражнению из каждого этапа.' : 'Общие правила применяются к этапу, а детали — внутри карточки упражнения.'}</p>
      </div>
      <div className="reference-modal-body">
        {isStages ? <StageCards /> : <><div className="rules"><article className="panel rule bad"><strong>Вес слишком большой</strong><p>Не достигаешь нижней границы, сокращаешь амплитуду или теряешь контроль — снизь вес на 5–10%.</p></article><article className="panel rule good"><strong>Вес подходит</strong><p>Попадаешь в нужный диапазон и в конце подхода сохраняешь заданный запас повторений.</p></article><article className="panel rule"><strong>Вес можно увеличить</strong><p>Достиг верхней границы во всех рабочих подходах с чистой техникой — добавь минимальный доступный шаг.</p></article></div><div className="panel coach-tip"><strong>Логика тренировки</strong><p>Одного тяжёлого жима обычно достаточно. Второе упражнение лучше использовать для объёма, а третье — для контролируемой изоляции.</p></div></>}
      </div>
    </div>
  </div>;
}

function ExerciseModal({ exercise, onClose }: { exercise: Exercise | null; onClose: () => void }) {
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
          <ModalCharacteristics exercise={exercise} className="desktop-characteristics" />
        </div>
        <div className="modal-visual"><div className="exercise-figure" /><div className="visual-caption">Место для фото или короткой анимации техники упражнения</div></div>
      </div>
      <ModalCharacteristics exercise={exercise} className="mobile-characteristics" />
      <div className="modal-body">
        <div className="modal-focus"><div><strong>{exercise.focus}</strong><span className="muted">Распределение акцента</span></div>
          <div className="focus-bars">{scores.map(([label, value]) => <div className="focus-row" key={label}><span>{label}</span><span className="focus-track"><span className="focus-fill" style={{ width: `${value * 20}%` }} /></span><span className="focus-score">{value}/5</span></div>)}</div>
        </div>
        <div className="modal-grid">
          <InfoCard title="Зачем это упражнение в программе" className="role-description"><p>{exercise.roleDescription}</p></InfoCard>
          <InfoCard title="Как выполнять" className="howto"><ol>{exercise.howto.map(item => <li key={item}>{item}</li>)}</ol></InfoCard>
          <InfoCard title="Подсказка тренера"><p>{exercise.tip}</p></InfoCard>
          <InfoCard title="Прогрессия"><p>{exercise.progression}</p></InfoCard>
          <InfoCard title="Когда выбирать"><ul>{exercise.choose.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Когда не выбирать"><ul>{exercise.avoid.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Частые ошибки"><ul>{exercise.mistakes.map(item => <li key={item}>{item}</li>)}</ul></InfoCard>
          <InfoCard title="Как понять, что вес подходит"><p>{exercise.weight}</p></InfoCard>
        </div>
      </div>
    </div>
  </div>;
}

export function ChestPage() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [referenceModal, setReferenceModal] = useState<ReferenceModalType | null>(null);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsHeaderCompact(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return <>
    <nav className={`topbar${isHeaderCompact ? ' compact' : ''}`}><div className="topbar-inner"><Link className="brand" to="/"><div className="brand-mark">TH</div><span>Training Handbook</span></Link></div></nav>
    <main className="shell">
      <div className={`breadcrumbs-row${isHeaderCompact ? ' compact' : ''}`}>
        <Link className="back-link" to="/" aria-label="Назад на главную">←</Link>
        <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span aria-hidden="true">/</span><span aria-current="page">Грудь</span></nav>
      </div>
      <header className="page-head"><div><h1>Грудь</h1><p>Упражнения для развития груди: силовые жимы, основной объём и изоляция с акцентом на верхнюю, среднюю и нижнюю части.</p></div><div className="page-chip"><span className="dot" /> 12 упражнений</div></header>
      <div className="reference-actions"><button className="reference-button" type="button" onClick={() => setReferenceModal('stages')}><strong>Этапы тренировки</strong><span>Порядок упражнений и диапазоны</span></button><button className="reference-button" type="button" onClick={() => setReferenceModal('progression')}><strong>Прогрессия и рабочий вес</strong><span>Правила выбора и повышения веса</span></button></div>
      <section className="section" id="exercises">
        <div className="section-title exercise-section-title"><h2>Упражнения</h2><p>Нажми на строку, чтобы открыть карточку упражнения.</p></div>
        <ExerciseTable items={exercises} onOpen={setCurrentExercise} />
      </section>
    </main>
    <ReferenceModal type={referenceModal} onClose={() => setReferenceModal(null)} />
    <ExerciseModal exercise={currentExercise} onClose={() => setCurrentExercise(null)} />
  </>;
}
