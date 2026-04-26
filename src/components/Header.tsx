import { Menu, Share2, Moon, Sun, Grid2X2, ShoppingBag } from 'lucide-react';

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
        flexDirection: 'column',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Top Row: Logo and Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isDark ? '#fff' : '#111',
            color: isDark ? '#111' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px oklch(0% 0 0 / 0.15)',
          }}>
            <ShoppingBag size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.8, color: 'var(--text)' }}>
            AirList
          </span>
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
      </div>

      {/* Bottom Row: Menu and Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px 12px' }}>
        <button
          onClick={onOpenLists}
          aria-label="Open lists"
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-md)',
            background: 'var(--surface-2)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {listName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>
            {doneCount} of {totalCount} items done
          </div>
        </div>
      </div>
    </header>
  );
}