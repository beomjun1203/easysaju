import { elementsToRatios, ELEMENT_LABELS, type ElementKey } from '@/utils/elements'
import type { ElementsCount } from '@/types/saju'

const ELEMENT_COLORS: Record<ElementKey, string> = {
  wood: '#a8d5a2',
  fire: '#f0b4a8',
  earth: '#f5e0b0',
  metal: '#c4c4c4',
  water: '#b8d8ed',
}

const ELEMENT_ORDER: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water']

interface ElementsChartProps {
  elementsCount: ElementsCount
  title?: string
}

/** 세그먼트 사이 간격(끝이 살짝 튀어나온 느낌) */
const GAP = 4
const R = 58
const C = 2 * Math.PI * R

function getSegment(ratio: number, circumference: number, offset: number) {
  const visibleLength = Math.max(0, ratio * circumference - GAP)
  return { dasharray: `${visibleLength} ${circumference}`, dashoffset: -offset }
}

export function ElementsChart({ elementsCount, title }: ElementsChartProps) {
  const ratios = elementsToRatios(elementsCount)
  let offset = 0
  const segments = ELEMENT_ORDER.map((key) => {
    const ratio = ratios[key]
    const seg = getSegment(ratio, C, offset)
    offset += ratio * C + GAP
    return { key, ratio, ...seg }
  })

  return (
    <div className="card-doodle rounded-2xl border border-border bg-card p-5">
      {title && (
        <h3 className="mb-4 text-center text-base font-medium text-point-dim">{title}</h3>
      )}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
        <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center p-2">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
            {segments.map(({ key, dasharray, dashoffset }) => (
              <circle
                key={key}
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={ELEMENT_COLORS[key]}
                strokeWidth="20"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                className="transition-[stroke-dasharray] duration-500"
              />
            ))}
            <circle cx="80" cy="80" r={R - 16} fill="#ffffff" />
          </svg>
        </div>
        <ul className="flex flex-col gap-1.5 text-base text-text-dim">
          {ELEMENT_ORDER.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <span
                className="h-3 w-3 flex-shrink-0 rounded-full"
                style={{ backgroundColor: ELEMENT_COLORS[key] }}
              />
              <span>{ELEMENT_LABELS[key]} {Math.round(ratios[key] * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
