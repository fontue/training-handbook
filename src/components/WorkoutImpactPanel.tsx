import { loadTargetLabels } from '../config/loadTargets';
import type { LoadLevel, MuscleGroupId, WorkoutExercise } from '../types/workout';

const label:Record<LoadLevel,string>={low:'Низкая',medium:'Умеренная',high:'Высокая'};
const width:Record<LoadLevel,string>={low:'30%',medium:'62%',high:'92%'};
const rank:Record<LoadLevel,number>={low:1,medium:2,high:3};
export function WorkoutImpactPanel({exercises,targetGroup}:{exercises:WorkoutExercise[];targetGroup:MuscleGroupId}){
  if(!exercises.length)return <section className="workout-impact"><h2>Накопленная нагрузка</h2><div className="panel empty-stage">Выбери упражнение основной группы, чтобы увидеть участие {loadTargetLabels[targetGroup].toLowerCase()} и практическую нагрузку.</div></section>;
  const max=(key:'lowerBackDemand'|'elbowDemand'|'shoulderDemand'|'systemicFatigue')=>exercises.reduce<LoadLevel>((value,item)=>rank[item.practicalProperties[key]]>rank[value]?item.practicalProperties[key]:value,'low');
  const exposure=exercises.reduce((sum,item)=>sum+(item.expectedSecondaryExposure[targetGroup]??0),0);const muscle:LoadLevel=exposure>=7?'high':exposure>=3?'medium':'low';
  const items=[['Мышцы · '+loadTargetLabels[targetGroup],muscle],['Поясница',max('lowerBackDemand')],['Хват',exercises.some(item=>(item.expectedSecondaryExposure.grip??0)>=2)?'medium':'low'],['Локти',max('elbowDemand')],['Плечи',max('shoulderDemand')],['Общая усталость',max('systemicFatigue')]] as Array<[string,LoadLevel]>;
  return <section className="workout-impact"><h2>Накопленная нагрузка</h2><div className="impact-grid">{items.map(([title,level])=><article className="panel impact-card" key={title}><div><strong>{title}</strong><span>{label[level]}</span></div><span className="impact-track"><span style={{width:width[level]}}/></span></article>)}</div></section>;
}
