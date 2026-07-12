import type { RecommendationStatus } from '../types';

const labels: Record<RecommendationStatus, string> = {
  recommended: 'Рекомендуется',
  suitable: 'Подходит',
  not_ideal: 'Не лучший выбор',
};

export function RecommendationBadge({ status }: { status: RecommendationStatus }) {
  return <span className={`recommendation-badge recommendation-${status}`}>{labels[status]}</span>;
}
