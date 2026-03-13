/** 오행 타입 */
export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

/** 천간(10) → 오행 */
const STEM_TO_ELEMENT: Record<string, ElementKey> = {
  갑: 'wood', 을: 'wood',
  병: 'fire', 정: 'fire',
  무: 'earth', 기: 'earth',
  경: 'metal', 신: 'metal',
  임: 'water', 계: 'water',
}

/** 지지(12) → 오행 */
const BRANCH_TO_ELEMENT: Record<string, ElementKey> = {
  인: 'wood', 묘: 'wood',
  사: 'fire', 오: 'fire',
  진: 'earth', 술: 'earth', 축: 'earth', 미: 'earth',
  신: 'metal', 유: 'metal',
  해: 'water', 자: 'water',
}

/**
 * 한 글자(천간 또는 지지)의 오행 반환
 */
export function getElementFromChar(char: string): ElementKey | null {
  return STEM_TO_ELEMENT[char] ?? BRANCH_TO_ELEMENT[char] ?? null
}

/** 지지(12) → 띠 이름 */
export const BRANCH_ZODIAC: Record<string, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용', 사: '뱀',
  오: '말', 미: '양', 신: '원숭이', 유: '닭', 술: '개', 해: '돼지',
}

function charToElement(char: string): ElementKey | null {
  return getElementFromChar(char)
}

/**
 * 사주 기둥 문자열(예: '경오')에서 오행 2개 추출
 */
function pillarToElements(pillar: string): ElementKey[] {
  const result: ElementKey[] = []
  for (const c of pillar) {
    const el = charToElement(c)
    if (el) result.push(el)
  }
  return result
}

/**
 * 8글자 또는 6글자(년월일만) 사주에서 오행 개수 집계
 */
export function countElementsFromPillars(pillars: string[]): Record<ElementKey, number> {
  const count: Record<ElementKey, number> = {
    wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
  }
  for (const p of pillars) {
    if (!p) continue
    for (const el of pillarToElements(p)) {
      count[el] += 1
    }
  }
  return count
}

/**
 * 오행 개수 → 비율(0~1)
 */
export function elementsToRatios(count: Record<ElementKey, number>): Record<ElementKey, number> {
  const total = Object.values(count).reduce((a, b) => a + b, 0)
  if (total === 0) {
    return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  }
  return {
    wood: count.wood / total,
    fire: count.fire / total,
    earth: count.earth / total,
    metal: count.metal / total,
    water: count.water / total,
  }
}

/** 오행 한글 라벨 */
export const ELEMENT_LABELS: Record<ElementKey, string> = {
  wood: '목',
  fire: '화',
  earth: '토',
  metal: '금',
  water: '수',
}
