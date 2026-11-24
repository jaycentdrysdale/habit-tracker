import type { KeyboardEvent } from 'react'

export type View = 'today' | 'week'

const TABS: { id: View; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
]

interface Props {
  value: View
  onChange: (v: View) => void
}

export function ViewTabs({ value, onChange }: Props) {
  const index = TABS.findIndex((t) => t.id === value)

  // Arrow keys move between tabs, as screen-reader users expect.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const next = TABS[(index + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
    onChange(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <nav className="tabs-wrap">
      <div className="tabs" role="tablist" aria-label="View" onKeyDown={onKeyDown}>
        <span className="tabs__pill" style={{ transform: `translateX(${index * 100}%)` }} aria-hidden />
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={t.id === value}
            aria-controls={t.id === value ? `view-${t.id}` : undefined}
            tabIndex={t.id === value ? 0 : -1}
            className={`tabs__btn ${t.id === value ? 'is-active' : ''}`}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
