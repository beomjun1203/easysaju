import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'

const PLACEHOLDER_REPLY =
  '입력하신 내용을 바탕으로 추후 AI 분석이 제공됩니다. (현재는 준비 중입니다)'

export function CounselingView() {
  const { meta, goToResult, addCounselingSummary } = useApp()
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [inputText, setInputText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  if (!meta) return null

  const displayName = meta.name ? `${meta.name}님` : '사용자님'

  const handleSend = () => {
    const text = inputText.trim()
    if (!text) return
    setInputText('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    addCounselingSummary(`"${text.slice(0, 30)}${text.length > 30 ? '…' : ''}" 관련 질문`)
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: PLACEHOLDER_REPLY },
    ])
  }

  const handleExportWithHistory = () => {
    const { name, ...rest } = meta
    const anonymized = { ...rest }
    const blob = new Blob([JSON.stringify(anonymized, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saju-counseling-${meta.user_id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface text-text">
      <div className="bg-pastel-doodle absolute inset-0" />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <button
            type="button"
            onClick={goToResult}
            className="rounded-[10px] border border-border bg-surface2 px-4 py-2 text-sm font-medium tracking-wide text-text transition hover:bg-point/10"
          >
            ← 분석 결과로
          </button>
          <span className="text-xs font-medium uppercase tracking-wider text-point-dim">
            AI 맞춤형 운세
          </span>
        </div>

        <p className="px-4 py-2 text-sm text-text-dim">
          {displayName}, 궁금한 것을 입력해 보세요.
        </p>

        {/* 채팅 목록: AI 왼쪽, 사용자 오른쪽 */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          <div className="mx-auto max-w-mobile space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-point-alt/10 border border-point-alt/30 text-text'
                      : 'bg-card border border-border text-text'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 입력 */}
        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto flex max-w-mobile gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-point-alt focus:outline-none focus:ring-2 focus:ring-point-alt/20"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="rounded-xl bg-point-alt px-5 py-3 font-medium text-white transition hover:bg-point-alt-dim disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={handleExportWithHistory}
            className="w-full rounded-xl border border-border py-3 text-sm font-medium tracking-wide text-text transition hover:bg-surface2"
          >
            내 사주 및 상담 기록 저장하기
          </button>
        </div>
      </div>
    </div>
  )
}
