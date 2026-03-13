import { useRef } from 'react'
import { useApp } from '@/context/AppContext'
import type { SajuMeta } from '@/types/saju'
import type { CalendarType, BirthMinute } from '@/types/saju'

const CALENDAR_OPTIONS: { value: CalendarType; label: string }[] = [
  { value: 'solar', label: '양력' },
  { value: 'lunar', label: '음력' },
  { value: 'leap', label: '윤달' },
]

const MINUTE_OPTIONS: BirthMinute[] = ['00', '30']

export function InputView() {
  const { form, setForm, startAnalysis, loadFromJson } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startAnalysis()
  }

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as SajuMeta
        if (json.saju_data && json.user_id) {
          loadFromJson(json)
        }
      } catch {
        alert('유효한 JSON 파일이 아닙니다.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-text">
      <div className="bg-blur-orbs absolute inset-0" />
      <div className="absolute left-[10%] top-[10%] h-24 w-24 rounded-full bg-amber-500/10 blur-[50px]" />
      <div className="absolute right-[5%] top-[40%] h-32 w-32 rounded-full bg-amber-600/8 blur-[60px]" />

      <div className="relative z-10 mx-auto max-w-mobile px-5 pb-24 pt-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-6 w-full rounded-[13px] border border-gold/35 py-3 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
        >
          기존 사주 데이터 불러오기 (.json)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoadFile}
        />

        <div className="mb-7 text-center">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
            STEP 1 — 정보 입력
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-gold">
            사주 정보 입력
          </h1>
          <p className="mt-2 text-xs tracking-wide text-text-dim">
            생년월일시를 입력하면 AI가 천기를 읽어드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-[18px] border border-border bg-card p-5 backdrop-blur-md">
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
              기본 정보
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 text-[10px] font-medium tracking-wide text-gold-dim">
                  이름
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-[10px] border border-gold/30 bg-white/5 px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20"
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <div className="mb-2 text-[10px] font-medium tracking-wide text-gold-dim">
                  성별
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, gender: 'female' as const }))}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-medium tracking-wide transition ${
                      form.gender === 'female'
                        ? 'border border-gold/50 bg-gold/15 text-gold'
                        : 'border border-gold/20 bg-transparent text-text-dim'
                    }`}
                  >
                    여성 ♀
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, gender: 'male' as const }))}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-medium tracking-wide transition ${
                      form.gender === 'male'
                        ? 'border border-gold/50 bg-gold/15 text-gold'
                        : 'border border-gold/20 bg-transparent text-text-dim'
                    }`}
                  >
                    남성 ♂
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-border bg-card p-5 backdrop-blur-md">
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dim">
              생년월일시
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[10px] font-medium tracking-wide text-gold-dim">
                  달력 유형
                </div>
                <div className="flex gap-2">
                  {CALENDAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, calendarType: opt.value }))
                      }
                      className={`flex-1 rounded-lg py-2.5 text-sm font-medium tracking-wide transition ${
                        form.calendarType === opt.value
                          ? 'border border-gold/50 bg-gold/15 text-gold'
                          : 'border border-gold/20 bg-transparent text-text-dim'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="mb-1.5 text-[10px] font-medium tracking-wide text-gold-dim">
                    년
                  </div>
                  <input
                    type="number"
                    value={form.birthYear}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthYear: e.target.value }))
                    }
                    className="w-full rounded-[10px] border border-gold/30 bg-white/5 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="1990"
                    min={1900}
                    max={2050}
                  />
                </div>
                <div>
                  <div className="mb-1.5 text-[10px] font-medium tracking-wide text-gold-dim">
                    월
                  </div>
                  <input
                    type="number"
                    value={form.birthMonth}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthMonth: e.target.value }))
                    }
                    className="w-full rounded-[10px] border border-gold/30 bg-white/5 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="1"
                    min={1}
                    max={12}
                  />
                </div>
                <div>
                  <div className="mb-1.5 text-[10px] font-medium tracking-wide text-gold-dim">
                    일
                  </div>
                  <input
                    type="number"
                    value={form.birthDay}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthDay: e.target.value }))
                    }
                    className="w-full rounded-[10px] border border-gold/30 bg-white/5 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="1"
                    min={1}
                    max={31}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-[10px] font-medium tracking-wide text-gold-dim">
                    시 (0~23, 모르면 12)
                  </div>
                  <input
                    type="number"
                    value={form.birthHour}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, birthHour: e.target.value }))
                    }
                    className="w-full rounded-[10px] border border-gold/30 bg-white/5 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-gold/70 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="12"
                    min={0}
                    max={23}
                  />
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-medium tracking-wide text-gold-dim">
                    분 (00분 / 30분)
                  </div>
                  <div className="flex gap-2">
                    {MINUTE_OPTIONS.map((min) => (
                      <button
                        key={min}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, birthMinute: min }))
                        }
                        className={`flex-1 rounded-[10px] border py-2.5 text-sm font-medium transition ${
                          form.birthMinute === min
                            ? 'border-gold/50 bg-gold/15 text-gold'
                            : 'border-gold/20 bg-transparent text-text-dim'
                        }`}
                      >
                        {min}분
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-[13px] bg-gradient-to-br from-amber-500/90 via-gold-light/90 to-amber-500/90 py-4 font-semibold tracking-wide text-amber-950 shadow-lg shadow-amber-900/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            ✦  AI 이지모드 분석  ✦
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] tracking-wide text-text-faint">
          입력하신 정보는 분석에만 사용되며 별도 저장되지 않습니다
        </p>
      </div>
    </div>
  )
}
