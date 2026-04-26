import { X, Trash2, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { catDot, catBg, catText } from '../lib/categoryColors';

interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ItemDetailPanelProps {
  item: {
    id: string;
    name: string;
    isCompleted: boolean;
    priority: boolean;
    quantity: number;
    notes: string;
    subtasks: Subtask[];
    attachments: Attachment[];
    categoryId: string | null;
  } | null;
  categories: Category[];
  listName: string;
  isDark: boolean;
  onClose: () => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (itemId: string, subtaskId: string) => void;
  onAddSubtask: (itemId: string, name: string) => void;
  onDeleteSubtask: (itemId: string, subtaskId: string) => void;
  onUpdateCategory: (itemId: string, categoryId: string | null) => void;
  onDelete: (id: string) => void;
}

export function ItemDetailPanel({
  item,
  categories,
  listName,
  isDark,
  onClose,
  onUpdateName,
  onUpdateNotes,
  onToggleComplete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateCategory,
  onDelete,
}: ItemDetailPanelProps) {
  const [editName, setEditName] = useState(item?.name ?? '');
  const [editNotes, setEditNotes] = useState(item?.notes ?? '');
  const [newSubtask, setNewSubtask] = useState('');
  const [prevItemId, setPrevItemId] = useState(item?.id ?? '');

  // Swipe-to-close state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);

  if (item && item.id !== prevItemId) {
    setEditName(item.name);
    setEditNotes(item.notes ?? '');
    setPrevItemId(item.id);
  }

  if (!item) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 120) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - touchStartY.current;
      if (deltaY > 0) {
        setDragY(deltaY);
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      const finalDeltaY = upEvent.clientY - touchStartY.current;
      if (finalDeltaY > 120) {
        onClose();
      } else {
        setDragY(0);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const cat = categories.find((c) => c.id === item.categoryId);
  const subtaskDone = item.subtasks.filter((s) => s.done).length;
  const subtaskTotal = item.subtasks.length;
  const subtaskPct = subtaskTotal > 0 ? (subtaskDone / subtaskTotal) * 100 : 0;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'oklch(0% 0 0 / 0.5)',
          animation: 'fadeIn 0.15s ease-out',
          opacity: Math.max(0, 1 - dragY / 300),
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '92dvh',
          zIndex: 61,
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
          display: 'flex',
          flexDirection: 'column',
          animation: dragY > 0 ? 'none' : 'slideUp 0.22s ease-out',
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          boxShadow: '0 -8px 32px oklch(0% 0 0 / 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 14, cursor: 'ns-resize', touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
            My Lists &rsaquo; {listName}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onToggleComplete(item.id)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--r-full)',
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: item.isCompleted ? 'oklch(96% 0.04 145)' : 'var(--accent-bg)',
                color: item.isCompleted ? 'oklch(34% 0.14 145)' : 'var(--accent-fg)',
              }}
            >
              {item.isCompleted ? '✓ Done' : 'Mark done'}
            </button>
            <button
              onClick={() => { onDelete(item.id); onClose(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(52% 0.22 25)', padding: 4 }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-sm)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', padding: '18px 20px 60px' }}>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => { if (editName.trim() !== item.name) onUpdateName(item.id, editName.trim()); }}
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: -0.4,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: item.isCompleted ? 'var(--text-2)' : 'var(--text)',
              textDecoration: item.isCompleted ? 'line-through' : 'none',
              opacity: item.isCompleted ? 0.6 : 1,
              width: '100%',
              marginBottom: 14,
            }}
          />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: 13,
                fontWeight: 600,
                background: cat ? catBg(cat.color, isDark) : 'var(--surface-2)',
                color: cat ? catText(cat.color, isDark) : 'var(--text-2)',
                cursor: 'pointer',
                border: '1px solid transparent',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat ? catDot(cat.color) : 'var(--border)' }} />
                {cat?.name ?? 'No Category'}
                <span style={{ fontSize: 10, marginLeft: 2, opacity: 0.5 }}>▼</span>
              </span>
              <select
                value={item.categoryId ?? ''}
                onChange={(e) => onUpdateCategory(item.id, e.target.value || null)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {item.priority && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: 13,
                fontWeight: 600,
                background: isDark ? 'oklch(17% 0.06 25)' : 'oklch(97% 0.03 25)',
                color: isDark ? 'oklch(72% 0.16 25)' : 'oklch(36% 0.18 25)',
              }}>
                🚩 Priority
              </span>
            )}
            {item.quantity > 1 && (
              <span style={{
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: 13,
                fontWeight: 600,
                background: 'var(--surface-2)',
                color: 'var(--text-2)',
              }}>
                ×{item.quantity} qty
              </span>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-2)', marginBottom: 6 }}>
              Notes
            </div>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              onBlur={() => { if (editNotes !== (item.notes ?? '')) onUpdateNotes(item.id, editNotes); }}
              placeholder="Add notes..."
              style={{
                width: '100%',
                minHeight: 76,
                padding: '10px 12px',
                fontSize: 14,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-2)' }}>
                Subtasks {subtaskTotal >= 8 && <span style={{ color: 'oklch(52% 0.22 25)', marginLeft: 4 }}>(Max 8 reached)</span>}
              </span>
              {subtaskTotal > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>
                  {subtaskDone}/{subtaskTotal}
                </span>
              )}
            </div>
            {subtaskTotal > 0 && (
              <div style={{ height: 3, borderRadius: 2, background: 'var(--surface-2)', marginBottom: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${subtaskPct}%`,
                  background: subtaskPct === 100 ? 'oklch(52% 0.17 145)' : 'var(--accent)',
                  borderRadius: 2,
                  transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            )}
            {item.subtasks.map((st) => (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <button
                  onClick={() => onToggleSubtask(item.id, st.id)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: st.done ? 'none' : '1.5px solid var(--border)',
                    background: st.done ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {st.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </button>
                <span style={{ fontSize: 14, color: st.done ? 'var(--text-2)' : 'var(--text)', textDecoration: st.done ? 'line-through' : 'none', flex: 1 }}>
                  {st.name}
                </span>
                <button
                  onClick={() => onDeleteSubtask(item.id, st.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {subtaskTotal < 8 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSubtask.trim()) {
                      onAddSubtask(item.id, newSubtask.trim());
                      setNewSubtask('');
                    }
                  }}
                  placeholder="Add a new subtask…"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Commented out Attachments for now
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-2)', marginBottom: 6 }}>
              Attachments
            </div>
            {item.attachments.map((att) => (
              <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{att.name}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{att.size}</span>
              </div>
            ))}
            <div
              style={{
                border: '1.5px dashed var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-2)',
                fontSize: 13,
                cursor: 'default',
                marginTop: 4,
                opacity: 0.6,
              }}
            >
              Upload (Coming Soon)
            </div>
          </div>
          */}
        </div>
      </div>
    </>
  );
}