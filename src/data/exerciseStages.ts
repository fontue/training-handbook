import type { ExerciseStage } from '../types/workout';

export const exerciseStages: ExerciseStage[] = [
  {id:'chest-heavy-press',muscleGroupId:'chest',order:1,title:'Тяжёлая база',shortTitle:'Тяжёлая база',description:'Основной жим для прогрессии силы и рабочего веса.',reps:'5–8',sets:'3–4',rir:'1–3',rest:'2–3 мин'},
  {id:'chest-volume',muscleGroupId:'chest',order:2,title:'Основной объём',shortTitle:'Основной объём',description:'Дополняет первый жим другим углом или более стабильной траекторией.',reps:'8–12',sets:'3–4',rir:'1–2',rest:'90–120 сек'},
  {id:'chest-isolation',muscleGroupId:'chest',order:3,title:'Локальная работа',shortTitle:'Локальная работа',description:'Контролируемое сведение с невысокой общей усталостью.',reps:'10–20',sets:'3–4',rir:'0–2',rest:'60–90 сек'},
  {id:'triceps-overhead',muscleGroupId:'triceps',order:1,title:'Разгибание над головой',shortTitle:'Над головой',description:'Локальная работа при поднятом плече.',reps:'8–15',sets:'3',rir:'1–2',rest:'75–120 сек'},
  {id:'triceps-pushdown',muscleGroupId:'triceps',order:2,title:'Стабильное разгибание вниз',shortTitle:'Разгибание вниз',description:'Контролируемая работа на блоке с низкой общей усталостью.',reps:'10–20',sets:'3',rir:'0–2',rest:'60–90 сек'},
  {id:'triceps-compound',muscleGroupId:'triceps',order:3,title:'Тяжёлое многосуставное упражнение',shortTitle:'Тяжёлое · опция',description:'Дополнительная тяжёлая работа, если трицепс не утомлён грудными жимами.',reps:'6–10',sets:'3',rir:'1–3',rest:'2–3 мин',optional:true},
  {id:'back-primary-pull',muscleGroupId:'back',order:1,title:'Основная тяга',shortTitle:'Основная тяга',description:'Главное многосуставное движение тренировки спины.',reps:'6–10',sets:'3–4',rir:'1–3',rest:'2–3 мин'},
  {id:'back-complementary-pull',muscleGroupId:'back',order:2,title:'Дополняющее направление',shortTitle:'Дополнение',description:'Добавляет вертикальную или горизонтальную тягу после первого движения.',reps:'8–12',sets:'3–4',rir:'1–2',rest:'90–120 сек'},
  {id:'back-local',muscleGroupId:'back',order:3,title:'Локальная работа',shortTitle:'Локальная работа',description:'Добавляет работу широчайших или середины спины с меньшей общей усталостью.',reps:'10–20',sets:'3',rir:'0–2',rest:'60–90 сек'},
  {id:'biceps-primary',muscleGroupId:'biceps',order:1,title:'Основное сгибание',shortTitle:'Основное сгибание',description:'Основной объём бицепса в устойчивой и комфортной позиции плеча.',reps:'8–12',sets:'3',rir:'1–2',rest:'75–120 сек'},
  {id:'biceps-complementary',muscleGroupId:'biceps',order:2,title:'Дополняющий вариант',shortTitle:'Дополнение',description:'Другая позиция плеча, опора или нейтральный хват.',reps:'10–15',sets:'3',rir:'0–2',rest:'60–90 сек'},
  {id:'legs-main',muscleGroupId:'legs',order:1,title:'Основное движение для квадрицепса и ягодиц',shortTitle:'Основное движение',description:'Тяжёлое приседательное или жимовое движение.',reps:'5–10',sets:'3–4',rir:'1–3',rest:'2–3 мин'},
  {id:'legs-hip-extension',muscleGroupId:'legs',order:2,title:'Разгибание тазобедренного сустава',shortTitle:'Тазобедренное',description:'Работа ягодиц и задней поверхности бедра.',reps:'6–12',sets:'3–4',rir:'1–3',rest:'2–3 мин'},
  {id:'legs-accessory',muscleGroupId:'legs',order:3,title:'Сгибание колена или компенсация нагрузки',shortTitle:'Дополнение',description:'Закрывает недополученную работу задней поверхности или квадрицепса.',reps:'10–20',sets:'3',rir:'0–2',rest:'60–120 сек'},
  {id:'legs-calves',muscleGroupId:'legs',order:4,title:'Икры',shortTitle:'Икры · опция',description:'Дополнительная работа икроножных и камбаловидной мышц.',reps:'8–20',sets:'3–4',rir:'0–2',rest:'60–90 сек',optional:true},
  {id:'shoulders-lateral',muscleGroupId:'shoulders',order:1,title:'Средняя дельта',shortTitle:'Средняя дельта',description:'Обязательная работа отведением плеча.',reps:'10–20',sets:'3–4',rir:'0–2',rest:'60–90 сек'},
  {id:'shoulders-rear',muscleGroupId:'shoulders',order:2,title:'Задняя дельта',shortTitle:'Задняя дельта',description:'Обязательная работа задней дельты и мышц лопатки.',reps:'12–20',sets:'3–4',rir:'0–2',rest:'60–90 сек'},
  {id:'shoulders-press',muscleGroupId:'shoulders',order:3,title:'Жим над головой',shortTitle:'Жим · опция',description:'Необязательная работа передней дельты и трицепса.',reps:'6–12',sets:'3',rir:'1–3',rest:'90–150 сек',optional:true},
];
