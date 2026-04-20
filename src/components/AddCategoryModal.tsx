import { catDot, type CatColorName } from '../lib/categoryColors';
import { useState } from 'react';

interface AddCategoryModalProps {
  isDark: boolean;
  onAdd: (name: string, color: CatColorName) => void;
  onClose: () => void;
}

const ADD_COLORS: CatColorName[] = ['gray', 'green', 'blue', 'red', 'orange', 'purple', 'pink'];

export function AddCategoryModal({ onAdd, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<CatColorName>('gray');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'oklch(0% 0 0 / 0.5)',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          padding: 24,
          maxWidth: 320,
          width: '90%',
          boxShadow: '0 8px 24px oklch(0% 0 0 / 0.14)',
          animation: 'slideUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
          Add Category
        </h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
          autoFocus
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 14,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--text)',
            outline: 'none',
            marginBottom: 16,
          }}
        />

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {ADD_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: catDot(c),
                border: color === c ? '2.5px solid var(--text)' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              background: 'var(--surface-2)',
              color: 'var(--text)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              background: name.trim() ? 'var(--accent)' : 'var(--surface-2)',
              color: name.trim() ? '#fff' : 'var(--text-2)',
              fontSize: 14,
              fontWeight: 600,
              cursor: name.trim() ? 'pointer' : 'default',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}