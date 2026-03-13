/** 오행(五行) 개수/비율 */
export interface ElementsCount {
  wood: number
  fire: number
  earth: number
  metal: number
  water: number
}

/** 사주 데이터 (8글자 또는 6글자) */
export interface SajuData {
  /** 천간 [년, 월, 일, 시] - 시간 모름이면 시는 null */
  heavenly_stems: [string, string, string, string | null]
  /** 지지 [년, 월, 일, 시] */
  earthly_branches: [string, string, string, string | null]
  /** 오행 개수 (8글자 또는 6글자 기준) */
  elements_count: ElementsCount
}

/** 앱 전체 메타 JSON 규격 (상태 저장·내보내기용) */
export interface SajuMeta {
  user_id: string
  /** 화면 표시용. 내보내기 시 제외(익명화). 불러오기 시 없으면 "사용자님" */
  name?: string
  gender: 'male' | 'female'
  is_time_known: boolean
  /** 양력 기준 생일 (YYYY-MM-DD) - 저장용 */
  birth_date_solar: string
  /** 시간 아는 경우 "HH:mm" (분은 00 또는 30) */
  birth_time?: string
  saju_data: SajuData
  /** AI 상담 시 사용자 특징 요약 한 줄씩 누적 */
  counseling_history: string[]
  /** AI API로 생성한 오늘의 운세·행운 아이템·조언 (로딩 중 요청) */
  ai_result?: AIResult
}

/** AI API 응답 구조 (프롬프트에서 요청하는 JSON 형식) */
export interface AIResult {
  summary: string
  score: number
  luckyItems: { category: string; emoji: string; item: string; tip: string }[]
  advice: string
  strength?: string
}

export type ViewType = 'home' | 'input' | 'loading' | 'result'

/** 달력 유형: 양력 / 음력 / 윤달 */
export type CalendarType = 'solar' | 'lunar' | 'leap'

/** 분 입력: 사주 시진 기준 00분 또는 30분만 허용 */
export type BirthMinute = '00' | '30'

export interface FormInput {
  name: string
  gender: 'male' | 'female'
  birthYear: string
  birthMonth: string
  birthDay: string
  /** 양력 / 음력 / 윤달 */
  calendarType: CalendarType
  /** 시 기본 12, 수정 가능 (분은 00/30) */
  birthHour: string
  birthMinute: BirthMinute
}
