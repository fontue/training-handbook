import type { ProgramRole, StimulusTag } from '../types/workout';

export const universalExerciseRoles:Record<ProgramRole,{label:string;description:string;className:string}>={
  heavy_base:{label:'🏋️ Тяжёлая база',description:'Тяжёлое движение для планомерной прогрессии силы и рабочего веса.',className:'role-strength'},
  main_volume:{label:'📈 Основной объём',description:'Основная гипертрофийная работа в умеренном диапазоне повторений.',className:'role-volume'},
  stable_volume:{label:'🧱 Стабильный объём',description:'Объём с невысокими требованиями к стабилизации.',className:'role-stable'},
  complementary_pattern:{label:'↔️ Дополняющий паттерн',description:'Добавляет направление движения, которого не хватало ранее.',className:'role-stable'},
  local_work:{label:'🎯 Локальная работа',description:'Добавляет локальный стимул с небольшой общей усталостью.',className:'role-peak'},
  optional_specialization:{label:'➕ Дополнительный акцент',description:'Необязательная работа для выбранного приоритета.',className:'role-upper'},
};

export const stimulusTagLabels:Record<StimulusTag,{label:string;description:string;className:string}>={
  lengthened_emphasis:{label:'🔄 Акцент в растяжении',description:'Заметная нагрузка приходится на удлинённое положение мышцы.',className:'role-lengthened'},
  mid_range_emphasis:{label:'↔️ Средняя амплитуда',description:'Основное сопротивление приходится на среднюю часть движения.',className:'role-volume'},
  shortened_emphasis:{label:'💥 Акцент в сокращении',description:'Сопротивление хорошо сохраняется ближе к сокращённому положению.',className:'role-peak'},
  upper_region_focus:{label:'↗️ Верхний отдел',description:'Траектория чаще смещает акцент к верхнему отделу мышцы.',className:'role-upper'},
  middle_region_focus:{label:'🎯 Средний отдел',description:'Траектория чаще распределяет работу вокруг среднего отдела.',className:'role-stable'},
  lower_region_focus:{label:'↘️ Нижний отдел',description:'Траектория чаще смещает акцент к среднему и нижнему отделам.',className:'role-lower'},
  unilateral:{label:'⚖️ Одностороннее',description:'Стороны работают по отдельности, что упрощает контроль асимметрии.',className:'role-lengthened'},
  neutral_grip:{label:'🤝 Нейтральный хват',description:'Ладони обращены друг к другу или близки к этому положению.',className:'role-stable'},
  supported:{label:'🪑 С опорой',description:'Опора снижает требования к стабилизации корпуса.',className:'role-stable'},
  high_stability_demand:{label:'🧭 Высокая стабилизация',description:'Движение требует устойчивого контроля корпуса и траектории.',className:'role-strength'},
};
