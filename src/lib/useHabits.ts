import { useEffect, useState } from 'react'
import type { Habit } from '../types'
import { addDays, toKey, todayKey } from './dates'

const STORAGE_KEY = 'streakly:habits:v1'

export const PALETTE = ['#f26b35', '#eaa400', '#2fae73', '#2b9be0', '#8a63f0', '#ec5486']

function seed(): Habit[] {
  // Example habits with some history. Only used when opening the app with ?demo
  // (handy for previewing the full UI); real first runs start empty.
  const t = new Date()
  const days = (offsets: number[]) => offsets.map((o) => toKey(addDays(t, -o)))
  const created = toKey(addDays(t, -14))
  return [
    { id: crypto.randomUUID(), name: 'Drink water', emoji: '💧', color: PALETTE[3], createdAt: created, completions: days([1, 2, 3, 4, 5, 6, 8]) },
    { id: crypto.randomUUID(), name: 'Read 20 pages', emoji: '📚', color: PALETTE[4], createdAt: created, completions: days([0, 1, 2, 4, 5]) },
    { id: crypto.randomUUID(), name: 'Morning walk', emoji: '🚶', color: PALETTE[2], createdAt: created, completions: days([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) },
  ]
}

function load(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Habit[]
  } catch {
    /* fall through */
  }
  return new URLSearchParams(location.search).has('demo') ? seed() : []
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    } catch {
      /* storage unavailable — app still works in memory */
    }
  }, [habits])

  const addHabit = (name: string, emoji: string, color?: string) => {
    setHabits((hs) => [
      ...hs,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        emoji,
        color: color ?? PALETTE[hs.length % PALETTE.length],
        createdAt: todayKey(),
        completions: [],
      },
    ])
  }

  const toggle = (id: string, dateKey: string = todayKey()) => {
    setHabits((hs) =>
      hs.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              completions: h.completions.includes(dateKey)
                ? h.completions.filter((d) => d !== dateKey)
                : [...h.completions, dateKey],
            },
      ),
    )
  }

  const removeHabit = (id: string) => setHabits((hs) => hs.filter((h) => h.id !== id))

  return { habits, addHabit, toggle, removeHabit }
}
