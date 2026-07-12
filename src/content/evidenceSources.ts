export interface EvidenceSource { id:string; title:string; year:number; sourceType:'systematic_review'|'meta_analysis'|'training_study'|'biomechanics'|'anatomy'; reference:string; notes?:string }
export const evidenceSources:EvidenceSource[]=[
  {id:'schoenfeld-load-2021',title:'Loading recommendations for muscle strength, hypertrophy, and local endurance',year:2021,sourceType:'systematic_review',reference:'Schoenfeld BJ et al. Sports. 2021;9(2):32.',notes:'Диапазоны нагрузки и гипертрофия.'},
  {id:'grgic-failure-2022',title:'Resistance training performed to repetition failure or non-failure',year:2022,sourceType:'meta_analysis',reference:'Grgic J et al. J Sport Health Sci. 2022;11(2):202–211.',notes:'Работа до отказа.'},
  {id:'williams-periodization-2017',title:'Periodized and non-periodized resistance training',year:2017,sourceType:'systematic_review',reference:'Williams TD et al. Sports Med. 2017;47:2083–2100.',notes:'Периодизация.'},
  {id:'maeo-triceps-2023',title:'Triceps hypertrophy in different shoulder positions',year:2023,sourceType:'training_study',reference:'Maeo S et al. Eur J Sport Sci. 2023;23(7):1245–1253.',notes:'Разгибание над головой.'},
  {id:'pedrosa-elbow-flexors-2023',title:'Elbow flexor training at different shoulder positions',year:2023,sourceType:'training_study',reference:'Pedrosa GF et al. Eur J Sport Sci. 2023.',notes:'Положение плеча в сгибаниях.'},
  {id:'maeo-leg-curl-2021',title:'Hamstrings hypertrophy after seated and prone leg curl training',year:2021,sourceType:'training_study',reference:'Maeo S et al. Med Sci Sports Exerc. 2021;53(4):825–837.',notes:'Сгибание ног сидя и лёжа.'},
  {id:'wolf-lengthened-2023',title:'Lengthened partial repetitions and muscle hypertrophy',year:2023,sourceType:'systematic_review',reference:'Wolf M et al. Sports Med. 2023.',notes:'Длина мышцы и гипертрофия.'},
  {id:'lauver-bench-angle-2016',title:'Influence of bench angle on muscular activation',year:2016,sourceType:'biomechanics',reference:'Lauver JD et al. Eur J Sport Sci. 2016;16(3):309–316.',notes:'Наклон жима.'},
  {id:'haugen-machines-2023',title:'Free weights versus machines for strength and hypertrophy',year:2023,sourceType:'systematic_review',reference:'Haugen ME et al. BMC Sports Sci Med Rehabil. 2023.',notes:'Свободные веса и тренажёры.'},
  {id:'botton-deltoid-2013',title:'Deltoid activation during shoulder exercises',year:2013,sourceType:'biomechanics',reference:'Botton CE et al. J Strength Cond Res. 2013;27(7):1876–1883.',notes:'Упражнения для дельт.'},
  {id:'resistance-training-position-stand',title:'Progression models in resistance training for healthy adults',year:2009,sourceType:'systematic_review',reference:'ACSM. Med Sci Sports Exerc. 2009;41(3):687–708.'},
];
