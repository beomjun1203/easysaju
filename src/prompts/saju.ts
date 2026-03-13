import type { SajuMeta } from '@/types/saju'

/**
 * AI에게 전달할 사주 기반 운세 생성용 프롬프트.
 * 이 파일만 수정하면 프롬프트를 관리할 수 있습니다.
 */
const SYSTEM_PROMPT = `당신은 사주(四柱)를 바탕으로 오늘의 운세를 쉽게 풀어주는 이지 모드 해석가입니다.
전문 용어를 피하고 일상어로만 답하세요.
반드시 아래 JSON 형식만 출력하고, 그 외 설명이나 마크다운은 넣지 마세요.`

const OUTPUT_SCHEMA = `{
  "summary": "오늘의 운세 2~3문장 (쉬운 말로)",
  "score": 0~100 사이 숫자 (오늘의 총운 점수),
  "luckyItems": [
    { "category": "음식", "emoji": "이모지 한 글자", "item": "아이템명", "tip": "활용 팁 한 줄" },
    { "category": "색상", "emoji": "이모지", "item": "색상명", "tip": "팁" },
    { "category": "방향/장소", "emoji": "이모지", "item": "방향 또는 장소", "tip": "팁" }
  ],
  "advice": "오늘의 구체적 조언 1~2문장",
  "strength": "이 사주가 가진 강점 1문장 (선택)"
}`

export function buildSajuPrompt(meta: SajuMeta): string {
  const { name, gender, birth_date_solar, birth_time, saju_data } = meta
  const displayName = name || '사용자'
  const genderText = gender === 'male' ? '남성' : '여성'
  const pillars =
    saju_data.heavenly_stems
      .map((s, i) => {
        const b = saju_data.earthly_branches[i]
        const labels = ['년주', '월주', '일주', '시주']
        if (s && b) return `${labels[i]}: ${s}${b}`
        return null
      })
      .filter(Boolean)
      .join(', ') || '(년월일만 있음)'
  const elements = saju_data.elements_count
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  return `${SYSTEM_PROMPT}

## 출력 형식 (반드시 이 JSON만 출력)
${OUTPUT_SCHEMA}

## 현재 입력 정보
- 이름: ${displayName}
- 성별: ${genderText}
- 생일(양력): ${birth_date_solar}${birth_time ? ` ${birth_time}` : ''}
- 사주팔자: ${pillars}
- 오행 개수: 목=${elements.wood}, 화=${elements.fire}, 토=${elements.earth}, 금=${elements.metal}, 수=${elements.water}
- 오늘 날짜: ${dateStr}

위 정보를 바탕으로 오늘의 운세(summary), 총운 점수(score), 행운 아이템 3가지(luckyItems), 오늘의 조언(advice), 강점(strength)을 JSON 하나만 출력하세요.`
}
