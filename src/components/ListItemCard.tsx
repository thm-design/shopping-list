import { useState, useRef, useEffect } from 'react';
import { Check, Flag, Minus, Plus, ListChecks } from 'lucide-react';
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
  onUpdateQuantity: (id: string, quantity: number) => void;
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
  onUpdateQuantity,
  isOverlay = false,
  }: ListItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const withLoading = async (action: string, fn: () => Promise<void> | void) => {
    setLoadingAction(action);
    try {
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

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
      {/* Drag grip indicator (visual only now) */}
      {!selectionMode && (
        <div
          data-grip
          {...attributes}
          {...listeners}
          style={{
            color: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            padding: '8px 12px 8px 10px',
            cursor: 'grab',
            touchAction: 'none',
          }}
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
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        {selectionMode ? (
          <button
            onClick={() => onToggleSelect(id)}
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
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
          </button>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => withLoading('toggleComplete', () => onToggleComplete(id))}
              disabled={!!loadingAction}
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
                transition: 'background 0.15s, border-color 0.15s',
                opacity: loadingAction === 'toggleComplete' ? 0.7 : 1,
              }}
            >
              {isCompleted && !loadingAction && <Check size={14} color="#fff" strokeWidth={3} />}
            </button>
            {loadingAction === 'toggleComplete' && (
              <div className="loading-led" style={{ position: 'absolute', top: '50%', left: '50%', margin: '-3px 0 0 -3px', pointerEvents: 'none' }} />
            )}
          </div>
        )}
      </div>

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
                borderRadius: 'var(--r-sm)',
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
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <ListChecks size={12} />
              {subtaskDone}/{subtaskTotal}
            </span>
          )}
        </div>
      </div>

      {/* Right-aligned area: QTY, Priority Toggle, and Menu */}
      {!selectionMode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          {/* QTY display */}
          <div style={{ 
            fontSize: 13, 
            fontWeight: 800, 
            color: 'var(--text-2)',
            minWidth: 28,
            textAlign: 'right',
            paddingRight: 4
          }}>
            {quantity > 1 ? `×${quantity}` : ''}
          </div>

          {/* Priority Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => withLoading('togglePriority', () => onTogglePriority(id))}
              disabled={!!loadingAction}
              style={{
                padding: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: priority ? 'oklch(52% 0.22 25)' : 'var(--text-2)',
                opacity: loadingAction === 'togglePriority' ? 0.3 : (priority ? 1 : 0.4),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s, color 0.2s',
              }}
              aria-label={priority ? "Remove priority" : "Mark as priority"}
            >
              <Flag size={18} fill={priority && loadingAction !== 'togglePriority' ? 'oklch(52% 0.22 25)' : 'none'} />
            </button>
            {loadingAction === 'togglePriority' && (
              <div className="loading-led" style={{ position: 'absolute', top: '50%', left: '50%', margin: '-3px 0 0 -3px', pointerEvents: 'none' }} />
            )}
          </div>

          {/* ⋯ menu button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
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
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (quantity > 1) withLoading('decQty', () => onUpdateQuantity(id, quantity - 1)); }}
                        disabled={!!loadingAction}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'var(--surface-2)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text)',
                          opacity: loadingAction === 'decQty' ? 0.5 : 1,
                        }}
                      >
                        {loadingAction !== 'decQty' && <Minus size={14} />}
                      </button>
                      {loadingAction === 'decQty' && (
                        <div className="loading-led" style={{ position: 'absolute', top: '50%', left: '50%', margin: '-3px 0 0 -3px', pointerEvents: 'none' }} />
                      )}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{quantity}</span>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); withLoading('incQty', () => onUpdateQuantity(id, quantity + 1)); }}
                        disabled={!!loadingAction}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'var(--surface-2)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text)',
                          opacity: loadingAction === 'incQty' ? 0.5 : 1,
                        }}
                      >
                        {loadingAction !== 'incQty' && <Plus size={14} />}
                      </button>
                      {loadingAction === 'incQty' && (
                        <div className="loading-led" style={{ position: 'absolute', top: '50%', left: '50%', margin: '-3px 0 0 -3px', pointerEvents: 'none' }} />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); withLoading('togglePriorityMenu', async () => { await onTogglePriority(id); setShowMenu(false); }); }}
                  disabled={!!loadingAction}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                  <span>{priority ? '✓ Priority' : 'Flag as priority'}</span>
                  {loadingAction === 'togglePriorityMenu' && <div className="loading-led" />}
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
                  onClick={(e) => { e.stopPropagation(); withLoading('delete', async () => { await onDelete(id); setShowMenu(false); }); }}
                  disabled={!!loadingAction}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                  <span>Delete</span>
                  {loadingAction === 'delete' && <div className="loading-led" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}