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
      <div className="bg-pastel-doodle absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-mobile text-center">
        <div className="mb-6 h-14 w-14 animate-spin rounded-full border-2 border-point/30 border-t-point-alt" />
        <p className="text-base text-text">잠시만 기다려주세요</p>
      </div>
    </div>
  )
}
