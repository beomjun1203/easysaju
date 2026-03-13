import { elementsToRatios, ELEMENT_LABELS, type ElementKey } from '@/utils/elements'
import type { ElementsCount } from '@/types/saju'

const ELEMENT_COLORS: Record<ElementKey, string> = {
  wood: '#87C77D',
  fire: '#E8A598',
  earth: '#F7D4A0',
  metal: '#B0B0B0',
  water: '#A8D4ED',
}

const ELEMENT_ORDER: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water']

interface ElementsChartProps {
  elementsCount: ElementsCount
  title?: string
}

export function ElementsChart({ elementsCount, title }: ElementsChartProps) {
  const ratios = elementsToRatios(elementsCount)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md">
      {title && (
        <h3 className="mb-4 text-center text-sm font-medium text-gold-dim">{title}</h3>
      )}
      <div className="flex flex-col gap-3">
        {ELEMENT_ORDER.map((key) => {
          const pct = Math.round(ratios[key] * 100)
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-8 text-sm text-text-dim">{ELEMENT_LABELS[key]}</span>
              <div className="h-6 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: ELEMENT_COLORS[key],
                  }}
                />
              </div>
              <span className="w-10 text-right text-sm text-text-dim">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
