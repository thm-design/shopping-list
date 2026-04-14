import { useState, useEffect, useMemo, useCallback, createContext } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { Moon, Sun, Plus, Trash2, Share2, X, Tag, ListTodo, ShoppingBag, Check, Square } from 'lucide-react';

import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { SortableItem } from './components/SortableItem';
import { TeaserView } from './components/TeaserView';

export type Category = Schema['Category']['type'];
export type ListItem = Schema['ListItem']['type'];
export type UserPreference = Schema['UserPreference']['type'];

type Theme = 'light' | 'dark';
type SortMode = 'category' | 'custom';

const PREFERENCE_ID_STORAGE_KEY = 'airlist:preferenceId';
const USER_KEY_STORAGE_KEY = 'airlist:userKey';
const THEME_STORAGE_KEY = 'airlist:theme';
const SORT_MODE_STORAGE_KEY = 'airlist:sortMode';

const colorClasses: Record<string, { bg: string; text: string; pillBg: string }> = {
  red: { bg: 'bg-red-500', text: 'text-red-500', pillBg: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' },
  green: { bg: 'bg-emerald-500', text: 'text-emerald-500', pillBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', pillBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', pillBg: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' },
  yellow: { bg: 'bg-amber-500', text: 'text-amber-500', pillBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', pillBg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500', pillBg: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400' },
  gray: { bg: 'bg-zinc-500', text: 'text-zinc-500', pillBg: 'bg-zinc-100 dark:bg-zinc-500/20 text-zinc-700 dark:text-zinc-400' },
};

const DEFAULT_CATEGORIES = [
  { name: 'Produce', color: 'green' },
  { name: 'Meat', color: 'red' },
  { name: 'Dairy', color: 'blue' },
  { name: 'Pantry', color: 'orange' },
  { name: 'General', color: 'gray' },
] as const;

const normalizeName = (value?: string | null) => value?.trim().toLowerCase() ?? '';
const DEFAULT_CATEGORY_MAP = new Map(DEFAULT_CATEGORIES.map(category => [normalizeName(category.name), category]));

const AVAILABLE_COLORS = Object.keys(colorClasses).filter(k => k !== 'text');

type ThemeContextType = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

function AppImpl() {
  const client = useMemo(() => generateClient<Schema>({ authMode: 'apiKey' }), []);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return 'light';
  });
  const isDark = theme === 'dark';
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);
  const [sortMode, setSortMode] = useState<SortMode>(() => {
    if (typeof window === 'undefined') return 'category';
    const stored = window.localStorage.getItem(SORT_MODE_STORAGE_KEY) as SortMode | null;
    if (stored === 'category' || stored === 'custom') {
      return stored;
    }
    return 'category';
  });
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const handleSortModeChange = useCallback((mode: SortMode) => {
    setSortMode(mode);
  }, []);
  const [activeTab, setActiveTab] = useState<'list' | 'categories' | 'teaser'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<string>('');
  const [newItemQty, setNewItemQty] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCat, setEditItemCat] = useState<string>('');
  const [editItemQty, setEditItemQty] = useState(1);

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('gray');

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteConfirmData, setDeleteConfirmData] = useState<{ type: 'item' | 'items' | 'category' | 'categories'; count: number; name?: string; ids?: string[] } | null>(null);

  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [isItemSelectionMode, setIsItemSelectionMode] = useState(false);

  const getOrCreateUserKey = useCallback(() => {
    if (typeof window === 'undefined') return 'anonymous';
    let key = window.localStorage.getItem(USER_KEY_STORAGE_KEY);
    if (!key) {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        key = crypto.randomUUID();
      } else {
        key = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      }
      window.localStorage.setItem(USER_KEY_STORAGE_KEY, key);
    }
    return key;
  }, []);

  useEffect(() => {
    if (preference) return;
    let isMounted = true;
    if (typeof window === 'undefined') return () => { isMounted = false; };

    const initialisePreference = async () => {
      try {
        const storedPreferenceId = window.localStorage.getItem(PREFERENCE_ID_STORAGE_KEY);
        let nextPreference: UserPreference | null = null;

        if (storedPreferenceId) {
          const { data } = await client.models.UserPreference.get({ id: storedPreferenceId });
          if (data) {
            nextPreference = data as UserPreference;
          }
        }

        if (!nextPreference) {
          const { data } = await client.models.UserPreference.create({
            userKey: getOrCreateUserKey(),
            theme,
            sortMode,
          });
          if (data) {
            window.localStorage.setItem(PREFERENCE_ID_STORAGE_KEY, data.id);
            nextPreference = data as UserPreference;
          }
        }

        if (nextPreference && isMounted) {
          setPreference(nextPreference);
          if (nextPreference.theme === 'dark' || nextPreference.theme === 'light') {
            setTheme(nextPreference.theme as Theme);
          }
          if (nextPreference.sortMode === 'category' || nextPreference.sortMode === 'custom') {
            setSortMode(nextPreference.sortMode as SortMode);
          }
        }
      } catch (error) {
        console.error('Failed to load user preference', error);
      }
    };

    initialisePreference();

    return () => {
      isMounted = false;
    };
  }, [client, getOrCreateUserKey, theme, sortMode, preference]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SORT_MODE_STORAGE_KEY, sortMode);
  }, [sortMode]);

  useEffect(() => {
    if (!preference) return;
    const updates: Partial<UserPreference> = {};
    if (preference.theme !== theme) {
      updates.theme = theme;
    }
    if (preference.sortMode !== sortMode) {
      updates.sortMode = sortMode;
    }
    if (Object.keys(updates).length === 0) return;

    let isCancelled = false;

    const persist = async () => {
      try {
        await client.models.UserPreference.update({ id: preference.id, ...updates });
        if (!isCancelled) {
          setPreference(prev => (prev ? { ...prev, ...updates } as UserPreference : prev));
        }
      } catch (error) {
        console.error('Failed to persist user preference', error);
      }
    };

    persist();

    return () => {
      isCancelled = true;
    };
  }, [client, preference, theme, sortMode]);

  const isProtectedCategory = (category?: Category | null) => DEFAULT_CATEGORY_MAP.has(normalizeName(category?.name));

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [{ data: cats }, { data: itms }] = await Promise.all([
          client.models.Category.list({}),
          client.models.ListItem.list({})
        ]);
        const validCats = cats.filter(Boolean);
        const validItems = itms.filter(Boolean);

        const categoryByName = new Map<string, Category>();
        const duplicateCategories: Category[] = [];

        for (const category of validCats) {
          const normalized = normalizeName(category.name);
          if (!normalized) continue;

          if (!categoryByName.has(normalized)) {
            categoryByName.set(normalized, category);
          } else {
            duplicateCategories.push(category);
          }
        }

        let mergedItems = [...validItems];

        for (const duplicate of duplicateCategories) {
          const primaryCategory = categoryByName.get(normalizeName(duplicate.name));
          if (!primaryCategory || primaryCategory.id === duplicate.id) continue;

          const itemsToReassign = mergedItems.filter(item => item.categoryId === duplicate.id);
          if (itemsToReassign.length > 0) {
            await Promise.all(
              itemsToReassign.map(item => client.models.ListItem.update({ id: item.id, categoryId: primaryCategory.id }))
            );
            mergedItems = mergedItems.map(item =>
              item.categoryId === duplicate.id ? { ...item, categoryId: primaryCategory.id } : item
            );
          }

          await client.models.Category.delete({ id: duplicate.id });
        }

        const missingDefaults = DEFAULT_CATEGORIES.filter(category => !categoryByName.has(normalizeName(category.name)));
        for (const category of missingDefaults) {
          const { data: createdCategory } = await client.models.Category.create(category);
          if (createdCategory) {
            categoryByName.set(normalizeName(createdCategory.name), createdCategory);
          }
        }

        const nextCategories = Array.from(categoryByName.values()).sort((a, b) =>
          (a.name ?? '').localeCompare(b.name ?? '')
        );

        if (isMounted) {
          setCategories(nextCategories);
          setItems([...mergedItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
          if (nextCategories.length > 0) setNewItemCat(nextCategories[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    const categoryCreateSub = client.models.Category.onCreate().subscribe({
      next: (data) => {
        if (isMounted && data?.id) {
          const incomingCategory = data as Category;
          const normalized = normalizeName(incomingCategory.name);
          setCategories(prev => {
            if (prev.some(c => c.id === incomingCategory.id)) return prev;
            if (prev.some(c => normalizeName(c.name) === normalized)) return prev;
            return [...prev, incomingCategory].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
          });
        }
      },
      error: (err) => console.error("Category create subscription error:", err)
    });

    const categoryUpdateSub = client.models.Category.onUpdate().subscribe({
      next: (data) => {
        if (isMounted) setCategories(prev => prev.map(c => c.id === (data as Category).id ? data as Category : c));
      },
      error: (err) => console.error("Category update subscription error:", err)
    });

    const categoryDeleteSub = client.models.Category.onDelete().subscribe({
      next: (data) => {
        if (isMounted) {
          const deletedId = (data as Category).id;
          setCategories(prev => prev.filter(c => c.id !== deletedId));
          setItems(prev => prev.filter(i => i.categoryId !== deletedId));
        }
      },
      error: (err) => console.error("Category delete subscription error:", err)
    });

    const itemCreateSub = client.models.ListItem.onCreate().subscribe({
      next: (data) => {
        if (isMounted && data?.id) {
          setItems(prev => {
            if (prev.some(i => i.id === data.id)) return prev;
            return [...prev, data as ListItem];
          });
        }
      },
      error: (err) => console.error("ListItem create subscription error:", err)
    });

    const itemUpdateSub = client.models.ListItem.onUpdate().subscribe({
      next: (data) => {
        if (isMounted) setItems(prev => prev.map(i => i.id === (data as ListItem).id ? data as ListItem : i));
      },
      error: (err) => console.error("ListItem update subscription error:", err)
    });

    const itemDeleteSub = client.models.ListItem.onDelete().subscribe({
      next: (data) => {
        if (isMounted) setItems(prev => prev.filter(i => i.id !== (data as ListItem).id));
      },
      error: (err) => console.error("ListItem delete subscription error:", err)
    });

    fetchData();

    return () => {
      isMounted = false;
      categoryCreateSub.unsubscribe();
      categoryUpdateSub.unsubscribe();
      categoryDeleteSub.unsubscribe();
      itemCreateSub.unsubscribe();
      itemUpdateSub.unsubscribe();
      itemDeleteSub.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle('dark', isDark);
    body?.classList.toggle('dark', isDark);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    body.style.colorScheme = theme;
  }, [isDark, theme]);

  const categoryOrder = useMemo(() => {
    const order = new Map<string, number>();
    categories.forEach((category, index) => {
      if (category.id) order.set(category.id, index);
    });
    return order;
  }, [categories]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) {
      result = items.filter(i => i.categoryId === selectedCategory);
    }

    return [...result].sort((a, b) => {
      if (sortMode === 'custom') {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }

      const orderA = a.categoryId ? categoryOrder.get(a.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const orderB = b.categoryId ? categoryOrder.get(b.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) return orderA - orderB;

      const nameA = a.name ?? '';
      const nameB = b.name ?? '';
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
  }, [items, selectedCategory, sortMode, categoryOrder]);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !currentStatus } : i));
    await client.models.ListItem.update({ id, isCompleted: !currentStatus });
  };

  const handleToggleSelectAllItems = useCallback(() => {
    setSelectedItemIds(prev => {
      const filteredIds = filteredItems.map(item => item.id);
      if (filteredIds.length === 0) return prev;
      const allSelected = filteredIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        filteredIds.forEach(id => next.delete(id));
      } else {
        filteredIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, [filteredItems]);

  const requestDeleteItems = (ids: string[]) => {
    if (ids.length === 0) return;

    const uniqueIds = Array.from(new Set(ids));
    const targetItems = items.filter(item => uniqueIds.includes(item.id));
    if (targetItems.length === 0) return;

    setDeleteConfirmData({
      type: uniqueIds.length > 1 ? 'items' : 'item',
      count: uniqueIds.length,
      name: uniqueIds.length === 1 ? targetItems[0].name ?? 'this item' : undefined,
      ids: uniqueIds,
    });
    setIsDeleteConfirmOpen(true);
  };

  const requestDeleteCategories = (ids: string[]) => {
    const uniqueIds = Array.from(new Set(ids));
    const targetCategories = categories.filter(category => uniqueIds.includes(category.id) && !isProtectedCategory(category));
    if (targetCategories.length === 0) return;

    setDeleteConfirmData({
      type: targetCategories.length > 1 ? 'categories' : 'category',
      count: targetCategories.length,
      name: targetCategories.length === 1 ? targetCategories[0].name ?? 'this category' : undefined,
      ids: targetCategories.map(category => category.id),
    });
    setIsDeleteConfirmOpen(true);
  };

  const deleteItem = async (id: string) => {
    requestDeleteItems([id]);
  };

  const deleteSelectedItems = async () => {
    requestDeleteItems(Array.from(selectedItemIds));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const updateItem = async (id: string, updates: Partial<ListItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    await client.models.ListItem.update({ id, ...updates });
  };

  const openEditModal = (item: ListItem) => {
    setEditItem(item);
    setEditItemName(item.name ?? '');
    setEditItemCat(item.categoryId ?? '');
    setEditItemQty(item.quantity ?? 1);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editItemName.trim() || !editItemCat) return;

    const normalizedName = editItemName.trim().toLowerCase();
    const existingItem = items.find(
      item => item.id !== editItem.id && 
              item.name?.toLowerCase() === normalizedName && 
              item.categoryId === editItemCat
    );
    if (existingItem) {
      alert('An item with this name already exists in the selected category.');
      return;
    }

    await updateItem(editItem.id, {
      name: editItemName.trim(),
      categoryId: editItemCat,
      quantity: editItemQty
    });

    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const deleteCategory = async (id: string) => {
    requestDeleteCategories([id]);
  };

  const deleteSelectedCategories = async () => {
    requestDeleteCategories(Array.from(selectedCategoryIds));
  };

  const toggleCategorySelection = (id: string) => {
    setSelectedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReorder = async (sourceId: string, targetId: string) => {
    if (sortMode !== 'custom') {
      handleSortModeChange('custom');
    }
    const newItems = [...items];
    const sourceIndex = newItems.findIndex(i => i.id === sourceId);
    const targetIndex = newItems.findIndex(i => i.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    const updatedItems = newItems.map((item, index) => ({ ...item, sortOrder: index }));
    setItems(updatedItems);

    updatedItems.forEach(item => {
      client.models.ListItem.update({ id: item.id, sortOrder: item.sortOrder });
    });

    const customSortName = "Custom Sort";
    const customCat = categories.find(c => c.name === customSortName);

    if (!customCat) {
      const { data } = await client.models.Category.create({
        name: customSortName,
        color: 'purple'
      });
      if (data) setCategories(prev => [...prev, data]);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCat) return;

    const normalizedName = newItemName.trim().toLowerCase();
    const itemExists = items.some(
      item => item.name?.toLowerCase() === normalizedName && item.categoryId === newItemCat
    );
    if (itemExists) {
      alert('An item with this name already exists in the selected category.');
      return;
    }

    const payload = {
      name: newItemName.trim(),
      categoryId: newItemCat,
      quantity: newItemQty,
      isCompleted: false,
      sortOrder: items.length
    };

    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemQty(1);

    const { data } = await client.models.ListItem.create(payload);
    if (data) setItems(prev => [...prev, data]);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const normalizedInput = normalizeName(newCatName);
    const categoryExists = categories.some(cat => normalizeName(cat.name) === normalizedInput);
    if (categoryExists) {
      alert('A category with this name already exists.');
      return;
    }

    setIsAddCatModalOpen(false);
    const { data } = await client.models.Category.create({
      name: newCatName.trim(),
      color: newCatColor
    });
    if (data) {
      setCategories(prev => [...prev, data].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')));
    }
    setNewCatName('');
    setNewCatColor('gray');
  };

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-hidden flex flex-col transition-colors duration-300">

        <header className="px-4 sm:px-6 pt-8 sm:pt-10 pb-3 sm:pb-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag size={18} className="text-white dark:text-zinc-900" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">AirList</h1>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'list' && !isAddModalOpen && !isEditModalOpen && !isDeleteConfirmOpen && filteredItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsItemSelectionMode(!isItemSelectionMode)}
                  className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 active:scale-95 transition-transform ${isItemSelectionMode ? 'bg-zinc-200 dark:bg-zinc-800' : ''}`}
                  aria-label={isItemSelectionMode ? 'Exit selection mode' : 'Enter selection mode'}
                >
                  {isItemSelectionMode ? <Check size={18} /> : <Square size={18} />}
                </button>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 active:scale-95 transition-transform"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-28 custom-scrollbar">

          {activeTab === 'list' && (
            <div className="flex flex-col h-full animate-in fade-in duration-200">

              <div className="px-4 sm:px-6 pt-4 pb-2 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Sort Items</span>
                  <div
                    role="group"
                    aria-label="Sort mode"
                    className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleSortModeChange('category')}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${sortMode === 'category' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400'}`}
                      aria-pressed={sortMode === 'category'}
                    >
                      By Category
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortModeChange('custom')}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l border-zinc-200 dark:border-zinc-800 ${sortMode === 'custom' ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400'}`}
                      aria-pressed={sortMode === 'custom'}
                    >
                      Custom
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 pb-4 overflow-hidden">
                <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x px-0">
                <button
                  type="button"
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
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`snap-start whitespace-nowrap px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedCategory === cat.id
                        ? `${colorClasses[cat.color ?? 'gray'].bg} text-white shadow-sm`
                        : `${colorClasses[cat.color ?? 'gray'].pillBg} border border-transparent`
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                </div>
              </div>

              <div className="px-4 sm:px-6 flex-1">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center opacity-40">
                    <div className="mb-3"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></div>
                    <p className="text-base font-medium">List is empty</p>
                  </div>
                ) : (
                  <div className="pb-4">
                    {isItemSelectionMode && (
                      <div className="flex items-center justify-between mb-3 sticky top-16 bg-zinc-50 dark:bg-zinc-950 py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 z-10">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {selectedItemIds.size} selected
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleToggleSelectAllItems}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800"
                          >
                            {filteredItems.length > 0 && selectedItemIds.size >= filteredItems.length ? 'Deselect All' : 'Select All'}
                          </button>
                          <button
                            type="button"
                            onClick={deleteSelectedItems}
                            disabled={selectedItemIds.size === 0}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsItemSelectionMode(false);
                              setSelectedItemIds(new Set());
                            }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {filteredItems.map(item => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        category={categories.find(c => c.id === item.categoryId) ?? undefined}
                        colorClasses={colorClasses}
                        onToggle={toggleItem}
                        onDelete={deleteItem}
                        onEdit={openEditModal}
                        draggedId={draggedId}
                        setDraggedId={setDraggedId}
                        onReorder={handleReorder}
                        isSelectionMode={isItemSelectionMode}
                        isSelected={selectedItemIds.has(item.id)}
                        onSelectToggle={toggleItemSelection}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Categories</h2>
                  {selectedCategoryIds.size > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                      {selectedCategoryIds.size}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedCategoryIds.size > 0 && (
                    <button
                      type="button"
                      onClick={deleteSelectedCategories}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-red-500 text-white flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCategoryIds.size > 0) {
                        setSelectedCategoryIds(new Set());
                      } else {
                        setSelectedCategoryIds(new Set(categories.filter(category => !isProtectedCategory(category)).map(category => category.id)));
                      }
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-200 dark:bg-zinc-800"
                  >
                    {selectedCategoryIds.size > 0 ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCatModalOpen(true)}
                    className="text-zinc-900 dark:text-white font-semibold text-sm flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 rounded-md"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedCategoryIds.has(cat.id) 
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600' 
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                    onClick={() => {
                      if (!isProtectedCategory(cat)) {
                        toggleCategorySelection(cat.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isProtectedCategory(cat) ? (
                        <div className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Default
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedCategoryIds.has(cat.id) 
                            ? 'bg-zinc-800 dark:bg-white border-zinc-800 dark:border-white' 
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}>
                          {selectedCategoryIds.has(cat.id) && (
                            <Check size={10} className={selectedCategoryIds.has(cat.id) ? 'text-white dark:text-zinc-900' : ''} />
                          )}
                        </div>
                      )}
                      <div className={`w-3 h-3 rounded-sm ${colorClasses[cat.color ?? 'gray'].bg}`} />
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                    {!isProtectedCategory(cat) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(cat.id);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label={`Delete ${cat.name} category`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teaser' && <TeaserView />}

        </main>

        {activeTab === 'list' && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-200 text-white dark:text-zinc-900 rounded-full shadow-xl shadow-zinc-900/20 dark:shadow-white/20 flex items-center justify-center active:scale-90 transition-all z-30 hover:scale-105"
            aria-label="Add new item"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        )}

        <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 pb-safe z-40">
          <div className="flex items-center justify-around p-1 pb-5 pt-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'list' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <ListTodo size={20} />
              <span className="text-[10px] font-semibold tracking-wide">List</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'categories' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <Tag size={20} />
              <span className="text-[10px] font-semibold tracking-wide">Categories</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teaser')}
              className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${activeTab === 'teaser' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
            >
              <Share2 size={20} />
              <span className="text-[10px] font-semibold tracking-wide">Pro</span>
            </button>
          </div>
        </nav>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">New Item</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500"
                  aria-label="Close add item dialog"
                >
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
                    <label htmlFor="new-item-category" className="block text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Category</label>
                    <select
                      id="new-item-category"
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

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">Edit Item</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500"
                  aria-label="Close edit item dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Organic Bananas"
                    value={editItemName}
                    onChange={e => setEditItemName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label htmlFor="edit-item-category" className="block text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Category</label>
                    <select
                      id="edit-item-category"
                      value={editItemCat}
                      onChange={e => setEditItemCat(e.target.value)}
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
                      <button type="button" onClick={() => setEditItemQty(Math.max(1, editItemQty - 1))} className="px-2.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-full">-</button>
                      <span className="flex-1 text-center text-sm font-semibold">{editItemQty}</span>
                      <button type="button" onClick={() => setEditItemQty(editItemQty + 1)} className="px-2.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-full">+</button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!editItemName.trim() || !editItemCat}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold py-3 rounded-lg mt-2 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  Update Item
                </button>
              </form>
            </div>
          </div>
        )}

        {isAddCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold">New Category</h3>
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500"
                  aria-label="Close add category dialog"
                >
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
                        aria-label={`Choose ${color} category color`}
                      >
                        {newCatColor === color && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
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

        {isDeleteConfirmOpen && deleteConfirmData && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Confirm Delete</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteConfirmData(null);
                  }}
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-500"
                  aria-label="Close delete confirmation dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                {deleteConfirmData.type === 'items' 
                  ? `Are you sure you want to delete ${deleteConfirmData.count} item${deleteConfirmData.count > 1 ? 's' : ''}? This action cannot be undone.`
                  : deleteConfirmData.type === 'categories'
                  ? `Are you sure you want to delete ${deleteConfirmData.count} categor${deleteConfirmData.count > 1 ? 'ies' : 'y'}? Items assigned to them will also be deleted.`
                  : deleteConfirmData.type === 'category'
                  ? `Are you sure you want to delete the category "${deleteConfirmData.name}"? Items assigned to it will also be deleted.`
                  : `Are you sure you want to delete "${deleteConfirmData.name}"? This action cannot be undone.`
                }
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteConfirmData(null);
                  }}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (deleteConfirmData.type === 'items') {
                      const ids = deleteConfirmData.ids || [];
                      setItems(prev => prev.filter(item => !ids.includes(item.id)));
                      await Promise.all(ids.map(id => client.models.ListItem.delete({ id })));
                    } else if (deleteConfirmData.type === 'categories') {
                      const ids = deleteConfirmData.ids || [];
                      setCategories(prev => prev.filter(category => !ids.includes(category.id)));
                      setItems(prev => prev.filter(item => !ids.includes(item.categoryId ?? '')));
                      if (selectedCategory && ids.includes(selectedCategory)) {
                        setSelectedCategory(null);
                      }
                      await Promise.all(ids.map(id => client.models.Category.delete({ id })));
                    } else if (deleteConfirmData.type === 'category') {
                      const categoryId = deleteConfirmData.ids?.[0];
                      if (categoryId) {
                        setCategories(prev => prev.filter(category => category.id !== categoryId));
                        setItems(prev => prev.filter(item => item.categoryId !== categoryId));
                        if (selectedCategory === categoryId) {
                          setSelectedCategory(null);
                        }
                        setSelectedCategoryIds(prev => {
                          const next = new Set(prev);
                          next.delete(categoryId);
                          return next;
                        });
                        await client.models.Category.delete({ id: categoryId });
                      }
                    } else {
                      const itemId = deleteConfirmData.ids?.[0];
                      if (itemId) {
                        setItems(prev => prev.filter(item => item.id !== itemId));
                        setSelectedItemIds(prev => {
                          const next = new Set(prev);
                          next.delete(itemId);
                          return next;
                        });
                        await client.models.ListItem.delete({ id: itemId });
                      }
                    }
                    if (deleteConfirmData.type === 'items') {
                      setSelectedItemIds(new Set());
                      setIsItemSelectionMode(false);
                    }
                    if (deleteConfirmData.type === 'categories') {
                      setSelectedCategoryIds(new Set());
                    }
                    setIsDeleteConfirmOpen(false);
                    setDeleteConfirmData(null);
                  }}
                  className="flex-1 bg-red-500 text-white text-sm font-semibold py-3 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

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

export default function App() {
  return (
    <ErrorBoundary>
      <AppImpl />
    </ErrorBoundary>
  );
}
