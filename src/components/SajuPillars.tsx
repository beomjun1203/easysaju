import { ELEMENT_LABELS, getElementFromChar, BRANCH_ZODIAC } from '@/utils/elements'
import type { SajuData } from '@/types/saju'
import type { ElementKey } from '@/utils/elements'

const PILLAR_LABELS = ['연주', '월주', '일주', '시주'] as const
const PILLAR_SUB = ['Year', 'Month', 'Day', 'Hour'] as const

const ELEMENT_COLORS: Record<ElementKey, string> = {
  wood: '#22c55e',
  fire: '#ef4444',
  earth: '#eab308',
  metal: '#94a3b8',
  water: '#3b82f6',
}

interface SajuPillarsProps {
  saju_data: SajuData
}

export function SajuPillars({ saju_data }: SajuPillarsProps) {
  const { heavenly_stems, earthly_branches } = saju_data
  const hasHour = heavenly_stems[3] != null && earthly_branches[3] != null
  const count = hasHour ? 4 : 3

  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, i) => {
        const stem = heavenly_stems[i]
        const branch = earthly_branches[i]
        const stemEl = stem ? getElementFromChar(stem) : null
        const branchEl = branch ? getElementFromChar(branch) : null
        const zodiac = branch ? BRANCH_ZODIAC[branch] : null
        return (
          <div
            key={i}
            className="flex flex-1 flex-col rounded-xl border border-border bg-white/5 p-3 text-center"
          >
            <div className="mb-1 text-[9px] font-medium uppercase tracking-wider text-gold-dim">
              {PILLAR_SUB[i]}
            </div>
            <div className="mb-0.5 text-[9px] text-gold-dim">{PILLAR_LABELS[i]}</div>
            {stem && (
              <>
                <div
                  className="text-xl font-bold leading-none"
                  style={{ color: stemEl ? ELEMENT_COLORS[stemEl] : undefined }}
                >
                  {stem}
                </div>
                <div className="text-[9px] opacity-70">
                  {stemEl ? ELEMENT_LABELS[stemEl] : ''}
                </div>
              </>
            )}
            <div className="my-1.5 mx-auto h-px w-4 bg-gold/30" />
            {branch && (
              <>
                <div
                  className="text-xl font-bold leading-none"
                  style={{ color: branchEl ? ELEMENT_COLORS[branchEl] : undefined }}
                >
                  {branch}
                </div>
                <div className="text-[9px] opacity-70">
                  {branchEl ? ELEMENT_LABELS[branchEl] : ''}
                </div>
                {zodiac && (
                  <div className="mt-1.5 text-[11px] text-text-dim">🐾 {zodiac}</div>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
