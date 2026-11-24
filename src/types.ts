export interface Habit {
  id: string
  name: string
  emoji: string
  color: string
  createdAt: string // YYYY-MM-DD
  completions: string[] // YYYY-MM-DD dates the habit was done
}
