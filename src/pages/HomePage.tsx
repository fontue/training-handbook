import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    path: '/chest',
    short: 'ГР',
    title: 'Грудь',
    description: 'Упражнения для развития груди: силовые жимы, основной объём и изоляция с акцентом на верхнюю, среднюю и нижнюю части.',
    exercises: 12,
    stages: 3,
  },
];

export function HomePage() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsHeaderCompact(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return <>
    <nav className={`topbar${isHeaderCompact ? ' compact' : ''}`}>
      <div className="topbar-inner">
        <Link className="brand" to="/"><div className="brand-mark">TH</div><span>Training Handbook</span></Link>
      </div>
    </nav>

    <main className="shell home-shell">
      <header className="page-head home-head">
        <div><h1>Группы мышц</h1><p>Выбери раздел, чтобы открыть упражнения, правила прогрессии и собрать тренировку.</p></div>
        <div className="page-chip"><span className="dot" /> Справочник</div>
      </header>

      <section className="section">
        <div className="section-title"><h2>Разделы</h2><p>{sections.length} доступен</p></div>
        <div className="muscle-grid">
          {sections.map(section => <Link className="panel muscle-card" to={section.path} key={section.path}>
            <div className="muscle-card-top"><div className="muscle-icon">{section.short}</div><span className="muscle-arrow" aria-hidden="true">↗</span></div>
            <div><h2>{section.title}</h2><p>{section.description}</p></div>
            <div className="muscle-meta"><span>{section.exercises} упражнений</span><span>{section.stages} этапа</span></div>
          </Link>)}
        </div>
      </section>

    </main>
  </>;
}
