import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export function HomeView() {
  const { goToInput, loadFromJson } = useApp()
  const [heroImageError, setHeroImageError] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">

      <div className="relative z-10 mx-auto max-w-mobile px-5 pb-24 pt-14">
        <header className="mb-6 text-center">
          <p className="mb-2 text-base tracking-wide text-point">Easy Saju</p>
          <h1 className="mb-2 text-5xl font-bold leading-none text-point-alt">
            이지 사주
          </h1>
          <p className="text-base leading-relaxed text-text-dim">
            쉽게 알아보는 사주
          </p>
        </header>

        <div className="relative mx-auto my-10 flex h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-2xl bg-white">
          {!heroImageError && (
            <img
              src="/hero.png"
              alt=""
              className="h-full w-full object-cover"
              onError={() => setHeroImageError(true)}
            />
          )}
          {heroImageError && (
            <p className="text-center text-base text-point-dim">
              프로젝트 최상위(public) 폴더에 hero.png를 넣어주세요
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={goToInput}
          className="w-full rounded-[13px] bg-point-alt py-4 font-bold tracking-wide text-white shadow-sm transition hover:bg-point-alt-dim active:opacity-90"
        >
          시작하기
        </button>

        <button
          type="button"
          onClick={() => document.getElementById('load-json-input')?.click()}
          className="mt-4 w-full rounded-[13px] border border-border py-3 text-base font-medium tracking-wide text-text transition hover:bg-surface2"
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
      </div>
    </div>
  )
}
