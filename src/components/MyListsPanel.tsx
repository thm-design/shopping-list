import { X, Plus, Check } from 'lucide-react';
import { useState } from 'react';

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
}

export function MyListsPanel({ lists, currentListId, onSelectList, onClose, onAddList }: MyListsPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddList(trimmed);
    setNewName('');
    setShowAdd(false);
  };

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
          width: 'min(288px, 82vw)',
          zIndex: 51,
          background: 'var(--surface)',
          animation: 'slideInLeft 0.22s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '48px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: 'var(--text)' }}>My Lists</h2>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-sm)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {lists.map((list) => {
            const isActive = list.id === currentListId;
            return (
              <button
                key={list.id}
                onClick={() => { onSelectList(list.id); onClose(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  width: '100%',
                  background: isActive ? 'var(--accent-bg)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
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
                  <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? 'var(--accent-fg)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {list.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                    {list.itemCount ?? 0} items
                  </div>
                </div>
                {isActive && <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
              </button>
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
                style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                }}
              >
                Add
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