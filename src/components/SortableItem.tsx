import { useState, useRef } from 'react';
import { Trash2, CheckCircle2, Circle, GripVertical, Pencil, Check, Square } from 'lucide-react';
import type { Schema } from '../../amplify/data/resource';

type Category = Schema['Category']['type'];
type ListItem = Schema['ListItem']['type'];

type ColorClasses = Record<string, { bg: string; text: string; pillBg: string }>;

interface SortableItemProps {
  item: ListItem;
  category?: Category;
  colorClasses: ColorClasses;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ListItem) => void;
  draggedId: string | null;
  setDraggedId: (id: string | null) => void;
  onReorder: (sourceId: string, targetId: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (id: string) => void;
}

export function SortableItem({
  item,
  category,
  colorClasses,
  onToggle,
  onDelete,
  onEdit,
  draggedId,
  setDraggedId,
  onReorder,
  isSelectionMode = false,
  isSelected = false,
  onSelectToggle,
}: SortableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleMobileEdit = () => {
    if (isSelectionMode || typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      resetSwipe();
      onEdit(item);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    if (diff < 0 && diff > -100) setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (translateX < -50) setTranslateX(-72);
    else setTranslateX(0);
    touchStartX.current = null;
  };

  const resetSwipe = () => setTranslateX(0);

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedId(item.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId && draggedId !== item.id) setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== item.id) {
      onReorder(sourceId, item.id);
    }
    setDraggedId(null);
  };

  return (
    <div
      className="relative mb-2 group cursor-pointer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-end pr-5 bg-red-500 rounded-lg">
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-white p-1 hover:scale-110 transition-transform"
          aria-label="Delete item"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={() => setDraggedId(null)}
        onClick={handleMobileEdit}
        className={`relative flex items-center p-3 bg-white dark:bg-zinc-900 border ${
          dragOver
            ? 'border-emerald-500 dark:border-emerald-500 scale-[1.02]'
            : 'border-zinc-200 dark:border-zinc-800'
        } ${draggedId === item.id ? 'opacity-50' : 'opacity-100'} rounded-lg shadow-sm transition-all duration-200 ease-out`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={resetSwipe}
      >
        <div
          className="drag-handle p-2 -ml-2 mr-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 transition-colors touch-none select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          {isSelectionMode && onSelectToggle ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectToggle(item.id);
              }}
              className="flex-shrink-0 cursor-pointer"
              aria-label={isSelected ? 'Deselect item' : 'Select item'}
            >
              {isSelected ? (
                <Check size={22} className="text-zinc-800 dark:text-zinc-200" />
              ) : (
                <Square size={22} className="text-zinc-300 dark:text-zinc-600" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetSwipe();
                onToggle(item.id, !!item.isCompleted);
              }}
              className="flex-shrink-0 cursor-pointer"
              aria-label={item.isCompleted ? 'Mark item incomplete' : 'Mark item complete'}
            >
              {item.isCompleted ? (
                <CheckCircle2 size={24} className="text-zinc-800 dark:text-zinc-200 transition-colors" />
              ) : (
                <Circle size={24} className="text-zinc-300 dark:text-zinc-600 transition-colors" />
              )}
            </button>
          )}
          <div className="flex flex-col overflow-hidden">
            <span
              className={`text-base font-medium truncate transition-all ${
                item.isCompleted
                  ? 'text-zinc-400 dark:text-zinc-500 line-through'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {item.name}
            </span>
            {category?.color && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit mt-0.5 uppercase tracking-wider ${
                  colorClasses[category.color as string]?.pillBg || colorClasses.gray.pillBg
                }`}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 pl-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            x{item.quantity ?? 1}
          </span>
          {!isSelectionMode && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="hidden md:inline-flex p-1 text-zinc-400 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Edit item"
                title="Edit item"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="hidden md:inline-flex p-1 text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                aria-label="Delete item"
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
