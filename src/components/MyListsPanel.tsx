import { X, Plus, Check, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ShoppingList {
  id: string;
  name: string;
  itemCount?: number;
}

interface MyListsPanelProps {
  lists: ShoppingList[];
  currentListId: string;
  onSelectList: (id: string) => void;
  onClose: () => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onUpdateListName: (id: string, name: string) => void;
  isDark: boolean;
}

export function MyListsPanel({ lists, currentListId, onSelectList, onClose, onAddList, onDeleteList, onUpdateListName, isDark }: MyListsPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const withLoading = async (action: string, fn: () => Promise<void> | void) => {
    setLoadingAction(action);
    try {
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    withLoading('add', async () => {
      await onAddList(trimmed);
      setNewName('');
      setShowAdd(false);
    });
  };

  const startEditing = (list: ShoppingList) => {
    setEditingListId(list.id);
    setEditName(list.name);
  };

  const saveEdit = () => {
    if (editingListId && editName.trim()) {
      const id = editingListId;
      const name = editName.trim();
      withLoading(`rename-${id}`, async () => {
        await onUpdateListName(id, name);
        setEditingListId(null);
      });
    } else {
      setEditingListId(null);
    }
  };

  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingListId]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'oklch(0% 0 0 / 0.5)',
          animation: 'fadeIn 0.15s ease-out',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(300px, 85vw)',
          zIndex: 51,
          background: 'var(--surface)',
          animation: 'slideInLeft 0.22s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px oklch(0% 0 0 / 0.15)',
        }}
      >
        <div style={{ padding: '24px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: isDark ? '#fff' : '#111',
                color: isDark ? '#111' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px oklch(0% 0 0 / 0.1)',
              }}
            >
              <ShoppingBag size={16} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: 'var(--text)', margin: 0 }}>AirList</h1>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 20px 10px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Lists</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {lists.map((list) => {
            const isActive = list.id === currentListId;
            const isEditing = editingListId === list.id;
            return (
              <div
                key={list.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  background: isActive ? 'var(--accent-bg)' : 'transparent',
                  paddingRight: 8,
                }}
              >
                <button
                  onClick={() => { if (!isEditing) { onSelectList(list.id); onClose(); } }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px 10px 20px',
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    cursor: isEditing ? 'default' : 'pointer',
                    textAlign: 'left',
                    minWidth: 0,
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--r-sm)',
                    background: isActive ? 'var(--accent)' : 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14, color: isActive ? '#fff' : 'var(--text-2)' }}>📋</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingListId(null); }}
                        style={{
                          width: '100%',
                          fontSize: 14,
                          fontWeight: 600,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--accent)',
                          borderRadius: 'var(--r-xs)',
                          padding: '2px 4px',
                          color: 'var(--text)',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? 'var(--accent-fg)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {list.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                          {list.itemCount ?? 0} items
                        </div>
                      </>
                    )}
                  </div>
                  {isActive && !isEditing && <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                </button>
                
                <div style={{ display: 'flex', gap: 2 }}>
                  {!isEditing && (
                    <button
                      onClick={() => startEditing(list)}
                      disabled={!!loadingAction}
                      style={{
                        padding: '10px 8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-2)',
                        borderRadius: 'var(--r-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                      aria-label={`Rename ${list.name}`}
                    >
                      {loadingAction === `rename-${list.id}` ? (
                        <div className="loading-led" />
                      ) : (
                        <Edit2 size={16} />
                      )}
                    </button>
                  )}
                  {lists.length > 1 && (
                    <button
                      onClick={() => withLoading(`delete-${list.id}`, () => onDeleteList(list.id))}
                      disabled={!!loadingAction}
                      style={{
                        padding: '10px 8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'oklch(52% 0.22 25)',
                        borderRadius: 'var(--r-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                      aria-label={`Delete ${list.name}`}
                    >
                      {loadingAction === `delete-${list.id}` ? (
                        <div className="loading-led" style={{ background: 'oklch(52% 0.22 25)', boxShadow: '0 0 8px 2px oklch(52% 0.22 25 / 0.4)' }} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px' }}>
          {showAdd ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false); }}
                placeholder="List name"
                autoFocus
                disabled={!!loadingAction}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: 14,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  outline: 'none',
                  width: '80%',
                }}
              />
              <button
                onClick={handleAdd}
                disabled={!!loadingAction || !newName.trim()}
                style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                  minWidth: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loadingAction === 'add' ? <div className="loading-led" style={{ background: '#fff' }} /> : 'Add'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: 14,
                fontWeight: 600,
                background: 'none',
                border: '1.5px dashed var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Plus size={16} />
              New list
            </button>
          )}
        </div>
      </div>
    </>
  );
}