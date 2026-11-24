import type { CSSProperties } from 'react'

export const SUGGESTIONS = [
  { emoji: '💧', name: 'Drink water', color: '#2b9be0' },
  { emoji: '📚', name: 'Read 10 pages', color: '#8a63f0' },
  { emoji: '🧘', name: 'Meditate', color: '#ec5486' },
  { emoji: '🚶', name: 'Go for a walk', color: '#2fae73' },
]

interface Props {
  variant: 'today' | 'week'
  onAdd: () => void
  onQuickAdd: (name: string, emoji: string, color: string) => void
}

export function EmptyState({ variant, onAdd, onQuickAdd }: Props) {
  if (variant === 'week') {
    return (
      <section className="empty empty--week">
        <div className="ghost-grid" aria-hidden>
          {Array.from({ length: 21 }, (_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <h2>Your week will fill up here</h2>
        <p>Every habit you check off lights up a square. Add one to get started.</p>
        <button className="btn-cta" onClick={onAdd}>
          Add a habit
        </button>
      </section>
    )
  }

  return (
    <section className="empty">
      <div className="orbit" aria-hidden>
        <span className="orbit__main">🌱</span>
        <span className="orbit__sat orbit__sat--1">💧</span>
        <span className="orbit__sat orbit__sat--2">📚</span>
        <span className="orbit__sat orbit__sat--3">🧘</span>
        <span className="orbit__spark orbit__spark--1" />
        <span className="orbit__spark orbit__spark--2" />
        <span className="orbit__spark orbit__spark--3" />
      </div>

      <h2>Start your first streak</h2>
      <p>Pick something small you can do every day. Tick it off here, and watch the streak grow.</p>

      <button className="btn-cta" onClick={onAdd}>
        <span className="add-btn__icon" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        Add your first habit
      </button>

      <div className="suggest">
        <p className="suggest__label">or start with one of these</p>
        <div className="suggest__chips">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={s.name}
              className="chip"
              style={{ '--i': i } as CSSProperties}
              onClick={() => onQuickAdd(s.name, s.emoji, s.color)}
            >
              <span aria-hidden>{s.emoji}</span> {s.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
