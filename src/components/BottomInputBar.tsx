import { useState, useEffect, useRef } from 'react';
import { ListPlus, ArrowRight } from 'lucide-react';
import { catDot, catBg, catText, CAT_COLOR_NAMES, type CatColorName } from '../lib/categoryColors';
import { NAV_H } from './BottomNav';

interface BottomInputBarProps {
  lists: { id: string; name: string }[];
  currentListId: string;
  allCategories: { id: string; name: string; color: string; listId?: string | null }[];
  isDark: boolean;
  onAddItem: (name: string, listId: string, categoryId: string | null) => void;
  onAddCategory: (name: string, color: CatColorName, listId: string) => void;
  selectionMode: boolean;
}

export function BottomInputBar({
  lists,
  currentListId,
  allCategories,
  isDark,
  onAddItem,
  onAddCategory,
  selectionMode,
}: BottomInputBarProps) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedListId, setSelectedListId] = useState(currentListId);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  
  const isSubmitting = useRef(false);

  useEffect(() => {
    setSelectedListId(currentListId);
  }, [currentListId]);
  
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState<CatColorName>('gray');
  const [loading, setLoading] = useState(false);

  if (selectionMode) return null;

  const categories = allCategories.filter(c => c.listId === selectedListId);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading || isSubmitting.current) return;
    
    isSubmitting.current = true;
    setLoading(true);
    try {
      await onAddItem(trimmed, selectedListId, selectedCatId);
      setText('');
      setFocused(false);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed, newCatColor, selectedListId);
    setNewCatName('');
    setNewCatColor('gray');
    setShowAddCat(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: NAV_H + 10,
        left: 12,
        right: 12,
        zIndex: 40,
      }}
    >
      {/* Background Overlay */}
      {focused && (
        <div 
          onClick={() => setFocused(false)} 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: -1,
            background: 'transparent'
          }} 
        />
      )}

      {/* Expansion panel */}
      {focused && (
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 20px oklch(0% 0 0 / 0.10)',
            marginBottom: 8,
            padding: '12px 14px',
            animation: 'slideUp 0.18s ease-out',
          }}
        >
          {/* List picker */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-2)', marginBottom: 6 }}>
              Add to list
            </div>
            {lists.map((list) => {
              const isActive = list.id === selectedListId;
              return (
                <button
                  key={list.id}
                  onClick={() => {
                    setSelectedListId(list.id);
                    setSelectedCatId(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--r-sm)',
                    background: isActive ? 'var(--accent-bg)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: isActive ? 'none' : '1.5px solid var(--border)',
                    background: isActive ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? 'var(--accent-fg)' : 'var(--text)' }}>
                    {list.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category picker */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-2)', marginBottom: 6 }}>
              Category
            </div>
            
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {showAddCat ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category name"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setShowAddCat(false); }}
                    autoFocus
                    style={{
                      fontSize: 12,
                      padding: '4px 8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      color: 'var(--text)',
                      outline: 'none',
                      width: 120,
                    }}
                  />
                  {CAT_COLOR_NAMES.slice(0, 8).map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewCatColor(c)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: catDot(c),
                        border: newCatColor === c ? '2.5px solid var(--text)' : '2.5px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                  <button onClick={handleAddCategory} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Add</button>
                  <button onClick={() => setShowAddCat(false)} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-xs)', padding: '2px 8px', cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <>
                  {categories.length === 0 && (
                    <div style={{ fontStyle: 'italic', fontSize: 12, color: 'var(--text-2)', alignSelf: 'center', marginRight: 4 }}>
                      No categories
                    </div>
                  )}
                  {categories.map((cat) => {
                    const isActive = selectedCatId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCatId(isActive ? null : cat.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--r-full)',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                          background: isActive ? catDot(cat.color) : catBg(cat.color, isDark),
                          color: isActive ? '#fff' : catText(cat.color, isDark),
                          transition: 'background 0.15s, color 0.15s',
                        }}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowAddCat(true)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--r-full)',
                      border: '1.5px dashed var(--border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-2)',
                    }}
                  >
                    + Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          background: 'var(--surface)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: isDark ? 'oklch(15% 0.01 240 / 0.85)' : 'oklch(100% 0 0 / 0.85)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px oklch(0% 0 0 / 0.10)',
        }}
      >
        <button
          onClick={() => setFocused(prev => !prev)}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            background: 'var(--accent)',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <ListPlus size={18} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Add an item..."
          style={{
            flex: 1,
            fontSize: 15,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            background: text.trim() ? 'var(--accent)' : 'var(--surface-2)',
            border: 'none',
            cursor: text.trim() && !loading ? 'pointer' : 'default',
            color: text.trim() ? '#fff' : 'var(--text-2)',
            transition: 'background 0.15s',
            flexShrink: 0,
            position: 'relative',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <div className="loading-led" style={{ background: '#fff', boxShadow: '0 0 8px 2px oklch(100% 0 0 / 0.4)' }} />
          ) : (
            <ArrowRight size={18} />
          )}
        </button>
      </div>
    </div>
  );
}