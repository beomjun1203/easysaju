import { useState, useCallback } from 'react'
import type { SajuMeta, ViewType, FormInput } from '@/types/saju'
import { extractSaju } from '@/utils/sajuExtract'

const initialForm: FormInput = {
  name: '',
  gender: 'male',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  calendarType: 'solar',
  birthHour: '12',
  birthMinute: '00',
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useAppStore() {
  const [view, setView] = useState<ViewType>('home')
  const [form, setForm] = useState<FormInput>(initialForm)
  const [meta, setMeta] = useState<SajuMeta | null>(null)
  const [loading, setLoading] = useState(false)

  const resetAll = useCallback(() => {
    setView('home')
    setForm(initialForm)
    setMeta(null)
    setLoading(false)
  }, [])

  const loadFromJson = useCallback((loaded: SajuMeta) => {
    setMeta(loaded)
    setView('result')
  }, [])

  const setMetaFromForm = useCallback((overrideForm?: Partial<FormInput>): boolean => {
    const f = { ...form, ...overrideForm }
    const {
      name,
      gender,
      birthYear,
      birthMonth,
      birthDay,
      calendarType,
      birthHour,
      birthMinute,
    } = f
    const y = parseInt(birthYear, 10)
    const m = parseInt(birthMonth, 10)
    const d = parseInt(birthDay, 10)
    if (!y || !m || !d || Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return false

    try {
      const isLunar = calendarType === 'lunar' || calendarType === 'leap'
      const isLeapMonth = calendarType === 'leap'
      const h = parseInt(birthHour, 10)
      const hour = !Number.isNaN(h) && h >= 0 && h <= 23 ? h : 12
      const minNum = parseInt(birthMinute, 10)
      const minute = !Number.isNaN(minNum) && minNum >= 0 && minNum <= 59 ? minNum : 0

      const { saju_data, is_time_known } = extractSaju({
        year: y,
        month: m,
        day: d,
        isLunar,
        isLeapMonth,
        hour,
        minute,
      })

      const birth_date_solar = `${String(y)}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const birth_time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

      setMeta({
        user_id: generateId(),
        name,
        gender,
        is_time_known,
        birth_date_solar,
        birth_time,
        saju_data,
        counseling_history: [],
      })
      return true
    } catch (err) {
      console.error('[setMetaFromForm]', err)
      return false
    }
  }, [form])

  const startAnalysis = useCallback((overrides?: Partial<FormInput>) => {
    const ok = setMetaFromForm(overrides)
    if (ok) {
      setView('loading')
      setLoading(true)
    }
  }, [setMetaFromForm])

  const finishLoading = useCallback(() => {
    setLoading(false)
    setView('result')
  }, [])

  const goToInput = useCallback(() => {
    setView('input')
  }, [])

  const goToResult = useCallback(() => {
    setView('result')
  }, [])

  const addCounselingSummary = useCallback((summary: string) => {
    setMeta((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        counseling_history: [...prev.counseling_history, summary],
      }
    })
  }, [])

  const updateMeta = useCallback((updater: (m: SajuMeta) => SajuMeta) => {
    setMeta((prev) => (prev ? updater(prev) : null))
  }, [])

  return {
    view,
    setView,
    form,
    setForm,
    meta,
    setMeta,
    loading,
    setLoading,
    resetAll,
    loadFromJson,
    startAnalysis,
    finishLoading,
    goToInput,
    goToResult,
    addCounselingSummary,
    updateMeta,
  }
}
