import type { UniversalExerciseRole } from '../types/workout';

export const universalExerciseRoles:Record<UniversalExerciseRole,{label:string;description:string;className:string}>={
  strength_base:{label:'🏋️ Силовая база',description:'Основное тяжёлое движение для системной прогрессии нагрузки.',className:'role-strength'},
  stable_overload:{label:'📈 Стабильная перегрузка',description:'Позволяет нагружать мышцу без высоких требований к стабилизации.',className:'role-stable'},
  main_volume:{label:'📊 Основной объём',description:'Даёт основную часть гипертрофийной работы в умеренном диапазоне.',className:'role-volume'},
  lengthened:{label:'🔄 Работа в растяжении',description:'Создаёт нагрузку в удлинённом положении мышцы.',className:'role-lengthened'},
  peak_contraction:{label:'💥 Пиковое сокращение',description:'Акцентирует контролируемое сокращение в конечной точке.',className:'role-peak'},
  angle_focus:{label:'🎯 Акцент по углу',description:'Смещает нагрузку на выбранный участок изменением угла движения.',className:'role-upper'},
  complementary_pattern:{label:'↔️ Дополняющий паттерн',description:'Добавляет направление движения, которого не хватало ранее.',className:'role-stable'},
  low_fatigue_isolation:{label:'🧩 Локальная работа',description:'Добавляет локальный стимул с небольшой общей усталостью.',className:'role-peak'},
  unilateral_control:{label:'⚖️ Односторонний контроль',description:'Позволяет отдельно контролировать правую и левую стороны.',className:'role-lengthened'},
  technical_skill:{label:'🛠️ Технический навык',description:'Требует устойчивой техники и развивает координацию движения.',className:'role-strength'},
  secondary_muscle_focus:{label:'🔎 Дополнительная мышца',description:'Смещает часть нагрузки на вспомогательную мышечную группу.',className:'role-lower'},
};
