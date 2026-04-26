import { useState, useRef, useEffect } from 'react';
import { Check, Flag } from 'lucide-react';
import { catBg, catText } from '../lib/categoryColors';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

interface ListItemCardProps {
  id: string;
  name: string;
  isCompleted: boolean;
  priority: boolean;
  quantity: number;
  categoryName: string;
  categoryColor: string;
  subtasks: Subtask[];
  isDark: boolean;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleComplete: (id: string) => void;
  onTogglePriority: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
  onToggleSelect: (id: string) => void;
  isOverlay?: boolean;
}

export function ListItemCard({
  id,
  name,
  isCompleted,
  priority,
  quantity,
  categoryName,
  categoryColor,
  subtasks,
  isDark,
  selectionMode,
  isSelected,
  onToggleComplete,
  onTogglePriority,
  onDelete,
  onViewDetail,
  onToggleSelect,
  isOverlay = false,
}: ListItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const priorityBg = priority
    ? isDark
      ? 'oklch(17% 0.06 25)'
      : 'oklch(99% 0.015 25)'
    : 'transparent';
  const priorityBorder = priority ? '1px solid oklch(52% 0.22 25 / 0.28)' : 'none';

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '11px 12px',
    minHeight: 60,
    background: priority ? (priorityBg) : 'var(--surface)',
    border: priority ? priorityBorder : '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    boxShadow: isDragging ? '0 10px 30px oklch(0% 0 0 / 0.15)' : '0 1px 3px oklch(0% 0 0 / 0.05)',
    opacity: isDragging && !isOverlay ? 0.4 : isCompleted ? 0.52 : 1,
    cursor: selectionMode ? 'pointer' : 'default',
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 'auto',
    touchAction: 'none',
  };

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const subtaskDone = subtasks.filter((s) => s.done).length;
  const subtaskTotal = subtasks.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => {
        if (selectionMode) {
          onToggleSelect(id);
        } else {
          onViewDetail(id);
        }
      }}
    >
      {/* Drag grip */}
      {!selectionMode && (
        <div
          {...attributes}
          {...listeners}
          data-grip
          style={{
            cursor: 'grab',
            color: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            padding: '4px',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
            <circle cx="4" cy="4" r="1.5" />
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="4" cy="16" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </div>
      )}

      {/* Selection checkbox or regular checkbox */}
      {selectionMode ? (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect(id); }}
          style={{
            width: 20,
            height: 20,
            borderRadius: 'var(--r-xs)',
            border: isSelected ? 'none' : '1.5px solid var(--border)',
            background: isSelected ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
        </button>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(id); }}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: isCompleted ? 'none' : '1.5px solid var(--border)',
            background: isCompleted ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s',
          }}
        >
          {isCompleted && <Check size={14} color="#fff" strokeWidth={3} />}
        </button>
      )}

      {/* Priority flag */}
      {priority && !selectionMode && (
        <Flag
          size={12}
          style={{ color: 'oklch(52% 0.22 25)', flexShrink: 0 }}
          fill="oklch(52% 0.22 25)"
        />
      )}

      {/* Item name and badges column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'var(--text-2)' : 'var(--text)',
          }}
        >
          {name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Category pill */}
          {categoryName && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                padding: '2px 7px',
                borderRadius: 'var(--r-full)',
                background: catBg(categoryColor, isDark),
                color: catText(categoryColor, isDark),
                flexShrink: 0,
              }}
            >
              {categoryName}
            </span>
          )}

          {/* Subtask badge */}
          {subtaskTotal > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 'var(--r-xs)',
                background: 'var(--surface-2)',
                color: 'var(--text-2)',
                flexShrink: 0,
              }}
            >
              {subtaskDone}/{subtaskTotal}
            </span>
          )}

          {/* Qty badge */}
          {quantity > 1 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 'var(--r-xs)',
                background: 'var(--surface-2)',
                color: 'var(--text-2)',
                flexShrink: 0,
              }}
            >
              ×{quantity}
            </span>
          )}
        </div>
      </div>

      {/* ⋯ menu button */}
      {!selectionMode && (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--r-xs)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-2)',
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ···
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                zIndex: 100,
                minWidth: 172,
                background: 'var(--surface)',
                borderRadius: 'var(--r-md)',
                boxShadow: '0 8px 24px oklch(0% 0 0 / 0.14)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onTogglePriority(id); setShowMenu(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 13,
                  cursor: 'pointer',
                  color: priority ? 'oklch(52% 0.22 25)' : 'var(--text)',
                  fontWeight: 500,
                }}
              >
                {priority ? '✓ Priority' : 'Flag as priority'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetail(id); setShowMenu(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 13,
                  cursor: 'pointer',
                  color: 'var(--text)',
                  fontWeight: 500,
                }}
              >
                View details
              </button>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(id); setShowMenu(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 13,
                  cursor: 'pointer',
                  color: 'oklch(52% 0.22 25)',
                  fontWeight: 500,
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}