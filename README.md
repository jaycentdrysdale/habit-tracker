# Streakly — habit tracker

A minimal, local-first habit tracker built with React 19 + TypeScript + Vite.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. Data is saved in your browser's localStorage.

## Features
- Add habits with a name and emoji
- Tap to check off today's habits (with a daily progress ring)
- Current streak per habit (today not done yet doesn't break the streak)
- Weekly grid (Mon–Sun) — tap past days to backfill

## Structure
```
src/
  App.tsx                 page layout
  types.ts                Habit model
  lib/dates.ts            local-date helpers
  lib/streaks.ts          streak calculations
  lib/useHabits.ts        state + localStorage persistence
  components/             HabitCard, WeekGrid, ProgressRing, AddHabitSheet
  styles.css              design tokens, light/dark themes, animations
```

The first launch seeds three example habits; delete them with the × that appears on hover.
