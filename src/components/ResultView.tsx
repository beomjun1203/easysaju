import { useApp } from '@/context/AppContext'
import { ElementsChart } from './ElementsChart'
import { SajuPillars } from './SajuPillars'
import {
  getOneLineSummary,
  getTraitSummary,
  getTodayScore,
  getLuckyItems,
  getTodayAdvice,
} from '@/utils/easySummary'

export function ResultView() {
  const { meta, resetAll } = useApp()
  if (!meta) return null

  const displayName = meta.name ? `${meta.name}님` : '사용자님'
  const ai = meta.ai_result
  const oneLine = ai?.summary ?? getOneLineSummary(meta.saju_data)
  const traits = getTraitSummary(meta.saju_data)
  const score = ai?.score ?? getTodayScore(meta.saju_data)
  const luckyItems = ai?.luckyItems?.length ? ai.luckyItems : getLuckyItems()
  const todayAdvice = ai?.advice ?? getTodayAdvice()
  const strength = ai?.strength

  const handleExport = () => {
    const { name, ...rest } = meta
    const anonymized = { ...rest }
    const blob = new Blob([JSON.stringify(anonymized, null, 2)], {
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
    const shareText = `🔮 이지 모드 사주 분석\n${displayName}의 오늘 총운 ${score}점\n${oneLine.slice(0, 50)}...\n\n무료 분석 → ${window.location.href}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: '이지 모드 사주풀이',
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
      <div className="bg-blur-orbs absolute inset-0" />
      <div className="absolute right-[5%] top-[20%] h-28 w-28 rounded-full bg-amber-500/10 blur-[50px]" />

      <div className="relative z-10 mx-auto max-w-mobile space-y-5 px-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-[10px] border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/20"
          >
            ← 처음부터 다시 하기
          </button>
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-dim">
            분석 결과
          </span>
        </div>
        <h1 className="text-xl font-bold text-text">{displayName}의 사주</h1>

        <div className="text-center">
          <div className="relative mx-auto inline-flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
              <circle
                className="fill-none stroke-gold/20"
                strokeWidth="3"
                cx="18"
                cy="18"
                r="15.9"
              />
              <circle
                className="fill-none stroke-gold transition-[stroke-dashoffset] duration-700"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={99.9}
                strokeDashoffset={99.9 * (1 - score / 100)}
                cx="18"
                cy="18"
                r="15.9"
              />
            </svg>
            <span className="absolute text-2xl font-bold text-gold">{score}</span>
          </div>
          <div className="mt-2 text-[10px] font-medium uppercase tracking-wider text-gold-dim">
            오늘의 총운 점수
          </div>
        </div>

        <div className="rounded-[18px] border border-border bg-card p-5 backdrop-blur-md">
          <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
            사주팔자
          </div>
          <SajuPillars saju_data={meta.saju_data} />
        </div>

        <ElementsChart
          elementsCount={meta.saju_data.elements_count}
          title="나의 오행"
        />

        <div className="rounded-[18px] border border-border bg-card p-5 backdrop-blur-md">
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
            오늘의 운세
          </div>
          <p className="text-sm leading-relaxed text-text">{oneLine}</p>
          <ul className="mt-3 space-y-1 text-sm text-text-dim">
            {traits.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
            ✦ 오늘의 행운 아이템 Top 3
          </div>
          <div className="space-y-3">
            {luckyItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-4 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] uppercase tracking-wider text-gold-dim">
                      {item.category}
                    </div>
                    <div className="font-semibold text-text">{item.item}</div>
                  </div>
                  <span className="text-lg font-bold text-gold/50">0{i + 1}</span>
                </div>
                <p className="mt-2 rounded-r border-l-2 border-gold/40 bg-gold/5 py-1.5 pl-3 pr-2 text-[11px] text-text-dim">
                  💡 {item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-border bg-gradient-to-br from-gold/10 to-transparent p-5 backdrop-blur-md">
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
            오늘의 조언 & 강점
          </div>
          <div className="flex gap-3">
            <span className="text-lg">🔮</span>
            <p className="text-sm leading-relaxed text-text">{todayAdvice}</p>
          </div>
          <div className="mt-3 flex gap-3">
            <span className="text-lg">💪</span>
            <p className="text-sm leading-relaxed text-text">
              {strength ?? '타고난 강점을 믿고 차분히 행동하시면 좋은 하루가 됩니다.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-xl border border-gold/35 bg-card py-3 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
          >
            📤 공유하기
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 rounded-xl border border-gold/35 bg-card py-3 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
          >
            💾 저장
          </button>
        </div>

        <p className="text-center text-[10px] tracking-wide text-text-faint">
          ✦ AI 생성 결과이며 참고용입니다 ✦
        </p>
      </div>
    </div>
  )
}
