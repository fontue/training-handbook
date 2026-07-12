import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WorkoutDayPage } from './pages/WorkoutDayPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts/:id" element={<WorkoutDayPage />} />
        <Route path="/chest" element={<Navigate to="/workouts/chest-triceps" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
