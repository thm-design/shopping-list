import { ArrowUpDown } from 'lucide-react';
import { catBg, catText, catDot } from '../lib/categoryColors';

interface CategoryFilterBarProps {
  categories: { id: string; name: string; color: string }[];
  selectedCat: string | null;
  sortMode: 'category' | 'custom';
  isDark: boolean;
  onSelectCat: (catId: string | null) => void;
  onToggleSort: () => void;
  itemCounts: Record<string, number>;
  allItemCount: number;
}

export function CategoryFilterBar({
  categories,
  selectedCat,
  sortMode,
  isDark,
  onSelectCat,
  onToggleSort,
  itemCounts,
  allItemCount,
}: CategoryFilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        overflowX: 'auto',
      }}
    >
      <button
        onClick={onToggleSort}
        aria-label="Toggle sort"
        style={{
          width: 26,
          height: 26,
          minWidth: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-xs)',
          background: sortMode === 'custom' ? 'var(--accent-bg)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: sortMode === 'custom' ? 'var(--accent-fg)' : 'var(--text-2)',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <ArrowUpDown size={14} />
      </button>

      <div
        style={{
          width: 1,
          height: 18,
          background: 'var(--border)',
          flexShrink: 0,
        }}
      />

      <button
        onClick={() => onSelectCat(null)}
        style={{
          padding: '4px 10px',
          borderRadius: 'var(--r-full)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          background: selectedCat === null ? 'var(--accent)' : 'var(--surface-2)',
          color: selectedCat === null ? '#fff' : 'var(--text-2)',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        All{allItemCount > 0 ? ` ·${allItemCount}` : ''}
      </button>

      {categories.map((cat) => {
        const isActive = selectedCat === cat.id;
        const bg = isActive ? catDot(cat.color) : catBg(cat.color, isDark);
        const text = isActive ? '#fff' : catText(cat.color, isDark);
        const count = itemCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCat(isActive ? null : cat.id)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--r-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              background: bg,
              color: text,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {cat.name}{count > 0 ? ` ·${count}` : ''}
          </button>
        );
      })}
    </div>
  );
}