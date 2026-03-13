import type { SajuMeta } from '@/types/saju'
import type { AIResult } from '@/types/saju'
import { buildSajuPrompt } from '@/prompts/saju'

const DEFAULT_API_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = 'gpt-4o-mini'

function getEnv(key: string): string {
  return (import.meta.env[key] as string) ?? ''
}

/**
 * AI API를 호출하여 사주 기반 오늘의 운세·행운 아이템·조언을 생성합니다.
 * .env의 VITE_AI_API_KEY를 설정해야 동작합니다.
 */
export async function fetchSajuAI(meta: SajuMeta): Promise<AIResult | null> {
  const apiKey = getEnv('VITE_AI_API_KEY')
  const apiUrl = getEnv('VITE_AI_API_URL') || DEFAULT_API_URL
  const model = getEnv('VITE_AI_MODEL') || DEFAULT_MODEL

  if (!apiKey?.trim()) {
    return null
  }

  const prompt = buildSajuPrompt(meta)

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.warn('[AI API]', res.status, err)
      return null
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) return null

    const jsonStr = content.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim()
    const parsed = JSON.parse(jsonStr) as AIResult

    if (!parsed.summary || !Array.isArray(parsed.luckyItems)) {
      return null
    }
    if (typeof parsed.score !== 'number') {
      parsed.score = Math.min(100, Math.max(0, Number(parsed.score) || 72))
    }
    return {
      summary: String(parsed.summary),
      score: parsed.score,
      luckyItems: parsed.luckyItems.slice(0, 3).map((x) => ({
        category: String(x?.category ?? ''),
        emoji: String(x?.emoji ?? '✨'),
        item: String(x?.item ?? ''),
        tip: String(x?.tip ?? ''),
      })),
      advice: String(parsed.advice ?? ''),
      strength: parsed.strength != null ? String(parsed.strength) : undefined,
    }
  } catch (e) {
    console.warn('[AI API]', e)
    return null
  }
}
