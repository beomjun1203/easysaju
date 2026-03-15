import { calculateSaju, lunarToSolar, solarToLunar } from '@fullstackfamily/manseryeok'
import type { SajuData } from '@/types/saju'
import { countElementsFromPillars } from './elements'

/**
 * 한글 기둥 문자열(예: '경오')을 [천간, 지지]로 분리.
 * 패키지가 '경오' 형태로 주므로 첫 글자=천간, 둘째 글자=지지.
 */
function splitPillar(pillar: string): [string, string] {
  if (pillar.length >= 2) {
    return [pillar[0], pillar[1]]
  }
  return [pillar, '']
}

export interface ExtractInput {
  year: number
  month: number
  day: number
  isLunar: boolean
  isLeapMonth?: boolean
  hour?: number
  minute?: number
}

/**
 * 시간을 아는 경우: 양력 기준으로 calculateSaju 호출 (음력이면 먼저 lunarToSolar)
 * 시간을 모르는 경우: solarToLunar로 년월일만 갑자 추출, 시주는 null
 */
export function extractSaju(input: ExtractInput): { saju_data: SajuData; is_time_known: boolean } {
  let solarYear = input.year
  let solarMonth = input.month
  let solarDay = input.day

  if (input.isLunar) {
    try {
      const converted = lunarToSolar(input.year, input.month, input.day, input.isLeapMonth ?? false)
      solarYear = converted.solar.year
      solarMonth = converted.solar.month
      solarDay = converted.solar.day
    } catch (e) {
      console.warn('[saju] lunarToSolar failed, using solar date', e)
      solarYear = input.year
      solarMonth = input.month
      solarDay = input.day
    }
  }

  const isTimeKnown = input.hour != null && input.minute != null

  if (isTimeKnown) {
    let saju
    try {
      saju = calculateSaju(solarYear, solarMonth, solarDay, input.hour!, input.minute ?? 0, {
        applyTimeCorrection: true,
      })
    } catch (e) {
      console.warn('[saju] calculateSaju failed', e)
      solarYear = input.year
      solarMonth = input.month
      solarDay = input.day
    }
    if (!saju) {
      try {
        const result = solarToLunar(solarYear, solarMonth, solarDay)
        const gapja = result?.gapja
        const yearPillar = gapja?.yearPillar ?? ''
        const monthPillar = gapja?.monthPillar ?? ''
        const dayPillar = gapja?.dayPillar ?? ''
        const pillars = [yearPillar, monthPillar, dayPillar]
        const heavenly_stems: [string, string, string, string | null] = ['', '', '', null]
        const earthly_branches: [string, string, string, string | null] = ['', '', '', null]
        pillars.forEach((p, i) => {
          const [stem, branch] = splitPillar(p)
          heavenly_stems[i] = stem
          earthly_branches[i] = branch
        })
        const elements_count = countElementsFromPillars(pillars)
        return {
          is_time_known: false,
          saju_data: {
            heavenly_stems,
            earthly_branches,
            elements_count,
          },
        }
      } catch (_e) {
        const emptyCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
        return {
          is_time_known: false,
          saju_data: {
            heavenly_stems: ['', '', '', null],
            earthly_branches: ['', '', '', null],
            elements_count: emptyCount,
          },
        }
      }
    }
    const pillars: string[] = [
      saju.yearPillar ?? '',
      saju.monthPillar ?? '',
      saju.dayPillar ?? '',
      saju.hourPillar ?? '',
    ]
    const heavenly_stems: [string, string, string, string] = ['', '', '', '']
    const earthly_branches: [string, string, string, string] = ['', '', '', '']
    pillars.forEach((p, i) => {
      const [stem, branch] = splitPillar(p)
      heavenly_stems[i] = stem
      earthly_branches[i] = branch
    })
    const elements_count = countElementsFromPillars(pillars)
    return {
      is_time_known: true,
      saju_data: {
        heavenly_stems,
        earthly_branches,
        elements_count,
      },
    }
  }

  // 시간 모름: 년월일 6글자만
  try {
    const result = solarToLunar(solarYear, solarMonth, solarDay)
    const gapja = result?.gapja
    const yearPillar = gapja?.yearPillar ?? ''
    const monthPillar = gapja?.monthPillar ?? ''
    const dayPillar = gapja?.dayPillar ?? ''
    const pillars = [yearPillar, monthPillar, dayPillar]
    const heavenly_stems: [string, string, string, string | null] = ['', '', '', null]
    const earthly_branches: [string, string, string, string | null] = ['', '', '', null]
    pillars.forEach((p, i) => {
      const [stem, branch] = splitPillar(p)
      heavenly_stems[i] = stem
      earthly_branches[i] = branch
    })
    const elements_count = countElementsFromPillars(pillars)
    return {
      is_time_known: false,
      saju_data: {
        heavenly_stems,
        earthly_branches,
        elements_count,
      },
    }
  } catch (e) {
    console.warn('[saju] solarToLunar failed', e)
    const emptyCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
    return {
      is_time_known: false,
      saju_data: {
        heavenly_stems: ['', '', '', null],
        earthly_branches: ['', '', '', null],
        elements_count: emptyCount,
      },
    }
  }
}
