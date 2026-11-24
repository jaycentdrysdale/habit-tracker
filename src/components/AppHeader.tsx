import { messageFor } from '../lib/messages'

export const APP_NAME = 'Streakly'

export function AppHeader() {
  const now = new Date()
  const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="brand">
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M6.5 12.5l3.5 3.5 7.5-8" />
            </svg>
          </span>
          <span className="brand__name">{APP_NAME}</span>
        </div>
        <time className="topbar__date" dateTime={now.toISOString().slice(0, 10)}>
          {date}
        </time>
      </div>
      <p className="topbar__quote">{messageFor(now)}</p>
    </header>
  )
}
