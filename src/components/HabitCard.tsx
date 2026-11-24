import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Habit } from '../types'
import { todayKey } from '../lib/dates'
import { currentStreak } from '../lib/streaks'

interface Props {
  habit: Habit
  index?: number
  onToggle: () => void
  onRemove: () => void
}

const PARTICLES = 10

export function HabitCard({ habit, index = 0, onToggle, onRemove }: Props) {
  const done = habit.completions.includes(todayKey())
  const streak = currentStreak(habit.completions)
  // Increments on each check so the celebration re-mounts and replays.
  const [burst, setBurst] = useState(0)
  const [released, setReleased] = useState(0)

  // Long-press a card to delete it on touch screens (the × is hidden there to save space).
  const [holding, setHolding] = useState(false)
  const hold = useRef<{ timer: number; x: number; y: number } | null>(null)

  const confirmRemove = () => {
    if (confirm(`Delete "${habit.name}"?`)) onRemove()
  }
  const cancelHold = () => {
    if (hold.current) window.clearTimeout(hold.current.timer)
    hold.current = null
    setHolding(false)
  }
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || (e.target as HTMLElement).closest('button')) return
    setHolding(true)
    hold.current = {
      x: e.clientX,
      y: e.clientY,
      timer: window.setTimeout(() => {
        navigator.vibrate?.(20)
        cancelHold()
        confirmRemove()
      }, 550),
    }
  }
  const onPointerMove = (e: PointerEvent) => {
    // A scroll, not a press.
    if (hold.current && Math.hypot(e.clientX - hold.current.x, e.clientY - hold.current.y) > 10) cancelHold()
  }

  const handleToggle = () => {
    if (!done) {
      setBurst((b) => b + 1)
      navigator.vibrate?.([12, 40, 18]) // a firm double-tap on Android; iOS ignores it
    } else {
      setReleased((r) => r + 1)
      navigator.vibrate?.(8)
    }
    onToggle()
  }

  return (
    <article
      className={`habit ${done ? 'habit--done' : ''} ${done && burst ? 'habit--celebrate' : ''} ${holding ? 'habit--holding' : ''} ${!done && released ? 'habit--release' : ''}`}
      style={{ '--accent': habit.color, '--i': index } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="habit__emoji" aria-hidden>
        {habit.emoji}
      </span>
      <div className="habit__body">
        <h2 className="habit__name">{habit.name}</h2>
        <p className="habit__streak">
          {streak > 0 ? (
            <>
              <span className="flame" aria-hidden>
                🔥
              </span>{' '}
              <span className="streak-num">{streak}</span> day{streak === 1 ? '' : 's'}
              <span className="sr-only"> streak</span>
            </>
          ) : (
            'Start a streak today'
          )}
        </p>
      </div>
      <button
        className="habit__remove"
        onClick={confirmRemove}
        aria-label={`Delete ${habit.name}`}
        title="Delete habit"
      >
        ×
      </button>
      <div className="check-wrap">
        {done && burst > 0 && (
          <span className="burst" key={burst} aria-hidden>
            <span className="burst__ring" />
            {Array.from({ length: PARTICLES }, (_, i) => (
              <span key={i} className="burst__dot" style={{ '--i': i, '--n': PARTICLES } as CSSProperties} />
            ))}
          </span>
        )}
        <button
          className="check"
          onClick={handleToggle}
          aria-pressed={done}
          aria-label={done ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </button>
      </div>
    </article>
  )
}
