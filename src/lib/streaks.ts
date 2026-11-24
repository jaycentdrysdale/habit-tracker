import { addDays, toKey } from './dates'

/**
 * Current streak: consecutive completed days ending today.
 * If today isn't done yet, the streak still counts from yesterday —
 * you haven't broken it until the day is over.
 */
export function currentStreak(completions: string[], today = new Date()): number {
  const done = new Set(completions)
  let cursor = done.has(toKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (done.has(toKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function bestStreak(completions: string[]): number {
  const sorted = [...new Set(completions)].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const key of sorted) {
    const expected = prev ? toKey(addDays(new Date(prev + 'T00:00'), 1)) : null
    run = key === expected ? run + 1 : 1
    best = Math.max(best, run)
    prev = key
  }
  return best
}
