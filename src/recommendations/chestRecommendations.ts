import type { Exercise, ExerciseRecommendation, RecommendationStatus } from '../types';

const statusOrder: Record<RecommendationStatus, number> = {
  recommended: 0,
  suitable: 1,
  not_ideal: 2,
};

function toStatus(score: number): RecommendationStatus {
  if (score >= 3) return 'recommended';
  if (score <= -1) return 'not_ideal';
  return 'suitable';
}

export function getStageTwoRecommendations(first: Exercise, candidates: Exercise[]): ExerciseRecommendation[] {
  return candidates.map(candidate => {
    let score = 0;
    const reasons: string[] = [];
    const changesAngle = candidate.profile.angle !== first.profile.angle;

    if (changesAngle) {
      score += 2;
      reasons.push('Меняет угол после первого тяжёлого жима.');
    } else {
      score -= 1;
      reasons.push('Частично повторяет уже выполненный угол.');
    }

    if (first.profile.stabilityDemand === 'high' && candidate.profile.stabilityDemand === 'low') {
      score += 2;
      reasons.push('Снижает требования к стабилизации.');
    }

    if (first.profile.stabilityDemand === 'low' && candidate.profile.stabilityDemand === 'low') {
      score -= 3;
      reasons.push('Стабильный профиль частично повторяет первое упражнение.');
    }

    if (first.profile.stabilityDemand === 'low' && !changesAngle) score += 1;

    if (first.profile.freeWeight && candidate.profile.freeWeight && candidate.profile.fatigueCost === 'high') {
      score -= 3;
      reasons.push('Второй технически сложный жим создаёт лишнюю усталость.');
    }

    if (first.upper < 4 && candidate.upper >= 4) {
      score += 1;
      reasons.push('Добавляет объём на верх груди.');
    }

    if (first.profile.angle === candidate.profile.angle && first.profile.lengthenedBias === candidate.profile.lengthenedBias) {
      score -= 1;
    }

    if (candidate.profile.fatigueCost === 'low') score += 1;

    return { exerciseId: candidate.id, status: toStatus(score), reasons: reasons.slice(0, 2), score };
  });
}

export function getStageThreeRecommendations(first: Exercise, second: Exercise, candidates: Exercise[]): ExerciseRecommendation[] {
  const selected = [first, second];
  const upperDominant = selected.every(exercise => exercise.upper >= 4);
  const horizontalCount = selected.filter(exercise => exercise.profile.angle === 'horizontal').length;
  const lengthenedCount = selected.filter(exercise => exercise.profile.lengthenedBias).length;

  return candidates.map(candidate => {
    let score = candidate.profile.fatigueCost === 'low' ? 1 : 0;
    const reasons: string[] = [];

    if (upperDominant) {
      if (candidate.focus === 'Верх груди') {
        score -= 3;
        reasons.push('Верх груди уже получил достаточную нагрузку.');
      } else if (candidate.profile.contractionBias) {
        score += 2;
        reasons.push('Добавляет другой профиль нагрузки после двух жимов.');
      }
    }

    if (horizontalCount === 2 && candidate.focus === 'Верх груди') {
      score += 3;
      reasons.push('Дополняет два горизонтальных движения акцентом на верх груди.');
    }

    if (second.profile.stabilityDemand === 'low' && candidate.profile.lengthenedBias) {
      score += 2;
      reasons.push('Добавляет работу в растяжении после стабильного тренажёра.');
    }

    if (lengthenedCount >= 2) {
      if (candidate.profile.contractionBias) {
        score += 3;
        reasons.push('Добавляет пиковое сокращение после большой работы в растяжении.');
      }
      if (candidate.profile.lengthenedBias) {
        score -= 3;
        reasons.push('Повторяет уже полученный профиль растяжения.');
      }
    }

    if (!reasons.length) {
      reasons.push(candidate.profile.contractionBias ? 'Добавляет контролируемое сокращение после двух жимов.' : 'Дополняет жимы изолирующей работой.');
    }

    return { exerciseId: candidate.id, status: toStatus(score), reasons: reasons.slice(0, 2), score };
  });
}

export function sortByRecommendation(exercises: Exercise[], recommendations: ExerciseRecommendation[]): Exercise[] {
  const byId = new Map(recommendations.map(recommendation => [recommendation.exerciseId, recommendation]));
  return [...exercises].sort((a, b) => {
    const aRecommendation = byId.get(a.id);
    const bRecommendation = byId.get(b.id);
    if (!aRecommendation || !bRecommendation) return 0;
    return statusOrder[aRecommendation.status] - statusOrder[bRecommendation.status] || bRecommendation.score - aRecommendation.score;
  });
}
