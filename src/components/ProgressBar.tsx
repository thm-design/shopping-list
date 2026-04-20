interface ProgressBarProps {
  doneCount: number;
  totalCount: number;
}

export function ProgressBar({ doneCount, totalCount }: ProgressBarProps) {
  if (totalCount === 0) return null;

  const pct = (doneCount / totalCount) * 100;
  const isComplete = doneCount === totalCount;

  return (
    <div style={{ padding: '0 14px 6px' }}>
      <div
        style={{
          height: 3,
          borderRadius: 2,
          background: 'var(--surface-2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: isComplete ? 'oklch(52% 0.17 145)' : 'var(--accent)',
            borderRadius: 2,
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.09,
        }}
      >
        <span style={{ color: 'var(--text-2)' }}>Progress</span>
        <span style={{ color: 'var(--text-2)', fontSize: 11, fontWeight: 700 }}>
          {doneCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}