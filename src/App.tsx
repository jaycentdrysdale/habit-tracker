import { useEffect, useState } from 'react'
import { useHabits } from './lib/useHabits'
import { toKey, todayKey, weekDays } from './lib/dates'
import { ProgressRing } from './components/ProgressRing'
import { HabitCard } from './components/HabitCard'
import { WeekGrid } from './components/WeekGrid'
import { AddHabitSheet } from './components/AddHabitSheet'
import { ViewTabs, type View } from './components/ViewTabs'
import { EmptyState } from './components/EmptyState'
import { AppHeader } from './components/AppHeader'
import { TopProgress } from './components/TopProgress'
import { greeting } from './lib/messages'

const VIEW_KEY = 'streakly:view'

function loadView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'week' ? 'week' : 'today'
  } catch {
    return 'today'
  }
}

export default function App() {
  const { habits, addHabit, toggle, removeHabit } = useHabits()
  const [adding, setAdding] = useState(false)
  const [progressRun, setProgressRun] = useState(0)
  const showProgress = () => setProgressRun((n) => n + 1)
  const [view, setView] = useState<View>(loadView)
  // Which way the content slides: forward (Today → Week) or back.
  const [direction, setDirection] = useState<'forward' | 'back' | 'none'>('none')

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view)
    } catch {
      /* ignore */
    }
  }, [view])

  const changeView = (next: View) => {
    if (next === view) return
    setDirection(next === 'week' ? 'forward' : 'back')
    setView(next)
    showProgress()
  }

  // ---- Today stats
  const today = todayKey()
  const doneToday = habits.filter((h) => h.completions.includes(today)).length
  const allDone = habits.length > 0 && doneToday === habits.length

  // ---- Week stats (only days up to and including today count)
  const days = weekDays()
  const elapsed = days.map(toKey).filter((k) => k <= today)
  const weekDone = habits.reduce((n, h) => n + elapsed.filter((k) => h.completions.includes(k)).length, 0)
  const weekPossible = habits.length * elapsed.length

  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString(undefined, opts)
  const empty = habits.length === 0

  const header =
    view === 'today'
      ? {
          eyebrow: greeting(),
          title: empty ? 'Welcome 👋' : allDone ? 'All done. Nice work.' : 'Today',
          subtitle: empty ? 'Small daily wins add up. Let’s set up your first one.' : `${doneToday} of ${habits.length} ${habits.length === 1 ? 'habit' : 'habits'} complete`,
          value: habits.length ? doneToday / habits.length : 0,
          celebrate: allDone,
        }
      : {
          eyebrow: `${fmt(days[0], { month: 'short', day: 'numeric' })} – ${fmt(days[6], { month: 'short', day: 'numeric' })}`,
          title: 'This week',
          subtitle: empty ? 'Nothing tracked yet.' : `${weekDone} of ${weekPossible} check-ins so far`,
          value: weekPossible ? weekDone / weekPossible : 0,
          celebrate: weekPossible > 0 && weekDone === weekPossible,
        }

  return (
    <main className="app">
      <div className="glow" aria-hidden />
      <TopProgress run={progressRun} />

      <AppHeader />

      <ViewTabs value={view} onChange={changeView} />

      <section className="hero">
        <div key={view} className={`hero__text slide-${direction}`}>
          <p className="eyebrow">{header.eyebrow}</p>
          <h1>{header.title}</h1>
          <p className="subtle" aria-live="polite">{header.subtitle}</p>
        </div>
        {!empty && <ProgressRing value={header.value} celebrate={header.celebrate} />}
      </section>

      <div className="view-stage">
        <div key={view} className={`view slide-${direction}`} id={`view-${view}`} role="tabpanel" aria-labelledby={`tab-${view}`}>
          {empty ? (
            <EmptyState
              variant={view}
              onAdd={() => setAdding(true)}
              onQuickAdd={(name, emoji, color) => {
                addHabit(name, emoji, color)
                showProgress()
              }}
            />
          ) : view === 'today' ? (
            <section className="habit-list" aria-label="Today's habits">
              {habits.map((h, i) => (
                <HabitCard key={h.id} index={i} habit={h} onToggle={() => toggle(h.id)} onRemove={() => removeHabit(h.id)} />
              ))}
            </section>
          ) : (
            <section className="panel">
              <WeekGrid habits={habits} onToggle={toggle} />
            </section>
          )}
        </div>
      </div>

      {!empty && (
      <div className="fab-bar">
        <button className="add-btn" onClick={() => setAdding(true)}>
          <span className="add-btn__icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          New habit
        </button>
      </div>
      )}

      {adding && (
        <AddHabitSheet
          onClose={() => setAdding(false)}
          onAdd={(name, emoji) => {
            addHabit(name, emoji)
            setAdding(false)
            showProgress()
          }}
        />
      )}
    </main>
  )
}
