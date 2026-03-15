/** 천간 한글 → 한자 */
export const STEM_HANJA: Record<string, string> = {
  갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊',
  기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸',
}

/** 지지 한글 → 한자 */
export const BRANCH_HANJA: Record<string, string> = {
  자: '子', 축: '丑', 인: '寅', 묘: '卯', 진: '辰', 사: '巳',
  오: '午', 미: '未', 신: '申', 유: '酉', 술: '戌', 해: '亥',
}

export function stemToHanja(s: string): string {
  return STEM_HANJA[s] ?? s
}

export function branchToHanja(b: string): string {
  return BRANCH_HANJA[b] ?? b
}
