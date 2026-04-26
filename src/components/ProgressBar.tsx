interface ProgressBarProps {
  doneCount: number;
  totalCount: number;
  listName: string;
}

export function ProgressBar({ doneCount, totalCount, listName }: ProgressBarProps) {
  if (totalCount === 0) return null;

  const pct = (doneCount / totalCount) * 100;
  const isComplete = doneCount === totalCount;

  return (
    <div style={{ padding: '24px 14px 20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 12,
        }}
      >
        <h2 style={{ 
          fontSize: 32, 
          fontWeight: 900, 
          letterSpacing: -1, 
          color: 'var(--text)',
          margin: 0
        }}>
          {listName || 'List'}
        </h2>
        <span style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 700 }}>
          {doneCount} / {totalCount} items
        </span>
      </div>
      <div
        style={{
          height: 4,
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
    </div>
  );
}