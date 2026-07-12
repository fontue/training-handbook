import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { validateWorkoutContent } from './content/validateWorkoutContent';
import { workoutExercises } from './data/workoutExercises';
import './styles.css';

if(import.meta.env.DEV)validateWorkoutContent(workoutExercises);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
