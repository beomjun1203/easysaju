import { useApp } from '@/context/AppContext'

export function HomeView() {
  const { goToInput, loadFromJson } = useApp()

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      {/* 블러 보케 배경 */}
      <div className="bg-blur-orbs absolute inset-0" />
      <div className="absolute left-[10%] top-[15%] h-32 w-32 rounded-full bg-amber-500/10 blur-[60px]" />
      <div className="absolute bottom-[20%] left-[5%] h-40 w-40 rounded-full bg-amber-600/8 blur-[70px]" />
      <div className="absolute right-[10%] top-[30%] h-28 w-28 rounded-full bg-amber-400/10 blur-[50px]" />

      <div className="relative z-10 mx-auto max-w-mobile px-5 pb-24 pt-14">
        {/* 헤더 */}
        <header className="mb-6 text-center">
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dim">
            Four Pillars of Destiny
          </div>
          <h1
            className="mb-2 bg-gradient-to-br from-gold via-gold-light to-gold bg-clip-text text-5xl font-bold leading-none text-transparent"
          >
            천기누설
          </h1>
          <p className="mb-1 text-sm tracking-wide text-text-dim">天機漏洩</p>
          <p className="text-sm leading-relaxed text-text-dim">
            생년월일시로 쉽게 알아보는 나의 운명
          </p>
        </header>

        {/* 궤도 오브 (우주 궤도처럼 회전) */}
        <div className="relative mx-auto my-10 h-[260px] w-[260px]">
          {/* 중앙 태양/코어 */}
          <div
            className="absolute left-1/2 top-1/2 h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold-light from-0% via-gold via-42% to-amber-900/25 to-72% shadow-[0_0_30px_rgba(212,175,55,0.6)] animate-[pulse-glow_2.8s_ease-in-out_infinite]"
            style={{
              animation: 'pulse-glow 2.8s ease-in-out infinite',
            }}
          />
          {/* 궤도 링 3개 - 서로 반대/다른 속도로 회전 */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-amber-500/10"
            style={{
              width: 248,
              height: 248,
              marginLeft: -124,
              marginTop: -124,
              animation: 'spin 22s linear infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-amber-500/20"
            style={{
              width: 192,
              height: 192,
              marginLeft: -96,
              marginTop: -96,
              animation: 'spin-reverse 15s linear infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-amber-500/30"
            style={{
              width: 140,
              height: 140,
              marginLeft: -70,
              marginTop: -70,
              animation: 'spin 9s linear infinite',
            }}
          />
          {/* 궤도 위 행성들 (각각 다른 색·위상) */}
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]"
            style={{ animation: 'orb-dot 9s linear infinite 0s' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]"
            style={{ animation: 'orb-dot 9s linear infinite -1.8s' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
            style={{ animation: 'orb-dot 9s linear infinite -3.6s' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 shadow-[0_0_8px_#e2e8f0]"
            style={{ animation: 'orb-dot 9s linear infinite -5.4s' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"
            style={{ animation: 'orb-dot 9s linear infinite -7.2s' }}
          />
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={goToInput}
          className="w-full rounded-[13px] bg-gradient-to-br from-amber-500/90 via-gold-light/90 to-amber-500/90 py-4 font-bold tracking-wide text-amber-950 shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        >
          ✦  무료 AI 사주 분석 시작하기  ✦
        </button>

        {/* 기존 데이터 불러오기 */}
        <button
          type="button"
          onClick={() => document.getElementById('load-json-input')?.click()}
          className="mt-4 w-full rounded-[13px] border border-amber-500/35 py-3 text-sm font-medium tracking-wide text-gold transition hover:bg-amber-500/10"
        >
          기존 사주 데이터 불러오기 (.json)
        </button>
        <input
          id="load-json-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result as string)
                if (json.saju_data && json.user_id) loadFromJson(json)
              } catch {
                alert('유효한 JSON 파일이 아닙니다.')
              }
            }
            reader.readAsText(file)
            e.target.value = ''
          }}
        />

        <p className="mt-10 text-center text-[10px] tracking-wide text-text-faint">
          ✦ 사주는 참고용이며 인생의 선택은 당신의 것입니다 ✦
        </p>
      </div>
    </div>
  )
}
