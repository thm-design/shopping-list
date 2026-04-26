import { X, Plus, Check, Edit2, Trash2, ListPlus, GripVertical, ArrowUpDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

interface ShoppingList {
  id: string;
  name: string;
  itemCount?: number;
  createdAt?: string;
}

interface MyListsPanelProps {
  lists: ShoppingList[];
  currentListId: string;
  onSelectList: (id: string) => void;
  onClose: () => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onUpdateListName: (id: string, name: string) => void;
  onReorderLists?: (activeId: string, overId: string) => void;
  isDark: boolean;
  isStatic?: boolean;
}

type ListSortMode = 'custom' | 'alphabetical' | 'date';

interface SortableListRowProps {
  list: ShoppingList;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  setEditName: (v: string) => void;
  saveEdit: () => void;
  startEditing: (l: ShoppingList) => void;
  onSelectList: (id: string) => void;
  onClose: () => void;
  onDeleteList: (id: string) => void;
  withLoading: (a: string, f: () => Promise<void> | void) => void;
  loadingAction: string | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  listsCount: number;
  isSortable: boolean;
}

function SortableListRow({ 
  list, isActive, isEditing, editName, setEditName, saveEdit, startEditing, onSelectList, onClose, onDeleteList, withLoading, loadingAction, editInputRef, listsCount, isSortable 
}: SortableListRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: list.id,
    disabled: !isSortable 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    background: isActive ? 'var(--accent-bg)' : 'transparent',
    paddingRight: 8,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        {...attributes} 
        {...listeners} 
        style={{ 
          paddingLeft: 12, 
          cursor: isSortable ? 'grab' : 'default', 
          color: isSortable ? 'var(--text-2)' : 'transparent', 
          display: 'flex', 
          alignItems: 'center',
          pointerEvents: isSortable ? 'auto' : 'none' 
        }}
      >
        <GripVertical size={14} />
      </div>
      <button
        onClick={() => { if (!isEditing) { onSelectList(list.id); onClose(); } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px 10px 8px',
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
              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditName(list.name); }}
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
        {listsCount > 1 && (
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
}

export function MyListsPanel({ 
  lists, 
  currentListId, 
  onSelectList, 
  onClose, 
  onAddList, 
  onDeleteList, 
  onUpdateListName, 
  onReorderLists,
  isDark,
  isStatic = false 
}: MyListsPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [listSortMode, setListSortMode] = useState<ListSortMode>('custom');
  const editInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
    if (!trimmed || lists.length >= 20) return;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderLists) {
      if (listSortMode !== 'custom') {
        setListSortMode('custom');
      }
      onReorderLists(active.id as string, over.id as string);
    }
  };

  const sortedLists = useMemo(() => {
    const result = [...lists];
    if (listSortMode === 'alphabetical') {
      return result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    if (listSortMode === 'date') {
      return result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return result;
  }, [lists, listSortMode]);

  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingListId]);

  const isAtLimit = lists.length >= 20;

  return (
    <>
      {!isStatic && (
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
      )}
      <div
        style={{
          position: isStatic ? 'relative' : 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: isStatic ? '280px' : 'min(300px, 85vw)',
          zIndex: isStatic ? 1 : 51,
          background: 'var(--surface)',
          animation: isStatic ? 'none' : 'slideInLeft 0.22s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isStatic ? 'none' : '4px 0 24px oklch(0% 0 0 / 0.15)',
          borderRight: isStatic ? '1px solid var(--border)' : 'none',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: isDark ? '#fff' : '#111',
                color: isDark ? '#111' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px oklch(0% 0 0 / 0.1)',
              }}
            >
              
              <ListPlus size={20} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: 'var(--text)', margin: 0 }}>My Lists</h1>
          </div>

          <button
              onClick={onClose}
              style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
            >
              <X size={16} />
            </button>
        </div>

        <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Lists</h2>
          
          <button
            onClick={() => {
              const modes: ListSortMode[] = ['custom', 'alphabetical', 'date'];
              const next = modes[(modes.indexOf(listSortMode) + 1) % modes.length];
              setListSortMode(next);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--surface-2)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-2)',
              textTransform: 'uppercase',
            }}
          >
            <ArrowUpDown size={12} />
            {listSortMode}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={sortedLists.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedLists.map((list) => (
                <SortableListRow
                  key={list.id}
                  list={list}
                  isActive={list.id === currentListId}
                  isEditing={editingListId === list.id}
                  editName={editName}
                  setEditName={setEditName}
                  saveEdit={saveEdit}
                  startEditing={startEditing}
                  onSelectList={onSelectList}
                  onClose={onClose}
                  onDeleteList={onDeleteList}
                  withLoading={withLoading}
                  loadingAction={loadingAction}
                  editInputRef={editInputRef}
                  listsCount={lists.length}
                  isSortable={listSortMode === 'custom'}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 20px' }}>
          {showAdd ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                  disabled={!!loadingAction || !newName.trim() || isAtLimit}
                  style={{
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--r-sm)',
                    cursor: (loadingAction || !newName.trim() || isAtLimit) ? 'not-allowed' : 'pointer',
                    minWidth: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isAtLimit ? 0.5 : 1,
                  }}
                >
                  {loadingAction === 'add' ? <div className="loading-led" style={{ background: '#fff' }} /> : 'Add'}
                </button>
              </div>
              {isAtLimit && (
                <div style={{ fontSize: 11, color: 'oklch(52% 0.22 25)', fontWeight: 600 }}>
                  Max 20 lists reached
                </div>
              )}
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