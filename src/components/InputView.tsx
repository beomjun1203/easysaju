import { useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { SajuMeta } from '@/types/saju'
import type { CalendarType } from '@/types/saju'

const CALENDAR_OPTIONS: { value: CalendarType; label: string }[] = [
  { value: 'solar', label: '양력' },
  { value: 'lunar', label: '음력' },
  { value: 'leap', label: '윤달' },
]

const YEAR_MIN = 1900
const YEAR_MAX = 2100

function formatYear(val: string): string {
  const n = val.replace(/\D/g, '').slice(0, 4)
  if (n === '') return ''
  if (n.length < 4) return n
  const num = Number(n)
  return String(Math.min(YEAR_MAX, Math.max(YEAR_MIN, num)))
}

function formatMonth(val: string): string {
  const n = val.replace(/\D/g, '').slice(0, 2)
  if (n === '') return ''
  if (n.length < 2) return n
  const num = Number(n)
  const clamped = Math.min(12, Math.max(1, num))
  return String(clamped).padStart(2, '0')
}

function formatDay(val: string): string {
  const n = val.replace(/\D/g, '').slice(0, 2)
  if (n === '') return ''
  if (n.length < 2) return n
  const num = Number(n)
  const clamped = Math.min(31, Math.max(1, num))
  return String(clamped).padStart(2, '0')
}

function validateYear(year: string): boolean {
  if (!year || year.length !== 4) return false
  const n = Number(year)
  return n >= YEAR_MIN && n <= YEAR_MAX
}

function validateMonth(month: string): boolean {
  if (!month || month.length > 2) return false
  const n = Number(month)
  return n >= 1 && n <= 12
}

function validateDay(day: string): boolean {
  if (!day || day.length > 2) return false
  const n = Number(day)
  return n >= 1 && n <= 31
}

function formatMinute(val: string): string {
  const n = val.replace(/\D/g, '').slice(0, 2)
  if (n === '') return ''
  const num = Math.min(59, Math.max(0, Number(n) ?? 0))
  return String(num)
}

function validateMinute(minute: string): boolean {
  const n = Number(minute)
  return !Number.isNaN(n) && n >= 0 && n <= 59
}

const STEP_NAMES = ['이름', '성별', '달력', '년월일', '시간'] as const

export function InputView() {
  const { form, setForm, startAnalysis, loadFromJson } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [showTimeChoice, setShowTimeChoice] = useState(false)
  const [wantsToEnterTime, setWantsToEnterTime] = useState<boolean | null>(null)
  const [errors, setErrors] = useState<{ year?: string; month?: string; day?: string; minute?: string }>({})

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as SajuMeta
        if (json.saju_data && json.user_id) loadFromJson(json)
      } catch {
        alert('유효한 JSON 파일이 아닙니다.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const canGoNext = (): boolean => {
    if (step === 0) return (form?.name ?? '').trim().length > 0
    if (step === 1) return true
    if (step === 2) return true
    if (step === 3) {
      return (
        validateYear(form?.birthYear ?? '') &&
        validateMonth(form?.birthMonth ?? '') &&
        validateDay(form?.birthDay ?? '')
      )
    }
    return true
  }

  const setValidationErrors = () => {
    if (step !== 3) return
    const next: { year?: string; month?: string; day?: string } = {}
    if (!validateYear(form?.birthYear ?? '')) next.year = '년은 4자리 숫자로 입력해 주세요.'
    if (!validateMonth(form?.birthMonth ?? '')) next.month = '월은 01~12 사이로 입력해 주세요.'
    if (!validateDay(form?.birthDay ?? '')) next.day = '일은 01~31 사이로 입력해 주세요.'
    setErrors(next)
  }

  const goNext = () => {
    if (step === 3) {
      if (canGoNext()) {
        setErrors({})
        setShowTimeChoice(true)
        setStep(4)
      } else {
        setValidationErrors()
      }
      return
    }
    if (step < 3 && canGoNext()) {
      setErrors({})
      setStep((s) => s + 1)
    }
  }

  const handleAnalyzeWithDefaultTime = () => {
    startAnalysis({ birthHour: '12', birthMinute: '00' })
  }

  const handleAnalyzeWithTime = () => {
    const min = form?.birthMinute ?? '0'
    if (!validateMinute(min)) {
      setErrors((e) => ({ ...e, minute: '분은 0~59 사이로 입력해 주세요.' }))
      return
    }
    setErrors((e) => ({ ...e, minute: undefined }))
    startAnalysis()
  }

  const handleYearChange = (v: string) => {
    setForm((f) => ({ ...f, birthYear: formatYear(String(v ?? '')) }))
    setErrors((e) => ({ ...e, year: undefined }))
  }
  const handleMonthChange = (v: string) => {
    setForm((f) => ({ ...f, birthMonth: formatMonth(String(v ?? '')) }))
    setErrors((e) => ({ ...e, month: undefined }))
  }
  const handleDayChange = (v: string) => {
    setForm((f) => ({ ...f, birthDay: formatDay(String(v ?? '')) }))
    setErrors((e) => ({ ...e, day: undefined }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    if (e.target instanceof HTMLButtonElement) return
    if (showTimeChoice && step >= 4) return
    e.preventDefault()
    goNext()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-text">
      <div className="bg-pastel-doodle absolute inset-0" />

      <div
        className="relative z-10 mx-auto max-w-mobile px-5 pb-24 pt-6"
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-6 w-full rounded-[13px] border border-border py-3 text-base font-medium tracking-wide text-text transition hover:bg-surface2"
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

        <p className="mb-6 text-center text-base text-point-alt">
          간단한 정보를 입력해주세요
        </p>

        <div className="space-y-4">
          {/* Step 0: Name */}
          <div
            className="card-doodle rounded-[18px] border border-border bg-card p-5 transition-all duration-300"
            style={{ opacity: step >= 0 ? 1 : 0.6 }}
          >
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
              {STEP_NAMES[0]}
            </div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
              placeholder="예: 홍길동"
            />
          </div>

          {/* Step 1: Gender */}
          {step >= 1 && (
            <div
              className="card-doodle animate-fade-in rounded-[18px] border border-border bg-card p-5"
            >
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
                {STEP_NAMES[1]}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: 'male' as const }))}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                    form.gender === 'male'
                      ? 'border-point-alt bg-point-alt/10 text-point-alt'
                      : 'border-border bg-transparent text-text-dim'
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: 'female' as const }))}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                    form.gender === 'female'
                      ? 'border-point-alt bg-point-alt/10 text-point-alt'
                      : 'border-border bg-transparent text-text-dim'
                  }`}
                >
                  여성
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Calendar */}
          {step >= 2 && (
            <div className="card-doodle animate-fade-in rounded-[18px] border border-border bg-card p-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
                {STEP_NAMES[2]}
              </div>
              <div className="flex gap-2">
                {CALENDAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, calendarType: opt.value }))
                    }
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                      form.calendarType === opt.value
                        ? 'border-point-alt bg-point-alt/10 text-point-alt'
                        : 'border-border bg-transparent text-text-dim'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: YMD */}
          {step >= 3 && (
            <div className="card-doodle animate-fade-in rounded-[18px] border border-border bg-card p-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
                {STEP_NAMES[3]}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-point-dim">년 (4자리)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={form?.birthYear ?? ''}
                    onChange={(e) => handleYearChange((e?.target?.value) ?? '')}
                    className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
                    placeholder="1990"
                  />
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-600">{errors.year}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-point-dim">월 (2자리)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={form?.birthMonth ?? ''}
                    onChange={(e) => handleMonthChange((e?.target?.value) ?? '')}
                    className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
                    placeholder="01"
                  />
                  {errors.month && (
                    <p className="mt-1 text-xs text-red-600">{errors.month}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-point-dim">일 (2자리)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={form?.birthDay ?? ''}
                    onChange={(e) => handleDayChange((e?.target?.value) ?? '')}
                    className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
                    placeholder="01"
                  />
                  {errors.day && (
                    <p className="mt-1 text-xs text-red-600">{errors.day}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Time choice + optional time inputs + 분석하기 */}
          {showTimeChoice && step >= 4 && (
            <div className="animate-fade-in space-y-4">
              {wantsToEnterTime === null && (
                <div className="card-doodle rounded-[18px] border border-border bg-card p-5">
                  <p className="mb-3 text-sm text-text">태어난 시간을 아시나요?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWantsToEnterTime(true)}
                      className="flex-1 rounded-lg border border-point-alt bg-point-alt/10 py-2.5 text-sm font-medium text-point-alt transition hover:bg-point-alt/20"
                    >
                      예 (시간 입력)
                    </button>
                    <button
                      type="button"
                      onClick={handleAnalyzeWithDefaultTime}
                      className="flex-1 rounded-lg border border-border bg-surface2 py-2.5 text-sm font-medium text-text transition hover:bg-point/10"
                    >
                      아니오 (12시)
                    </button>
                  </div>
                </div>
              )}

              {wantsToEnterTime === true && (
                <div className="card-doodle animate-fade-in rounded-[18px] border border-border bg-card p-5">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-point-dim">
                    {STEP_NAMES[4]}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-point-dim">시 (0~23)</label>
                      <input
                        type="number"
                        value={form.birthHour}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, birthHour: e.target.value }))
                        }
                        className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
                        placeholder="12"
                        min={0}
                        max={23}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-point-dim">분 (0~59)</label>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={form.birthMinute}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, birthMinute: formatMinute(e.target.value) }))
                          setErrors((err) => ({ ...err, minute: undefined }))
                        }}
                        className="w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 text-sm text-text focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
                        placeholder="0"
                      />
                      {errors.minute && (
                        <p className="mt-1 text-xs text-red-600">{errors.minute}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAnalyzeWithTime}
                    className="mt-4 w-full rounded-[13px] bg-point-alt py-3 font-semibold text-white transition hover:bg-point-alt-dim active:opacity-90"
                  >
                    분석하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next / 분석하기 (before time choice) */}
        {step < 4 && !showTimeChoice && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext()}
            className="mt-6 w-full rounded-[13px] bg-point-alt py-4 font-semibold text-white transition hover:bg-point-alt-dim disabled:opacity-50 disabled:cursor-not-allowed active:opacity-90"
          >
            {step === 3 ? '다음' : '다음'}
          </button>
        )}

        {step < 3 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="mt-3 w-full rounded-[13px] border border-border py-2 text-sm text-text-dim transition hover:bg-surface2"
          >
            이전
          </button>
        )}

        {step === 3 && !showTimeChoice && (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-3 w-full rounded-[13px] border border-border py-2 text-sm text-text-dim transition hover:bg-surface2"
          >
            이전
          </button>
        )}
      </div>
    </div>
  )
}
