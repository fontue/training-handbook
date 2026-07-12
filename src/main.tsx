import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { validateWorkoutContent } from './content/validateWorkoutContent';
import { workoutExercises } from './data/workoutExercises';
import './styles.css';

if(import.meta.env.DEV)validateWorkoutContent(workoutExercises);

if('serviceWorker' in navigator&&import.meta.env.PROD){
  window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
