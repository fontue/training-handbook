import type { ExerciseStage } from '../types/workout';

export const exerciseStages: ExerciseStage[] = [
  {id:'chest-heavy-press',muscleGroupId:'chest',order:1,title:'Тяжёлый жим',shortTitle:'Силовое',description:'Основная прогрессия нагрузки.',reps:'5–8',sets:'3–4',rir:'1–2',rest:'2–3 мин'},
  {id:'chest-volume',muscleGroupId:'chest',order:2,title:'Дополняющий объём',shortTitle:'Объём',description:'Дополняет первый жим.',reps:'8–12',sets:'3–4',rir:'1–2',rest:'90–120 сек'},
  {id:'chest-isolation',muscleGroupId:'chest',order:3,title:'Изоляция',shortTitle:'Изоляция',description:'Контролируемая локальная работа.',reps:'12–15',sets:'3–4',rir:'0–1',rest:'60–90 сек'},
  {id:'triceps-lengthened',muscleGroupId:'triceps',order:1,title:'Длинная головка / растянутое положение',shortTitle:'Растяжение',description:'Локальная работа над головой.',reps:'8–12',sets:'3',rir:'1–2',rest:'75–120 сек'},
  {id:'triceps-shortened',muscleGroupId:'triceps',order:2,title:'Сокращение / стабильное разгибание',shortTitle:'Сокращение',description:'Стабильная работа на блоке.',reps:'10–15',sets:'3',rir:'0–1',rest:'60–90 сек'},
  {id:'back-primary-pull',muscleGroupId:'back',order:1,title:'Основная тяжёлая тяга',shortTitle:'Основная тяга',description:'Силовая база спины.',reps:'6–10',sets:'3–4',rir:'1–2',rest:'2–3 мин'},
  {id:'back-complementary-pull',muscleGroupId:'back',order:2,title:'Дополняющее направление тяги',shortTitle:'Дополнение',description:'Меняет направление после первой тяги.',reps:'8–12',sets:'3–4',rir:'1–2',rest:'90–120 сек'},
  {id:'back-local',muscleGroupId:'back',order:3,title:'Локальная работа',shortTitle:'Локально',description:'Меньше участия бицепса.',reps:'10–15',sets:'3',rir:'0–2',rest:'60–90 сек'},
  {id:'biceps-lengthened',muscleGroupId:'biceps',order:1,title:'Растянутое положение',shortTitle:'Растяжение',description:'Работа с плечом позади корпуса.',reps:'8–12',sets:'3',rir:'1–2',rest:'75–120 сек'},
  {id:'biceps-supported',muscleGroupId:'biceps',order:2,title:'Стабильное сокращение',shortTitle:'Сокращение',description:'Опора и стабильная траектория.',reps:'10–15',sets:'3',rir:'0–1',rest:'60–90 сек'},
  {id:'legs-knee-dominant',muscleGroupId:'legs',order:1,title:'Коленно-доминантное движение',shortTitle:'Квадрицепс',description:'Основное движение для квадрицепса.',reps:'6–10',sets:'3–4',rir:'1–2',rest:'2–3 мин'},
  {id:'legs-hip-dominant',muscleGroupId:'legs',order:2,title:'Тазобедренно-доминантное движение',shortTitle:'Задняя цепь',description:'Ягодицы и задняя поверхность бедра.',reps:'6–12',sets:'3–4',rir:'1–2',rest:'2–3 мин'},
  {id:'legs-accessory',muscleGroupId:'legs',order:3,title:'Дополнение недополучившего паттерна',shortTitle:'Дополнение',description:'Закрывает недостающий стимул.',reps:'10–15',sets:'3',rir:'0–2',rest:'60–120 сек'},
  {id:'legs-calves',muscleGroupId:'legs',order:4,title:'Икры',shortTitle:'Опционально',description:'Добавь, если икры входят в программу и есть время.',reps:'10–20',sets:'3–4',rir:'0–2',rest:'60–90 сек',optional:true},
  {id:'shoulders-primary',muscleGroupId:'shoulders',order:1,title:'Жим или приоритет средней дельты',shortTitle:'Основное',description:'Жим не является обязательным.',reps:'6–12',sets:'3',rir:'1–2',rest:'90–150 сек'},
  {id:'shoulders-lateral',muscleGroupId:'shoulders',order:2,title:'Средняя дельта',shortTitle:'Средняя',description:'Контролируемые отведения.',reps:'10–20',sets:'3–4',rir:'0–2',rest:'60–90 сек'},
  {id:'shoulders-rear',muscleGroupId:'shoulders',order:3,title:'Задняя дельта',shortTitle:'Задняя',description:'Отведения и тяговые варианты.',reps:'12–20',sets:'3–4',rir:'0–2',rest:'60–90 сек'},
];
