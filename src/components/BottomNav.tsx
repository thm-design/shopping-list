import { ListTodo, Tag, Sparkles } from 'lucide-react';

type Tab = 'list' | 'categories' | 'pro';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_H = 64;

export { NAV_H };

const tabs: { key: Tab; label: string; Icon: typeof ListTodo }[] = [
  { key: 'list', label: 'List', Icon: ListTodo },
  { key: 'categories', label: 'Categories', Icon: Tag },
  { key: 'pro', label: 'Pro', Icon: Sparkles },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: NAV_H,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              transition: 'color 0.15s',
              padding: '4px 16px',
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}