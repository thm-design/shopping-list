import React, { useState, useEffect, useRef, useMemo, createContext } from 'react';
import {
  ShoppingBag, Moon, Sun, Plus, Trash2, Share2, FileDown,
  CheckCircle2, Circle, X, Tag, ListTodo, MessageCircle, Link as LinkIcon, Download, Sparkles, GripVertical
} from 'lucide-react';

// ============================================================================
// AMPLIFY GEN 2 MOCK SCHEMA & CLIENT
// ============================================================================

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type ListItem = {
  id: string;
  name: string;
  categoryId: string;
  isCompleted: boolean;
  quantity: number;
  sortOrder: number; // Added for Custom Sort functionality
};

// Mock Initial Data
const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Produce', color: 'green' },
  { id: 'c2', name: 'Meat', color: 'red' },
  { id: 'c3', name: 'Dairy', color: 'blue' },
  { id: 'c4', name: 'Pantry', color: 'orange' },
  { id: 'c5', name: 'General', color: 'gray' },
];

const MOCK_ITEMS: ListItem[] = [
  { id: 'i1', name: 'Avocados', categoryId: 'c1', isCompleted: false, quantity: 3, sortOrder: 0 },
  { id: 'i2', name: 'Ribeye Steak', categoryId: 'c2', isCompleted: false, quantity: 2, sortOrder: 1 },
  { id: 'i3', name: 'Almond Milk', categoryId: 'c3', isCompleted: true, quantity: 1, sortOrder: 2 },
  { id: 'i4', name: 'Pasta', categoryId: 'c4', isCompleted: false, quantity: 2, sortOrder: 3 },
  { id: 'i5', name: 'Paper Towels', categoryId: 'c5', isCompleted: false, quantity: 1, sortOrder: 4 },
];

// Mocking the Amplify `generateClient<Schema>()` API
const generateMockClient = () => {
  let items = [...MOCK_ITEMS];
  let categories = [...MOCK_CATEGORIES];

  const simulateNetwork = (ms = 200) => new Promise(res => setTimeout(res, ms));

  return {
    models: {
      ListItem: {
        list: async () => { await simulateNetwork(); return { data: [...items] }; },
        create: async (data: Omit<ListItem, 'id'>) => {
          await simulateNetwork(100);
          const newItem = { ...data, id: Math.random().toString(36).substring(7) };
          items = [newItem, ...items];
          return { data: newItem };
        },
        update: async (data: Partial<ListItem> & { id: string }) => {
          await simulateNetwork(100);
          items = items.map(i => i.id === data.id ? { ...i, ...data } : i);
          return { data: items.find(i => i.id === data.id)! };
        },
        delete: async ({ id }: { id: string }) => {
          await simulateNetwork(100);
          items = items.filter(i => i.id !== id);
          return { data: { id } };
        }
      },
      Category: {
        list: async () => { await simulateNetwork(); return { data: [...categories] }; },
        create: async (data: Omit<Category, 'id'>) => {
          await simulateNetwork(100);
          const newCategory = { ...data, id: Math.random().toString(36).substring(7) };
          categories = [...categories, newCategory];
          return { data: newCategory };
        },
        update: async (data: Partial<Category> & { id: string }) => {
          await simulateNetwork(100);
          categories = categories.map(c => c.id === data.id ? { ...c, ...data } : c);
          return { data: categories.find(c => c.id === data.id)! };
        },
        delete: async ({ id }: { id: string }) => {
          await simulateNetwork(100);
          categories = categories.filter(c => c.id !== id);
          items = items.filter(i => i.categoryId !== id); // Cleanup orphans
          return { data: { id } };
        }
      }
    }
  };
};

const client = generateMockClient();

// ============================================================================
// THEME & COLOR UTILITIES
// ============================================================================
const colorClasses: Record<string, { bg: string, text: string, pillBg: string }> = {
  red: { bg: 'bg-red-500', text: 'text-red-500', pillBg: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' },
  green: { bg: 'bg-emerald-500', text: 'text-emerald-500', pillBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', pillBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', pillBg: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' },
  yellow: { bg: 'bg-amber-500', text: 'text-amber-500', pillBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', pillBg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500', pillBg: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400' },
  gray: { bg: 'bg-zinc-500', text: 'text-zinc-500', pillBg: 'bg-zinc-100 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-400' },
};

const AVAILABLE_COLORS = Object.keys(colorClasses);

// ============================================================================
// CONTEXTS
// ============================================================================
type ThemeContextType = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

// ============================================================================
// COMPONENTS
// ============================================================================

// --- Splash Screen ---
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="relative animate-pulse">
        <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900 dark:bg-white rounded-xl shadow-2xl">
          <ShoppingBag size={40} className="text-white dark:text-zinc-900" strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
        AirList
      </h1>
    </div>
  );
};

// --- Swipeable & Draggable List Item ---
const SortableItem = ({
  item,
  category,
  onToggle,
  onDelete,
  draggedId,
  setDraggedId,
  onReorder
}: {
  item: ListItem;
  category?: Category;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  draggedId: string | null;
  setDraggedId: (id: string | null) => void;
  onReorder: (sourceId: string, targetId: string) => void;
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't swipe if touching the drag handle
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
    if (translateX < -50) setTranslateX(-72); // Reveal delete
    else setTranslateX(0); // Snap back
    touchStartX.current = null;
  };

  const resetSwipe = () => setTranslateX(0);

  // Drag handlers
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
      className="relative mb-2 group"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Actions (Delete) */}
      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-end pr-5 bg-red-500 rounded-lg">
        <button onClick={() => onDelete(item.id)} className="text-white p-1 hover:scale-110 transition-transform">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Foreground Content */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={() => setDraggedId(null)}
        className={`relative flex items-center p-3 bg-white dark:bg-zinc-900 border ${dragOver ? 'border-emerald-500 dark:border-emerald-500 scale-[1.02]' : 'border-zinc-200 dark:border-zinc-800'} ${draggedId === item.id ? 'opacity-50' : 'opacity-100'} rounded-lg shadow-sm transition-all duration-200 ease-out`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={resetSwipe}
      >
        <div className="drag-handle p-2 -ml-2 mr-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 transition-colors touch-none">
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          <button onClick={() => { resetSwipe(); onToggle(item.id, item.isCompleted); }} className="flex-shrink-0">
            {item.isCompleted ? (
              <CheckCircle2 size={24} className="text-zinc-800 dark:text-zinc-200 transition-colors" />
            ) : (
              <Circle size={24} className="text-zinc-300 dark:text-zinc-600 transition-colors" />
            )}
          </button>
          <div className="flex flex-col overflow-hidden">
            <span className={`text-base font-medium truncate transition-all ${item.isCompleted ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {item.name}
            </span>
            {category && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit mt-0.5 uppercase tracking-wider ${colorClasses[category.color]?.pillBg || colorClasses.gray.pillBg}`}>
                {category.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 pl-3">
          {item.quantity > 1 && (
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              x{item.quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Teaser View ---
const TeaserView = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerTeaser = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="p-6 h-full flex flex-col pt-8">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="text-zinc-800 dark:text-zinc-200" size={24} />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Pro Features</h2>
      </div>
      
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        Future updates powered by AWS Amplify will bring collaboration and export features to AirList.
      </p>

      <div className="space-y-3">
        <button 
          onClick={() => triggerTeaser('Coming Soon: Send link to WhatsApp')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Share to WhatsApp</h3>
              <p className="text-xs text-zinc-500">Send your list directly to chats</p>
            </div>
          </div>
          <LinkIcon size={18} className="text-zinc-300 dark:text-zinc-600" />
        </button>

        <button 
          onClick={() => triggerTeaser('Coming Soon: Generate PDF Document')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <FileDown size={20} className="text-zinc-700 dark:text-zinc-300" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Export as PDF</h3>
              <p className="text-xs text-zinc-500">Download a clean printable list</p>
            </div>
          </div>
          <Download size={18} className="text-zinc-300 dark:text-zinc-600" />
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg shadow-xl font-medium animate-in fade-in slide-in-from-top-4 z-50 whitespace-nowrap text-xs">
          {toastMsg}
        </div>
      )}
    </div>
  );
};


// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  // State
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // UI State
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'categories' | 'teaser'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<string>('');
  const [newItemQty, setNewItemQty] = useState(1);

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('gray');

  // Initialization
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: cats }, { data: itms }] = await Promise.all([
          client.models.Category.list(),
          client.models.ListItem.list()
        ]);
        setCategories(cats);
        setItems(itms.sort((a, b) => a.sortOrder - b.sortOrder));
        if (cats.length > 0) setNewItemCat(cats[0].id);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Derived state
  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) {
      result = items.filter(i => i.categoryId === selectedCategory);
    }
    return result.sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return a.sortOrder - b.sortOrder;
      return a.isCompleted ? 1 : -1; // Uncompleted always float to top if we aren't strict on absolute sort order
    });
  }, [items, selectedCategory]);

  // Actions
  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems(items.map(i => i.id === id ? { ...i, isCompleted: !currentStatus } : i));
    await client.models.ListItem.update({ id, isCompleted: !currentStatus });
  };

  const deleteItem = async (id: string) => {
    setItems(items.filter(i => i.id !== id));
    await client.models.ListItem.delete({ id });
  };

  const deleteCategory = async (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setItems(items.filter(i => i.categoryId !== id));
    if (selectedCategory === id) setSelectedCategory(null);
    await client.models.Category.delete({ id });
  };

  const handleReorder = async (sourceId: string, targetId: string) => {
    // 1. Reorder the array in memory
    const newItems = [...items];
    const sourceIndex = newItems.findIndex(i => i.id === sourceId);
    const targetIndex = newItems.findIndex(i => i.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    // 2. Update sortOrder numbers sequentially
    const updatedItems = newItems.map((item, index) => ({ ...item, sortOrder: index }));
    setItems(updatedItems);

    // 3. Persist new sort order to DB
    updatedItems.forEach(item => {
      client.models.ListItem.update({ id: item.id, sortOrder: item.sortOrder });
    });

    // 4. Create "Custom Sort" category if it doesn't exist
    const customSortName = "Custom Sort";
    let customCat = categories.find(c => c.name === customSortName);
    
    if (!customCat) {
      const { data } = await client.models.Category.create({
        name: customSortName,
        color: 'purple'
      });
      setCategories(prev => [...prev, data]);
      // Optional: Auto-select it to show the user what happened
      // setSelectedCategory(data.id); 
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCat) return;

    const payload = {
      name: newItemName.trim(),
      categoryId: newItemCat,
      quantity: newItemQty,
      isCompleted: false,
      sortOrder: items.length // Append to end
    };

    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemQty(1);

    const { data } = await client.models.ListItem.create(payload);
    setItems(prev => [...prev, data]);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddCatModalOpen(false);
    const { data } = await client.models.Category.create({
      name: newCatName.trim(),
      color: newCatColor
    });
    setCategories(prev => [...prev, data]);
    setNewCatName('');
    setNewCatColor('gray');
  };

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* TOP BAR */}
        <header className="px-6 pt-10 pb-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-900">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">AirList</h1>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 active:scale-95 transition-transform"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          {/* TAB: LIST */}
          {activeTab === 'list' && (
            <div className="flex flex-col h-full animate-in fade-in duration-200">
              
              {/* Category Filter Horizontal Scroll */}
              <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar snap-x">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`snap-start whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedCategory === null 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`snap-start whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                         ? `${colorClasses[cat.color].bg} text-white shadow-sm`
                         : `${colorClasses[cat.color].pillBg} border border-transparent`
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="px-6 flex-1">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
                    <ShoppingBag size={40} className="mb-3 text-zinc-400" />
                    <p className="text-base font-medium">List is empty</p>
                  </div>
                ) : (
                  <div className="pb-4">
                    {filteredItems.map(item => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        category={categories.find(c => c.id === item.categoryId)}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                        draggedId={draggedId}
                        setDraggedId={setDraggedId}
                        onReorder={handleReorder}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Categories & Tags</h2>
                <button 
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="text-zinc-900 dark:text-white font-semibold text-sm flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 rounded-md"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm ${colorClasses[cat.color].bg}`} />
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TEASER */}
          {activeTab === 'teaser' && <TeaserView />}

        </main>

        {/* FLOATING ACTION BUTTON */}
        {activeTab === 'list' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-24 right-6 w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
          >
            <Plus size={24} />
          </button>
        )}

        {/* BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 pb-safe z-40">
          <div className="flex items-center justify-around p-1 pb-5 pt-2 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'list' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <ListTodo size={20} />
              <span className="text-[10px] font-semibold tracking-wide">List</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'categories' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <Tag size={20} />
              <span className="text-[10px] font-semibold tracking-wide">Tags</span>
            </button>
            <button
              onClick={() => setActiveTab('teaser')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'teaser' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <Share2 size={20} />
              <span className="text-[10px] font-semibold tracking-wide">Pro</span>
            </button>
          </div>
        </nav>

        {/* MODAL: ADD ITEM */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">New Item</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Organic Bananas"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Category</label>
                    <select
                      value={newItemCat}
                      onChange={e => setNewItemCat(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-zinc-400 appearance-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Qty</label>
                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden h-[42px]">
                      <button type="button" onClick={() => setNewItemQty(Math.max(1, newItemQty - 1))} className="px-2.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-full">-</button>
                      <span className="flex-1 text-center text-sm font-semibold">{newItemQty}</span>
                      <button type="button" onClick={() => setNewItemQty(newItemQty + 1)} className="px-2.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-full">+</button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newItemName.trim() || !newItemCat}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold py-3 rounded-lg mt-2 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  Save Item
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD CATEGORY */}
        {isAddCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">New Category</h3>
                <button onClick={() => setIsAddCatModalOpen(false)} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Frozen Foods"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-sm outline-none focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Color Tag</label>
                  <div className="flex flex-wrap gap-2.5">
                    {AVAILABLE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCatColor(color)}
                        className={`w-8 h-8 rounded-md ${colorClasses[color].bg} flex items-center justify-center transition-transform ${newCatColor === color ? 'scale-110 ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : 'scale-100'}`}
                      >
                        {newCatColor === color && <CheckCircle2 size={16} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold py-3 rounded-lg mt-2 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
      
      {/* Required base css adjustments for native feel + Inter Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </ThemeContext.Provider>
  );
} 
