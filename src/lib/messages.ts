// One short line per day, rotating through the list by day of the year.
const MESSAGES = [
  'Small steps, every day.',
  'Show up. That’s most of it.',
  'Progress, not perfection.',
  'One tick at a time.',
  'Today counts.',
  'Be a little better than yesterday.',
  'Consistency beats intensity.',
  'You don’t need motivation. Just start.',
  'Tiny wins add up.',
  'Keep the chain going.',
  'Done is better than perfect.',
  'Future you says thanks.',
  'Make it easy. Make it daily.',
  'A missed day is just a day. Begin again.',
  'Momentum is built, not found.',
  'Two minutes is enough to start.',
  'Habits are votes for who you want to be.',
  'Slow is still forward.',
  'Your streak is a promise kept.',
  'Start where you are.',
  'Little by little, a lot.',
  'Be proud of the small stuff.',
  'Every day is a fresh square.',
  'Easy does it — just do it.',
  'Keep it simple. Keep it going.',
  'The best time is now.',
  'Do it for the streak.',
  'Light up today’s square.',
  'Routine is freedom.',
  'You’ve got this.',
]

export function messageFor(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  return MESSAGES[dayOfYear % MESSAGES.length]
}

export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
