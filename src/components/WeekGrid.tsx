import type { CSSProperties } from 'react'
import type { Habit } from '../types'
import { toKey, todayKey, weekDays } from '../lib/dates'

interface Props {
  habits: Habit[]
  onToggle: (id: string, dateKey: string) => void
}

export function WeekGrid({ habits, onToggle }: Props) {
  const days = weekDays()
  const today = todayKey()
  const longDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="week" role="table" aria-label="Completions this week">
      <div className="week__row week__head" role="row">
        <span role="columnheader">
          <span className="sr-only">Habit</span>
        </span>
        {days.map((d) => {
          const key = toKey(d)
          return (
            <span key={key} role="columnheader" className={key === today ? 'is-today' : ''}>
              <span aria-hidden>
                <small>{d.toLocaleDateString(undefined, { weekday: 'narrow' })}</small>
                {d.getDate()}
              </span>
              <span className="sr-only">
                {longDate(d)}
                {key === today ? ' (today)' : ''}
              </span>
            </span>
          )
        })}
      </div>
      {habits.map((h) => (
        <div key={h.id} className="week__row" role="row" style={{ '--accent': h.color } as CSSProperties}>
          <span role="rowheader" className="week__name" title={h.name}>
            <span aria-hidden>{h.emoji}</span>
            <span className="sr-only">{h.name}</span>
          </span>
          {days.map((d) => {
            const key = toKey(d)
            const done = h.completions.includes(key)
            const future = key > today
            return (
              <span key={key} role="cell" className="week__cell">
                <button
                  className={`cell ${done ? 'cell--done' : ''} ${key === today ? 'cell--today' : ''}`}
                  disabled={future}
                  aria-pressed={done}
                  onClick={() => {
                    navigator.vibrate?.(done ? 8 : 12)
                    onToggle(h.id, key)
                  }}
                  aria-label={`${h.name}, ${longDate(d)}`}
                />
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
