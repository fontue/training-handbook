import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CurrentWorkout } from '../components/CurrentWorkout';
import { ExerciseModal } from '../components/ExerciseModal';
import { ExerciseSection } from '../components/ExerciseSection';
import { exercises } from '../data/exercises';
import { getStageThreeRecommendations, getStageTwoRecommendations, sortByRecommendation } from '../recommendations/chestRecommendations';
import type { Exercise, Stage, WorkoutSelection } from '../types';

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

export function ChestPage() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [referenceModal, setReferenceModal] = useState<ReferenceModalType | null>(null);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [selection, setSelection] = useState<WorkoutSelection>({});
  const [query, setQuery] = useState('');
  const [focusFilter, setFocusFilter] = useState('');

  useEffect(() => {
    const updateHeader = () => setIsHeaderCompact(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  const byStage = useMemo(() => ({
    1: exercises.filter(exercise => exercise.stage === 1),
    2: exercises.filter(exercise => exercise.stage === 2),
    3: exercises.filter(exercise => exercise.stage === 3),
  }), []);
  const stageTwoRecommendations = useMemo(() => selection[1] ? getStageTwoRecommendations(selection[1], byStage[2]) : [], [selection, byStage]);
  const stageThreeRecommendations = useMemo(() => selection[1] && selection[2] ? getStageThreeRecommendations(selection[1], selection[2], byStage[3]) : [], [selection, byStage]);
  const visibleByStage = useMemo(() => {
    const filter = (items: Exercise[]) => items.filter(exercise => (!query.trim() || exercise.name.toLowerCase().includes(query.trim().toLowerCase())) && (!focusFilter || exercise.focus === focusFilter));
    return { 1: filter(byStage[1]), 2: sortByRecommendation(filter(byStage[2]), stageTwoRecommendations), 3: sortByRecommendation(filter(byStage[3]), stageThreeRecommendations) };
  }, [byStage, focusFilter, query, stageThreeRecommendations, stageTwoRecommendations]);

  const selectExercise = (exercise: Exercise) => {
    setSelection(previous => exercise.stage === 1 ? { 1: exercise } : exercise.stage === 2 ? { 1: previous[1], 2: exercise } : { ...previous, 3: exercise });
  };

  return <>
    <nav className={`topbar${isHeaderCompact ? ' compact' : ''}`}><div className="topbar-inner"><Link className="brand" to="/"><div className="brand-mark">TH</div><span>Training Handbook</span></Link></div></nav>
    <main className="shell chest-shell">
      <div className={`breadcrumbs-row${isHeaderCompact ? ' compact' : ''}`}>
        <Link className="back-link" to="/" aria-label="Назад на главную">←</Link>
        <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span aria-hidden="true">/</span><span aria-current="page">Грудь</span></nav>
      </div>
      <header className="page-head"><div><h1>Грудь</h1><p>Упражнения для развития груди: силовые жимы, основной объём и изоляция с акцентом на верхнюю, среднюю и нижнюю части.</p></div><div className="page-chip"><span className="dot" /> 12 упражнений</div></header>
      <div className="reference-actions"><button className="reference-button" type="button" onClick={() => setReferenceModal('stages')}><strong>Этапы тренировки</strong><span>Порядок упражнений и диапазоны</span></button><button className="reference-button" type="button" onClick={() => setReferenceModal('progression')}><strong>Прогрессия и рабочий вес</strong><span>Правила выбора и повышения веса</span></button></div>
      <section className="section" id="exercises">
        <div className="section-title exercise-section-title"><h2>Упражнения</h2><p>Нажми на карточку, чтобы открыть подробную информацию.</p></div>
        <div className="exercise-filters"><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Поиск упражнения…" /><select value={focusFilter} onChange={event => setFocusFilter(event.target.value)}><option value="">Любой акцент</option><option value="Вся грудь">Вся грудь</option><option value="Верх груди">Верх груди</option><option value="Средняя часть">Средняя часть</option><option value="Нижняя часть">Нижняя часть</option></select></div>
        <div className="exercise-catalog-layout"><div className="exercise-sections">{([1, 2, 3] as Stage[]).map(stage => visibleByStage[stage].length > 0 && <ExerciseSection key={stage} stage={stage} exercises={visibleByStage[stage]} recommendations={stage === 2 ? stageTwoRecommendations : stage === 3 ? stageThreeRecommendations : []} selectedId={selection[stage]?.id} onOpen={setCurrentExercise} onSelect={selectExercise} />)}</div><CurrentWorkout selection={selection} onClear={() => setSelection({})} /></div>
      </section>
    </main>
    <ReferenceModal type={referenceModal} onClose={() => setReferenceModal(null)} />
    <ExerciseModal exercise={currentExercise} selected={Boolean(currentExercise && selection[currentExercise.stage]?.id === currentExercise.id)} onClose={() => setCurrentExercise(null)} onSelect={selectExercise} />
  </>;
}
