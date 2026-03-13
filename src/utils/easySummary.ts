import type { SajuData } from '@/types/saju'
import { elementsToRatios, ELEMENT_LABELS, type ElementKey } from './elements'

const ELEMENT_ORDER: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water']

/**
 * 오행 비율 기반 한 줄 평 (더미)
 */
export function getOneLineSummary(saju_data: SajuData): string {
  const ratios = elementsToRatios(saju_data.elements_count)
  const sorted = [...ELEMENT_ORDER].sort((a, b) => ratios[b] - ratios[a])
  const top = sorted[0]
  const second = sorted[1]
  if (ratios[top] >= 0.5) {
    return `${ELEMENT_LABELS[top]} 기운이 강한 편입니다. ${ELEMENT_LABELS[top]}의 특성을 잘 활용해 보세요.`
  }
  if (ratios[top] >= 0.3 && ratios[second] >= 0.2) {
    return `${ELEMENT_LABELS[top]}와 ${ELEMENT_LABELS[second]}가 고르게 섞인 조화로운 기운입니다.`
  }
  return '다양한 오행이 골고루 있어 균형 잡힌 성향으로 보입니다.'
}

/**
 * 간단 성향 요약 (더미)
 */
export function getTraitSummary(saju_data: SajuData): string[] {
  const ratios = elementsToRatios(saju_data.elements_count)
  const lines: string[] = []
  if (ratios.wood > 0.25) lines.push('• 목(木): 성장과 인내, 따뜻한 마음')
  if (ratios.fire > 0.25) lines.push('• 화(火): 열정과 표현력, 리더십')
  if (ratios.earth > 0.25) lines.push('• 토(土): 안정과 신뢰, 배려')
  if (ratios.metal > 0.25) lines.push('• 금(金): 원리원칙, 정리와 결단')
  if (ratios.water > 0.25) lines.push('• 수(水): 지혜와 유연함, 직관')
  if (lines.length === 0) lines.push('• 오행이 고르게 분포되어 있습니다.')
  return lines
}

/** 오늘의 총운 점수 (더미: 오행 비율 기반 60~90) */
export function getTodayScore(saju_data: SajuData): number {
  const ratios = elementsToRatios(saju_data.elements_count)
  const total = Object.values(ratios).reduce((a, b) => a + b, 0)
  if (total === 0) return 72
  const max = Math.max(...Object.values(ratios))
  return Math.min(95, Math.max(58, Math.round(60 + max * 35)))
}

/** 오늘의 행운 아이템 Top 3 (더미) */
export function getLuckyItems(): { category: string; emoji: string; item: string; tip: string }[] {
  return [
    { category: '음식', emoji: '🥗', item: '비빔밥', tip: '오색 채소로 오행의 균형을 맞춰 보세요' },
    { category: '색상', emoji: '🟢', item: '초록색', tip: '소품이나 옷에 포인트로 활용해 보세요' },
    { category: '방향/장소', emoji: '⬅️', item: '동쪽', tip: '아침에 동쪽 방향에서 하루를 시작해 보세요' },
  ]
}

/** 오늘의 조언 한 줄 (더미) */
export function getTodayAdvice(): string {
  return '오늘은 서두르지 말고 차분히 계획을 세운 뒤 행동하세요. 오후가 더 유리한 날입니다.'
}
