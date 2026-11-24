import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

const EMOJIS = ['💧', '📚', '🚶', '🏃', '🧘', '💪', '🥗', '😴', '✍️', '🎸', '🧠', '🌱', '☀️', '🦷', '💊', '📵']

interface Props {
  onAdd: (name: string, emoji: string) => void
  onClose: () => void
}

export function AddHabitSheet({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Remember what had focus so we can return to it when the sheet closes.
    const previouslyFocused = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  // Keep Tab / Shift+Tab inside the sheet while it's open.
  const trapFocus = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !sheetRef.current) return
    const focusable = [...sheetRef.current.querySelectorAll<HTMLElement>('input, button:not(:disabled)')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="scrim" onClick={onClose}>
      <div
        ref={sheetRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-habit-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) onAdd(name, emoji)
          }}
        >
          <h2 id="new-habit-title">New habit</h2>
          <div className="sheet__preview">
            <span aria-hidden>{emoji}</span>
            <label htmlFor="habit-name" className="sr-only">
              Habit name
            </label>
            <input
              id="habit-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stretch 5 min"
              maxLength={40}
              autoComplete="off"
              enterKeyHint="done"
            />
          </div>
          <div className="emoji-grid" role="radiogroup" aria-label="Pick an emoji">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                role="radio"
                aria-checked={e === emoji}
                className={e === emoji ? 'is-picked' : ''}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="sheet__actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Add habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
