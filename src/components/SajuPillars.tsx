import { ELEMENT_LABELS, getElementFromChar } from '@/utils/elements'
import { stemToHanja, branchToHanja } from '@/utils/hanja'
import type { SajuData } from '@/types/saju'
import type { ElementKey } from '@/utils/elements'

const ELEMENT_COLORS: Record<ElementKey, string> = {
  wood: '#a8d5a2',
  fire: '#f0b4a8',
  earth: '#f5e0b0',
  metal: '#c4c4c4',
  water: '#b8d8ed',
}

/** 표 컬럼: 생시, 생일, 생월, 생년 (이미지와 동일한 순서) */
const COL_LABELS = ['생시', '생일', '생월', '생년'] as const
/** 데이터 인덱스: 시=3, 일=2, 월=1, 년=0 */
const COL_INDEX = [3, 2, 1, 0] as const

interface SajuPillarsProps {
  saju_data: SajuData
}

export function SajuPillars({ saju_data }: SajuPillarsProps) {
  const { heavenly_stems, earthly_branches } = saju_data
  const hasHour = heavenly_stems[3] != null && earthly_branches[3] != null
  const columns = hasHour ? COL_INDEX : COL_INDEX.slice(1) // 시 없으면 생일·생월·생년만
  const colLabels = hasHour ? COL_LABELS : ['생일', '생월', '생년']

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[280px] border-collapse text-center text-base">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 text-sm font-medium uppercase tracking-wider text-point-dim" />
            {colLabels.map((label) => (
              <th key={label} className="py-2 text-sm font-medium uppercase tracking-wider text-point-dim">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2 pr-2 text-left text-sm text-point-dim">천간</td>
            {columns.map((i) => {
              const stem = heavenly_stems[i]
              const el = stem ? getElementFromChar(stem) : null
              if (!stem)
                return <td key={i} className="py-2" />
              return (
                <td key={i} className="py-2">
                  <div className="text-lg font-semibold text-text" style={el ? { color: ELEMENT_COLORS[el] } : undefined}>
                    {stem}{stemToHanja(stem)}
                  </div>
                  <div className="text-sm text-text-dim">{el ? ELEMENT_LABELS[el] : ''}</div>
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="py-2 pr-2 text-left text-sm text-point-dim">지지</td>
            {columns.map((i) => {
              const branch = earthly_branches[i]
              const el = branch ? getElementFromChar(branch) : null
              if (!branch)
                return <td key={i} className="py-2" />
              return (
                <td key={i} className="py-2">
                  <div className="text-lg font-semibold text-text" style={el ? { color: ELEMENT_COLORS[el] } : undefined}>
                    {branch}{branchToHanja(branch)}
                  </div>
                  <div className="text-sm text-text-dim">{el ? ELEMENT_LABELS[el] : ''}</div>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
