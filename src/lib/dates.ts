/** Local-time date key, e.g. "2026-11-24". Avoids UTC off-by-one bugs. */
export function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

export const todayKey = () => toKey(new Date())

/** Monday-first week containing `d`. */
export function weekDays(d: Date = new Date()): Date[] {
  const offset = (d.getDay() + 6) % 7 // Mon=0 … Sun=6
  const monday = addDays(d, -offset)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}
