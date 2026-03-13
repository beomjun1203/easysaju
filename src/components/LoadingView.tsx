import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { fetchSajuAI } from '@/api/aiSaju'

const MIN_LOADING_MS = 2000

export function LoadingView() {
  const { meta, finishLoading, updateMeta } = useApp()

  useEffect(() => {
    if (!meta) return
    const minDelay = new Promise<void>((r) => setTimeout(r, MIN_LOADING_MS))
    const aiPromise = fetchSajuAI(meta).then((aiResult) => {
      if (aiResult) {
        updateMeta((m) => ({ ...m, ai_result: aiResult }))
      }
    })
    Promise.all([aiPromise, minDelay]).finally(() => finishLoading())
  }, [meta, updateMeta, finishLoading])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-text">
      <div className="mx-auto max-w-mobile text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <p className="text-text">
          우주의 기운을 모아 명식을 분석 중입니다...
        </p>
        <p className="mt-2 text-sm text-text-dim">잠시만 기다려 주세요</p>
      </div>
    </div>
  )
}
