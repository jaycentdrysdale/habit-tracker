/**
 * A slim progress hairline across the top of the screen. Re-keying it (pass a
 * new `run` number) replays the sweep. Used for view switches and new habits.
 */
export function TopProgress({ run }: { run: number }) {
  if (run === 0) return null
  return <div key={run} className="top-progress" aria-hidden />
}
