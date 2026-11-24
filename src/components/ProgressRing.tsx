interface Props {
  value: number // 0..1
  celebrate?: boolean
}

export function ProgressRing({ value, celebrate }: Props) {
  const size = 96
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.round(value * 100)

  return (
    <div className={`ring ${celebrate ? 'ring--done' : ''}`} role="img" aria-label={`${pct}% complete today`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff9a3d" />
            <stop offset="50%" stopColor="#ff6a3d" />
            <stop offset="100%" stopColor="#ff3d7f" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring__track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring__fill"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring__label">{celebrate ? '🎉' : `${pct}%`}</span>
    </div>
  )
}
