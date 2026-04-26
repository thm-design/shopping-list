interface ProgressBarProps {
  doneCount: number;
  totalCount: number;
  listName: string;
  isCompact?: boolean;
}

export function ProgressBar({ doneCount, totalCount, listName, isCompact = false }: ProgressBarProps) {
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const isComplete = totalCount > 0 && doneCount === totalCount;

  return (
    <div style={{ padding: isCompact ? '0px 14px 8px' : '0px 14px 20px', transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* Animated title area */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isCompact ? '0fr' : '1fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-out',
        opacity: isCompact ? 0 : 1,
        pointerEvents: isCompact ? 'none' : 'auto',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            {/* this h2 needs to  not wrpa past device with and go into elisis if it is too long */}
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 900, 
              letterSpacing: -1, 
              color: 'var(--text)',
              margin: 0,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}>
              {listName || 'List'}
            </h2>
            {totalCount > 0 && (
              <span style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {doneCount} / {totalCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar and compact count */}
      {totalCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              flex: 1,
              height: isCompact ? 3 : 4,
              borderRadius: 2,
              background: 'var(--surface-2)',
              overflow: 'hidden',
              transition: 'height 0.3s ease',
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
          {/* {isCompact && (
            <span style={{ 
              color: 'var(--text-2)', 
              fontSize: 11, 
              fontWeight: 700,
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              {doneCount} / {totalCount}
            </span>
          )} */}
        </div>
      )}
    </div>
  );
}