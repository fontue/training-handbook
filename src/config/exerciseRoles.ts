import type { ExerciseRole } from '../types';

interface ExerciseRoleConfig {
  label: string;
  className: string;
}

export const exerciseRoles: Record<ExerciseRole, ExerciseRoleConfig> = {
  strength_base: { label: '🏋️ Силовая база', className: 'role-strength' },
  stable_overload: { label: '📈 Стабильная перегрузка', className: 'role-stable' },
  main_volume: { label: '📈 Основной объём', className: 'role-volume' },
  lengthened: { label: '🔄 Работа в растяжении', className: 'role-lengthened' },
  peak_contraction: { label: '💥 Пиковое сокращение', className: 'role-peak' },
  upper_chest_focus: { label: '🎯 Акцент на верх груди', className: 'role-upper' },
  lower_chest_focus: { label: '🎯 Акцент на нижнюю часть груди', className: 'role-lower' },
};
