import { ArrowUpDown, ListChecks } from 'lucide-react';
import { catText, catDot } from '../lib/categoryColors';

interface CategoryFilterBarProps {
  categories: { id: string; name: string; color: string }[];
  selectedCat: string | null;
  sortMode: 'category' | 'custom';
  selectionMode: boolean;
  isDark: boolean;
  onSelectCat: (catId: string | null) => void;
  onToggleSort: () => void;
  onToggleSelectionMode: () => void;
  itemCounts: Record<string, number>;
  allItemCount: number;
}

export function CategoryFilterBar({
  categories,
  selectedCat,
  sortMode,
  selectionMode,
  isDark,
  onSelectCat,
  onToggleSort,
  onToggleSelectionMode,
  itemCounts,
  allItemCount,
}: CategoryFilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '7px 14px',
        gap: 6,
      }}
    >
      {/* Pinned Left: Sort */}
      <button
        onClick={onToggleSort}
        aria-label="Toggle sort"
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-xs)',
          background: sortMode === 'custom' ? 'var(--accent-bg)' : 'var(--surface-2)',
          border: sortMode === 'custom' ? '1px solid var(--accent)' : '1px solid var(--border)',
          cursor: 'pointer',
          color: sortMode === 'custom' ? 'var(--accent-fg)' : 'var(--text-2)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        <ArrowUpDown size={14} />
      </button>

      {/* Scrolling Center: Categories */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          padding: '0 4px',
        }}
        className="hide-scrollbar"
      >
        <button
          onClick={() => onSelectCat(null)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--r-xs)',
            border: selectedCat === null ? '1px solid var(--accent)' : '1px solid var(--border)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            background: selectedCat === null ? 'var(--accent)' : 'var(--surface-2)',
            color: selectedCat === null ? '#fff' : 'var(--text-2)',
            transition: 'all 0.15s',
          }}
        >
          All{allItemCount > 0 ? ` ·${allItemCount}` : ''}
        </button>

        {categories.map((cat) => {
          const isActive = selectedCat === cat.id;
          const bg = isActive ? catDot(cat.color) : 'var(--surface-2)';
          const text = isActive ? '#fff' : catText(cat.color, isDark);
          const count = itemCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCat(isActive ? null : cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--r-xs)',
                border: isActive ? `1px solid ${catDot(cat.color)}` : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: bg,
                color: text,
                transition: 'all 0.15s',
              }}
            >
              {cat.name}{count > 0 ? ` ·${count}` : ''}
            </button>
          );
        })}
      </div>

      {/* Pinned Right: Selection Mode */}
      <button
        onClick={onToggleSelectionMode}
        aria-label="Selection mode"
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-xs)',
          background: selectionMode ? 'var(--accent-bg)' : 'var(--surface-2)',
          border: selectionMode ? '1px solid var(--accent)' : '1px solid var(--border)',
          cursor: 'pointer',
          color: selectionMode ? 'var(--accent-fg)' : 'var(--text-2)',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
      >
        <ListChecks size={16} />
      </button>
    </div>
  );
}