import { Link } from 'react-router-dom';
import { exerciseStages } from '../data/exerciseStages';
import { muscleGroupLabels } from '../config/workoutDays';
import type { WorkoutDay } from '../types/workout';

export function WorkoutDayCard({day}:{day:WorkoutDay}){const primary=exerciseStages.filter(s=>s.muscleGroupId===day.primaryMuscleGroup&&!s.optional).length;const secondary=exerciseStages.filter(s=>s.muscleGroupId===day.secondaryMuscleGroup&&!s.optional).length;return <Link className="panel muscle-card workout-day-card" to={`/workouts/${day.id}`}><div className="muscle-card-top"><div className="day-groups"><span>{muscleGroupLabels[day.primaryMuscleGroup]}</span><b>→</b><span>{muscleGroupLabels[day.secondaryMuscleGroup]}</span></div><span className="muscle-arrow">↗</span></div><div><h2>{day.title}</h2><p>{day.description}</p></div><div className="muscle-meta"><span>{primary} этапа · {muscleGroupLabels[day.primaryMuscleGroup]}</span><span>{secondary} этапа · {muscleGroupLabels[day.secondaryMuscleGroup]}</span></div></Link>}
