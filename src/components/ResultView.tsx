import { useApp } from '@/context/AppContext'
import { ElementsChart } from './ElementsChart'
import { SajuPillars } from './SajuPillars'

export function ResultView() {
  const { meta, resetAll } = useApp()
  if (!meta) return null

  const displayName = meta.name ? `${meta.name}님` : '사용자님'

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(meta, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saju-${meta.user_id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareText = `🔮 이지 사주\n${displayName}의 사주\n${window.location.href}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: '이지 사주',
          text: shareText,
          url: window.location.href,
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        alert('클립보드에 복사되었습니다.')
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      alert('클립보드에 복사되었습니다.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface pb-28 pt-6 text-text">
      <div className="bg-pastel-doodle absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-mobile space-y-5 px-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-[10px] bg-point-alt px-4 py-2 text-base font-medium tracking-wide text-white transition hover:bg-point-alt-dim active:opacity-90"
          >
            ← 처음부터 다시 하기
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-white py-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white">
            <img
              src="/hero.png"
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <div className="min-w-0 flex-1 rounded-2xl rounded-bl-md bg-surface2 py-3 pl-4 pr-4 shadow-sm">
            <p className="text-base font-medium text-text">
              {displayName}의 분석 결과입니다
            </p>
          </div>
        </div>

        <ElementsChart
          elementsCount={meta.saju_data.elements_count}
          title="나의 오행"
        />

        <div className="card-doodle rounded-[18px] border border-border bg-card p-5">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
            사주팔자
          </div>
          <SajuPillars saju_data={meta.saju_data} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-xl bg-point-alt py-3 text-base font-medium tracking-wide text-white transition hover:bg-point-alt-dim active:opacity-90"
          >
            공유하기
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 rounded-xl bg-point-alt py-3 text-base font-medium tracking-wide text-white transition hover:bg-point-alt-dim active:opacity-90"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
