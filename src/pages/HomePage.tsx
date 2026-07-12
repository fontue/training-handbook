import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkoutDayCard } from '../components/WorkoutDayCard';
import { workoutDays } from '../config/workoutDays';

export function HomePage(){const[compact,setCompact]=useState(false);useEffect(()=>{const fn=()=>setCompact(scrollY>16);fn();addEventListener('scroll',fn,{passive:true});return()=>removeEventListener('scroll',fn);},[]);return <><nav className={`topbar${compact?' compact':''}`}><div className="topbar-inner"><Link className="brand" to="/"><div className="brand-mark">TH</div><span>Training Handbook</span></Link></div></nav><main className="shell home-shell"><header className="page-head home-head"><div><h1>Тренировочные дни</h1><p>Выбери день, собери упражнения для основной группы и дополни тренировку второстепенной.</p></div><div className="page-chip"><span className="dot"/> 3 дня</div></header><section className="section"><div className="section-title"><h2>Дни</h2><p>Фиксированный трёхдневный сплит</p></div><div className="muscle-grid">{Object.values(workoutDays).map(day=><WorkoutDayCard key={day.id} day={day}/>)}</div></section></main></>}
