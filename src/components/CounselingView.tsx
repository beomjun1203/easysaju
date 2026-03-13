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
      <div className="bg-blur-orbs absolute inset-0" />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* 상단: 뒤로가기(분석 페이지로) + 제목 */}
        <div className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm">
          <button
            type="button"
            onClick={goToResult}
            className="rounded-[10px] border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/20"
          >
            ← 분석 결과로
          </button>
          <span className="text-xs font-medium uppercase tracking-wider text-gold-dim">
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
                      ? 'bg-gold/20 border border-gold/30 text-text'
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
        <div className="border-t border-border bg-card/80 p-4 backdrop-blur-sm">
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
              className="flex-1 rounded-xl border border-gold/30 bg-white/5 px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="rounded-xl bg-gold/80 px-5 py-3 font-medium text-amber-950 transition hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={handleExportWithHistory}
            className="w-full rounded-xl border border-gold/35 py-3 text-sm font-medium tracking-wide text-gold transition hover:bg-gold/10"
          >
            내 사주 및 상담 기록 저장하기
          </button>
        </div>
      </div>
    </div>
  )
}
