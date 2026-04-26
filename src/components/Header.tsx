import { Moon, Sun, ShoppingBag, User } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  isCompact: boolean;
  listName: string;
  onToggleTheme: () => void;
  onOpenLists: () => void;
  onToggleCompact: () => void;
}

export function Header({
  isDark,
  isCompact,
  listName,
  onToggleTheme,
  onOpenLists,
  onToggleCompact,
}: HeaderProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        height: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        {/* Logo symbol as Sidebar Button */}
        <button
          onClick={onOpenLists}
          aria-label="Open lists"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: isDark ? '#fff' : '#111',
            color: isDark ? '#111' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px oklch(0% 0 0 / 0.15)',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'transform 0.1s active',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ShoppingBag size={20} strokeWidth={2.5} />
        </button>

        {/* List Name / App Name Toggle area */}
        <div 
          onClick={onToggleCompact}
          style={{ 
            flex: 1, 
            minWidth: 0, 
            position: 'relative', 
            height: 32, 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <h1 style={{ 
            fontSize: 20, 
            fontWeight: 800, 
            letterSpacing: -0.6, 
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            position: 'absolute',
            opacity: isCompact ? 0 : 1,
            transform: isCompact ? 'translateY(-12px)' : 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isCompact ? 'none' : 'auto',
          }}>
            AirList
          </h1>
          <h1 style={{ 
            fontSize: 18, 
            fontWeight: 700, 
            letterSpacing: -0.4, 
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            position: 'absolute',
            opacity: isCompact ? 1 : 0,
            transform: isCompact ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isCompact ? 'auto' : 'none',
          }}>
            {listName || "List"}
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 38,
            height: 38,
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
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* User Profile Mockup */}
        <button
          aria-label="User profile"
          style={{
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-2)',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
}