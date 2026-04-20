import { Menu, Share2, Moon, Sun, Grid2X2 } from 'lucide-react';

interface HeaderProps {
  listName: string;
  doneCount: number;
  totalCount: number;
  isDark: boolean;
  selectionMode: boolean;
  onToggleTheme: () => void;
  onOpenLists: () => void;
  onOpenShare: () => void;
  onToggleSelectionMode: () => void;
}

export function Header({
  listName,
  doneCount,
  totalCount,
  isDark,
  selectionMode,
  onToggleTheme,
  onOpenLists,
  onOpenShare,
  onToggleSelectionMode,
}: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <button
        onClick={onOpenLists}
        aria-label="Open lists"
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-sm)',
          background: 'var(--surface-2)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
        }}
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 8px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listName}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
          {doneCount} of {totalCount} done
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={onOpenShare}
          aria-label="Share"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            background: 'var(--surface-2)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            background: 'var(--surface-2)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onToggleSelectionMode}
          aria-label="Selection mode"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            background: selectionMode ? 'var(--accent-bg)' : 'var(--surface-2)',
            border: 'none',
            cursor: 'pointer',
            color: selectionMode ? 'var(--accent-fg)' : 'var(--text)',
          }}
        >
          <Grid2X2 size={16} />
        </button>
      </div>
    </header>
  );
}