import { useState, useEffect, useMemo, useCallback, createContext, useRef } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ListItemCard } from './components/ListItemCard';
import { BottomInputBar } from './components/BottomInputBar';
import { ItemDetailPanel } from './components/ItemDetailPanel';
import { MyListsPanel } from './components/MyListsPanel';
import { ShareModal } from './components/ShareModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { BottomNav } from './components/BottomNav';
import { catDot, DEFAULT_CATEGORIES, type CatColorName } from './lib/categoryColors';

export type Category = Schema['Category']['type'];
export type ListItem = Schema['ListItem']['type'];
export type UserPreference = Schema['UserPreference']['type'];
export type ShoppingList = Schema['ShoppingList']['type'];

type Theme = 'light' | 'dark';
type SortMode = 'category' | 'custom';
type Tab = 'list' | 'categories' | 'pro';

const PREFERENCE_ID_STORAGE_KEY = 'airlist:preferenceId';
const USER_KEY_STORAGE_KEY = 'airlist:userKey';
const THEME_STORAGE_KEY = 'airlist:theme';
const SORT_MODE_STORAGE_KEY = 'airlist:sortMode';
const CURRENT_LIST_STORAGE_KEY = 'airlist:currentListId';
const COMPACT_MODE_STORAGE_KEY = 'airlist:compact';

const normalizeName = (value?: string | null) => value?.trim().toLowerCase() ?? '';

type ThemeContextType = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

function AppImpl() {
  const client = useMemo(() => generateClient<Schema>({ authMode: 'apiKey' }), []);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(CURRENT_LIST_STORAGE_KEY);
  });
  const currentListIdRef = useRef(currentListId);
  useEffect(() => {
    currentListIdRef.current = currentListId;
  }, [currentListId]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    const { data, errors } = await client.models.ListItem.update({ id, quantity });
    if (!errors && data) {
      setItems(prev => prev.map(i => i.id === id ? data : i));
    }
  };

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return 'light';
  });
  const isDark = theme === 'dark';
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const [sortMode, setSortMode] = useState<SortMode>(() => {
    if (typeof window === 'undefined') return 'category';
    const stored = window.localStorage.getItem(SORT_MODE_STORAGE_KEY) as SortMode | null;
    if (stored === 'category' || stored === 'custom') return stored;
    return 'category';
  });
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const handleSortModeChange = useCallback((mode: SortMode) => {
    setSortMode(mode);
    window.localStorage.setItem(SORT_MODE_STORAGE_KEY, mode);
  }, []);

  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const [showLists, setShowLists] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [deleteConfirm, setDeleteConfirm] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());

  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(COMPACT_MODE_STORAGE_KEY) === 'true';
  });

  const toggleCompact = useCallback(() => {
    setIsCompact(prev => {
      const next = !prev;
      window.localStorage.setItem(COMPACT_MODE_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

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
    if (typeof window === 'undefined') return;
    if (currentListId) {
      window.localStorage.setItem(CURRENT_LIST_STORAGE_KEY, currentListId);
    }
  }, [currentListId]);

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
    return () => { isMounted = false; };
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
    if (preference.theme !== theme) updates.theme = theme;
    if (preference.sortMode !== sortMode) updates.sortMode = sortMode;
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
    return () => { isCancelled = true; };
  }, [client, preference, theme, sortMode]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [{ data: allLists }, { data: cats }, { data: itms }] = await Promise.all([
          client.models.ShoppingList.list({}),
          client.models.Category.list({}),
          client.models.ListItem.list({}),
        ]);

        const validLists = allLists.filter(Boolean);
        const validCats = cats.filter(Boolean);
        const validItems = itms.filter(Boolean);

        if (isMounted) {
          setLists(validLists);

          let activeListId = currentListId;
          if (!activeListId && validLists.length > 0) {
            activeListId = validLists[0].id;
            setCurrentListId(activeListId);
          }

          if (validLists.length > 0) {
            const groceriesList = validLists.find(l => l.name === 'Groceries');
            if (groceriesList) {
              const listCats = validCats.filter(c => c.listId === groceriesList.id);
              if (listCats.length === 0) {
                for (const def of DEFAULT_CATEGORIES) {
                  await client.models.Category.create({
                    name: def.name,
                    color: def.color,
                    listId: groceriesList.id,
                  });
                }
              }
            }
          }

          const categoryByName = new Map<string, Category>();
          const duplicateCategories: Category[] = [];
          for (const category of validCats) {
            const normalized = normalizeName(category.name);
            if (!normalized) continue;
            const key = `${category.listId ?? ''}:${normalized}`;
            if (!categoryByName.has(key)) {
              categoryByName.set(key, category);
            } else {
              duplicateCategories.push(category);
            }
          }

          let mergedItems = [...validItems];
          for (const duplicate of duplicateCategories) {
            const key = `${duplicate.listId ?? ''}:${normalizeName(duplicate.name)}`;
            const primaryCategory = categoryByName.get(key);
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

          const nextCategories = Array.from(categoryByName.values()).sort((a, b) =>
            (a.name ?? '').localeCompare(b.name ?? '')
          );

          setCategories(nextCategories);
          setItems([...mergedItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    const listCreateSub = client.models.ShoppingList.onCreate().subscribe({
      next: (data) => {
        if (isMounted && data?.id) {
          setLists(prev => {
            if (prev.some(l => l.id === data.id)) return prev;
            return [...prev, data as ShoppingList];
          });
        }
      },
      error: (err) => console.error("ShoppingList create subscription error:", err),
    });

    const listUpdateSub = client.models.ShoppingList.onUpdate().subscribe({
      next: (data) => {
        if (isMounted) setLists(prev => prev.map(l => l.id === (data as ShoppingList).id ? data as ShoppingList : l));
      },
      error: (err) => console.error("ShoppingList update subscription error:", err),
    });

    const listDeleteSub = client.models.ShoppingList.onDelete().subscribe({
      next: (data) => {
        if (isMounted) {
          const deletedId = (data as ShoppingList).id;
          setLists(prev => prev.filter(l => l.id !== deletedId));
          if (currentListIdRef.current === deletedId) {
            setCurrentListId(() => {
              const remaining = lists.filter(l => l.id !== deletedId);
              return remaining.length > 0 ? remaining[0].id : null;
            });
          }
        }
      },
      error: (err) => console.error("ShoppingList delete subscription error:", err),
    });

    const categoryCreateSub = client.models.Category.onCreate().subscribe({
      next: (data) => {
        if (isMounted && data?.id) {
          const incoming = data as Category;
          const normalized = normalizeName(incoming.name);
          setCategories(prev => {
            if (prev.some(c => c.id === incoming.id)) return prev;
            // Only add if it's for the CURRENT list to avoid confusion, 
            // though keeping all categories in state is generally fine.
            const key = `${incoming.listId ?? ''}:${normalized}`;
            if (prev.some(c => `${c.listId ?? ''}:${normalizeName(c.name)}` === key)) return prev;
            return [...prev, incoming].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
          });
        }
      },
      error: (err) => console.error("Category create subscription error:", err),
    });

    const categoryUpdateSub = client.models.Category.onUpdate().subscribe({
      next: (data) => {
        if (isMounted) setCategories(prev => prev.map(c => c.id === (data as Category).id ? data as Category : c));
      },
      error: (err) => console.error("Category update subscription error:", err),
    });

    const categoryDeleteSub = client.models.Category.onDelete().subscribe({
      next: (data) => {
        if (isMounted) {
          const deletedId = (data as Category).id;
          setCategories(prev => prev.filter(c => c.id !== deletedId));
          setItems(prev => prev.filter(i => i.categoryId !== deletedId));
        }
      },
      error: (err) => console.error("Category delete subscription error:", err),
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
      error: (err) => console.error("ListItem create subscription error:", err),
    });

    const itemUpdateSub = client.models.ListItem.onUpdate().subscribe({
      next: (data) => {
        if (isMounted) setItems(prev => prev.map(i => i.id === (data as ListItem).id ? data as ListItem : i));
      },
      error: (err) => console.error("ListItem update subscription error:", err),
    });

    const itemDeleteSub = client.models.ListItem.onDelete().subscribe({
      next: (data) => {
        if (isMounted) setItems(prev => prev.filter(i => i.id !== (data as ListItem).id));
      },
      error: (err) => console.error("ListItem delete subscription error:", err),
    });

    fetchData();

    return () => {
      isMounted = false;
      listCreateSub.unsubscribe();
      listUpdateSub.unsubscribe();
      listDeleteSub.unsubscribe();
      categoryCreateSub.unsubscribe();
      categoryUpdateSub.unsubscribe();
      categoryDeleteSub.unsubscribe();
      itemCreateSub.unsubscribe();
      itemUpdateSub.unsubscribe();
      itemDeleteSub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const listCategories = useMemo(
    () => categories.filter(c => c.listId === currentListId),
    [categories, currentListId],
  );

  const listItems = useMemo(
    () => items.filter(i => i.listId === currentListId),
    [items, currentListId],
  );

  const categoryOrder = useMemo(() => {
    const order = new Map<string, number>();
    listCategories.forEach((category, index) => {
      if (category.id) order.set(category.id, index);
    });
    return order;
  }, [listCategories]);

  const filteredItems = useMemo(() => {
    let result = listItems;
    if (selectedCategory) {
      result = result.filter(i => i.categoryId === selectedCategory);
    }

    return [...result].sort((a, b) => {
      const aPriority = a.priority ? 0 : 1;
      const bPriority = b.priority ? 0 : 1;
      if (aPriority !== bPriority) return aPriority - bPriority;

      if (sortMode === 'custom') {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }

      const orderA = a.categoryId ? categoryOrder.get(a.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const orderB = b.categoryId ? categoryOrder.get(b.categoryId) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;

      return (a.name ?? '').localeCompare(b.name ?? '', undefined, { sensitivity: 'base' });
    });
  }, [listItems, selectedCategory, sortMode, categoryOrder]);

  const doneCount = useMemo(() => listItems.filter(i => i.isCompleted).length, [listItems]);
  const totalCount = listItems.length;

  const currentListName = useMemo(() => {
    const list = lists.find(l => l.id === currentListId);
    return list?.name ?? 'Shopping List';
  }, [lists, currentListId]);

  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of listItems) {
      if (item.categoryId) {
        counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [listItems]);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isCompleted: !currentStatus } : i));
    await client.models.ListItem.update({ id, isCompleted: !currentStatus });
  };

  const togglePriority = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newPriority = !item.priority;
    setItems(prev => prev.map(i => i.id === id ? { ...i, priority: newPriority } : i));
    await client.models.ListItem.update({ id, priority: newPriority });
  };

  const updateItem = async (id: string, updates: Partial<ListItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    await client.models.ListItem.update({ id, ...updates });
  };

  const handleAddItem = async (name: string, listId: string, categoryId: string | null) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Use explicit categoryId if provided, otherwise check listCategories. 
    // If no categories exist, catId will be null/undefined which is fine for the schema.
    const catId = categoryId ?? (listCategories.length > 0 ? listCategories[0].id : null);

    const normalizedName = trimmed.toLowerCase();
    const itemExists = listItems.some(
      item => item.name?.toLowerCase() === normalizedName && item.categoryId === catId,
    );
    if (itemExists) return;

    const payload = {
      name: trimmed,
      categoryId: catId ?? undefined,
      listId,
      quantity: 1,
      isCompleted: false,
      sortOrder: listItems.length,
      priority: false,
    };

    try {
      const { data, errors } = await client.models.ListItem.create(payload);
      if (errors) {
        console.error("Failed to create item:", errors);
        return;
      }
      if (data) {
        setItems(prev => {
          if (prev.some(i => i.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  const handleAddCategory = async (name: string, color: CatColorName, listId?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const targetListId = listId ?? currentListId;
    if (!targetListId) return;

    // Check if category exists IN THE TARGET LIST
    const normalizedInput = normalizeName(trimmed);
    const categoryExists = categories.some(
      cat => cat.listId === targetListId && normalizeName(cat.name) === normalizedInput
    );
    if (categoryExists) return;

    try {
      const { data, errors } = await client.models.Category.create({
        name: trimmed,
        color,
        listId: targetListId,
      });
      if (errors) {
        console.error("Failed to create category:", errors);
        return;
      }
      if (data) {
        setCategories(prev => {
          if (prev.some(c => c.id === data.id)) return prev;
          return [...prev, data].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        });
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleAddList = async (name: string) => {
    const userKey = getOrCreateUserKey();
    try {
      const { data, errors } = await client.models.ShoppingList.create({
        name,
        userKey,
        sortOrder: lists.length,
      });
      if (errors) {
        console.error("Failed to create list:", errors);
        return;
      }
      if (data) {
        setLists(prev => {
          if (prev.some(l => l.id === data.id)) return prev;
          return [...prev, data];
        });
        setCurrentListId(data.id);
      }
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  const handleDeleteList = (id: string) => {
    const list = lists.find(l => l.id === id);
    const listName = list?.name ?? 'this list';
    setDeleteConfirm({
      message: `Are you sure you want to delete "${listName}"? All items and categories in this list will also be deleted.`,
      onConfirm: async () => {
        // Delete items in this list first
        const listItemsToDelete = items.filter(i => i.listId === id);
        for (const item of listItemsToDelete) {
          await client.models.ListItem.delete({ id: item.id });
        }
        // Delete categories in this list
        const listCatsToDelete = categories.filter(c => c.listId === id);
        for (const cat of listCatsToDelete) {
          await client.models.Category.delete({ id: cat.id });
        }
        // Delete the list itself
        const { errors } = await client.models.ShoppingList.delete({ id });
        if (!errors) {
          setLists(prev => {
            const next = prev.filter(l => l.id !== id);
            if (currentListId === id) {
              setCurrentListId(next.length > 0 ? next[0].id : null);
            }
            return next;
          });
          setItems(prev => prev.filter(i => i.listId !== id));
          setCategories(prev => prev.filter(c => c.listId !== id));
        }
        setDeleteConfirm(null);
      },
    });
  };

  const handleUpdateListName = async (id: string, name: string) => {
    const { data, errors } = await client.models.ShoppingList.update({ id, name });
    if (!errors && data) {
      setLists(prev => prev.map(l => l.id === id ? data : l));
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    const itemName = item?.name ?? 'this item';
    setDeleteConfirm({
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setItems(prev => prev.filter(i => i.id !== id));
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
        await client.models.ListItem.delete({ id });
        setDeleteConfirm(null);
      },
    });
  };

  const handleDeleteSelectedItems = () => {
    if (selectedIds.size === 0) return;
    setDeleteConfirm({
      message: `Are you sure you want to delete ${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.`,
      onConfirm: async () => {
        const ids = Array.from(selectedIds);
        setItems(prev => prev.filter(i => !ids.includes(i.id)));
        setSelectedIds(new Set());
        setSelectionMode(false);
        await Promise.all(ids.map(id => client.models.ListItem.delete({ id })));
        setDeleteConfirm(null);
      },
    });
  };

  const handleUpdateCategoryName = async (id: string, name: string) => {
    const { data, errors } = await client.models.Category.update({ id, name });
    if (!errors && data) {
      setCategories(prev => prev.map(c => c.id === id ? data : c));
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    const catName = cat?.name ?? 'this category';
    setDeleteConfirm({
      message: `Are you sure you want to delete "${catName}"? Items assigned to it will also be deleted.`,
      onConfirm: async () => {
        setCategories(prev => prev.filter(c => c.id !== id));
        setItems(prev => prev.filter(i => i.categoryId !== id));
        if (selectedCategory === id) setSelectedCategory(null);
        setSelectedCategoryIds(prev => { const next = new Set(prev); next.delete(id); return next; });
        await client.models.Category.delete({ id });
        setDeleteConfirm(null);
      },
    });
  };

  const handleDeleteSelectedCategories = () => {
    if (selectedCategoryIds.size === 0) return;
    setDeleteConfirm({
      message: `Are you sure you want to delete ${selectedCategoryIds.size} categor${selectedCategoryIds.size > 1 ? 'ies' : 'y'}? Items assigned to them will also be deleted.`,
      onConfirm: async () => {
        const ids = Array.from(selectedCategoryIds);
        setCategories(prev => prev.filter(c => !ids.includes(c.id)));
        setItems(prev => prev.filter(i => !ids.includes(i.categoryId ?? '')));
        if (selectedCategory && ids.includes(selectedCategory)) setSelectedCategory(null);
        setSelectedCategoryIds(new Set());
        await Promise.all(ids.map(id => client.models.Category.delete({ id })));
        setDeleteConfirm(null);
      },
    });
  };

  const toggleCategorySelection = (id: string) => {
    setSelectedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      handleReorder(active.id as string, over?.id as string);
    }

    setActiveId(null);
  };

  const handleReorder = async (sourceId: string, targetId: string) => {
    if (sortMode !== 'custom') {
      setSortMode('custom');
      window.localStorage.setItem(SORT_MODE_STORAGE_KEY, 'custom');
    }

    const sourceIndex = filteredItems.findIndex(i => i.id === sourceId);
    const targetIndex = filteredItems.findIndex(i => i.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    // Create a new order based on filteredItems (the visual list)
    const newFilteredOrder = arrayMove(filteredItems, sourceIndex, targetIndex);
    const updatedItems = newFilteredOrder.map((item, index) => ({ ...item, sortOrder: index }));

    setItems(prev => {
      // Find items NOT in the filtered list (from other lists or filtered out)
      const filteredIds = new Set(filteredItems.map(i => i.id));
      const otherItems = prev.filter(i => !filteredIds.has(i.id));
      return [...otherItems, ...updatedItems];
    });

    await Promise.all(
      updatedItems.map(item => client.models.ListItem.update({ id: item.id, sortOrder: item.sortOrder }))
    );
  };
  const handleToggleSubtask = async (itemId: string, subtaskId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const subtasks: { id: string; name: string; done: boolean }[] = Array.isArray(item.subtasks) ? item.subtasks : [];
    const updated = subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s);
    await updateItem(itemId, { subtasks: updated });
  };

  const handleAddSubtask = async (itemId: string, name: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const subtasks: { id: string; name: string; done: boolean }[] = Array.isArray(item.subtasks) ? item.subtasks : [];
    const updated = [...subtasks, { id: Math.random().toString(36).slice(2, 11), name, done: false }];
    await updateItem(itemId, { subtasks: updated });
  };

  const handleDeleteSubtask = async (itemId: string, subtaskId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    const subtasks: { id: string; name: string; done: boolean }[] = Array.isArray(item.subtasks) ? item.subtasks : [];
    const updated = subtasks.filter(s => s.id !== subtaskId);
    await updateItem(itemId, { subtasks: updated });
  };

  const detailItem = useMemo(() => {
    if (!detailItemId) return null;
    return items.find(i => i.id === detailItemId) ?? null;
  }, [detailItemId, items]);

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div
        style={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: 'var(--font)',
        }}
      >
        <Header
          isDark={isDark}
          selectionMode={selectionMode}
          isCompact={isCompact}
          listName={currentListName}
          onToggleTheme={toggleTheme}
          onOpenLists={() => setShowLists(prev => !prev)}
          onOpenShare={() => setShowShare(true)}
          onToggleSelectionMode={() => {
            setSelectionMode(prev => !prev);
            if (selectionMode) setSelectedIds(new Set());
          }}
          onToggleCompact={toggleCompact}
        />

        <ProgressBar 
          doneCount={doneCount} 
          totalCount={totalCount} 
          listName={currentListName} 
          isCompact={isCompact} 
        />

        {activeTab === 'list' && (
          <div style={{ marginBottom: 12 }}>
            <CategoryFilterBar
              categories={listCategories.map(c => ({ id: c.id, name: c.name ?? '', color: c.color ?? 'gray' }))}
              selectedCat={selectedCategory}
              sortMode={sortMode}
              isDark={isDark}
              onSelectCat={setSelectedCategory}
              onToggleSort={() => handleSortModeChange(sortMode === 'category' ? 'custom' : 'category')}
              itemCounts={itemCounts}
              allItemCount={listItems.length}
            />
          </div>
        )}

        <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }} className="custom-scrollbar">
          {activeTab === 'list' && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <div style={{ padding: '0 14px', paddingBottom: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectionMode && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg)',
                    zIndex: 10,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
                      {selectedIds.size} selected
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          const allIds = filteredItems.map(i => i.id);
                          const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id));
                          if (allSelected) {
                            setSelectedIds(new Set());
                          } else {
                            setSelectedIds(new Set(allIds));
                          }
                        }}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-2)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text)',
                        }}
                      >
                        {filteredItems.length > 0 && selectedIds.size >= filteredItems.length ? 'Deselect All' : 'Select All'}
                      </button>
                      <button
                        onClick={handleDeleteSelectedItems}
                        disabled={selectedIds.size === 0}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--danger)',
                          border: 'none',
                          cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
                          color: '#fff',
                          opacity: selectedIds.size === 0 ? 0.5 : 1,
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => { setSelectionMode(false); setSelectedIds(new Set()); }}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '6px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-2)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text)',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {filteredItems.length === 0 && !selectionMode && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 160,
                    opacity: 0.4,
                    textAlign: 'center',
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <p style={{ fontSize: 15, fontWeight: 500, marginTop: 12 }}>List is empty</p>
                  </div>
                )}

                <SortableContext
                  items={filteredItems.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredItems.map(item => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    const subtasks: { id: string; name: string; done: boolean }[] = Array.isArray(item.subtasks) ? item.subtasks : [];
                    return (
                      <ListItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name ?? ''}
                        isCompleted={item.isCompleted ?? false}
                        priority={item.priority ?? false}
                        quantity={item.quantity ?? 1}
                        categoryName={cat?.name ?? ''}
                        categoryColor={cat?.color ?? 'gray'}
                        subtasks={subtasks}
                        isDark={isDark}
                        selectionMode={selectionMode}
                        isSelected={selectedIds.has(item.id)}
                        onToggleComplete={(id) => toggleItem(id, item.isCompleted ?? false)}
                        onTogglePriority={togglePriority}
                        onDelete={handleDeleteItem}
                        onViewDetail={(id) => setDetailItemId(prev => prev === id ? null : id)}
                        onUpdateQuantity={handleUpdateQuantity}
                        onToggleSelect={(id) => {
                          setSelectedIds(prev => {                            const next = new Set(prev);
                            if (next.has(id)) next.delete(id); else next.add(id);
                            return next;
                          });
                        }}
                      />
                    );
                  })}
                </SortableContext>
              </div>

              <DragOverlay dropAnimation={null}>
                {activeId ? (() => {
                  const item = filteredItems.find(i => i.id === activeId);
                  if (!item) return null;
                  const cat = categories.find(c => c.id === item.categoryId);
                  const subtasks: { id: string; name: string; done: boolean }[] = Array.isArray(item.subtasks) ? item.subtasks : [];
                  return (
                    <ListItemCard
                      id={item.id}
                      name={item.name ?? ''}
                      isCompleted={item.isCompleted ?? false}
                      priority={item.priority ?? false}
                      quantity={item.quantity ?? 1}
                      categoryName={cat?.name ?? ''}
                      categoryColor={cat?.color ?? 'gray'}
                      subtasks={subtasks}
                      isDark={isDark}
                      selectionMode={selectionMode}
                      isSelected={selectedIds.has(item.id)}
                      onToggleComplete={() => {}}
                      onTogglePriority={() => {}}
                      onDelete={() => {}}
                      onViewDetail={() => {}}
                      onUpdateQuantity={() => {}}
                      onToggleSelect={() => {}}
                      isOverlay
                      />                  );
                })() : null}
              </DragOverlay>
            </DndContext>
          )}

          {activeTab === 'categories' && (
            <div style={{ padding: '20px 14px', paddingBottom: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Categories</h2>
                  {selectedCategoryIds.size > 0 && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'var(--surface-2)',
                    }}>
                      {selectedCategoryIds.size}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedCategoryIds.size > 0 && (
                    <button
                      onClick={handleDeleteSelectedCategories}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--danger)',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (selectedCategoryIds.size > 0) {
                        setSelectedCategoryIds(new Set());
                      } else {
                        setSelectedCategoryIds(new Set(listCategories.map(c => c.id)));
                      }
                    }}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text)',
                    }}
                  >
                    {selectedCategoryIds.size > 0 ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={() => setShowAddCat(true)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {listCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategorySelection(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      border: `1px solid ${selectedCategoryIds.has(cat.id) ? 'var(--text-2)' : 'var(--border)'}`,
                      borderRadius: 'var(--r-md)',
                      cursor: 'pointer',
                      background: selectedCategoryIds.has(cat.id) ? 'var(--surface-2)' : 'var(--surface)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: `2px solid ${selectedCategoryIds.has(cat.id) ? 'var(--text)' : 'var(--border)'}`,
                        background: selectedCategoryIds.has(cat.id) ? 'var(--text)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {selectedCategoryIds.has(cat.id) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: catDot(cat.color ?? 'gray'),
                      }} />
                      <input
                        type="text"
                        defaultValue={cat.name ?? ''}
                        onBlur={(e) => {
                          const newName = e.target.value.trim();
                          if (newName && newName !== cat.name) {
                            handleUpdateCategoryName(cat.id, newName);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--text)',
                          padding: '2px 4px',
                          borderRadius: 4,
                          width: '100%',
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                      style={{
                        padding: 6,
                        color: 'oklch(52% 0.22 25)',
                        background: 'var(--surface-2)',
                        border: 'none',
                        borderRadius: 'var(--r-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label={`Delete ${cat.name} category`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pro' && (
            <div style={{ padding: '40px 14px', textAlign: 'center', opacity: 0.5 }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Pro features coming soon</p>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>Shared lists, smart suggestions, and more.</p>
            </div>
          )}
        </main>

        {activeTab === 'list' && currentListId && (
          <BottomInputBar
            lists={lists.map(l => ({ id: l.id, name: l.name ?? '' }))}
            currentListId={currentListId}
            allCategories={categories.map(c => ({ id: c.id, name: c.name ?? '', color: c.color ?? 'gray', listId: c.listId }))}
            isDark={isDark}
            onAddItem={handleAddItem}
            onAddCategory={handleAddCategory}
            selectionMode={selectionMode}
          />
        )}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {showLists && (
          < MyListsPanel
            lists={lists.map(l => ({
              id: l.id,
              name: l.name ?? '',
              itemCount: items.filter(i => i.listId === l.id).length,
            }))}
            currentListId={currentListId ?? ''}
            onSelectList={(id) => { setCurrentListId(id); setShowLists(false); setSelectedCategory(null); }}
            onClose={() => setShowLists(false)}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
            onUpdateListName={handleUpdateListName}
            isDark={isDark}
          />
        )}

        {showShare && (
          <ShareModal
            listName={currentListName}
            onClose={() => setShowShare(false)}
          />
        )}

        {showAddCat && (
          <AddCategoryModal
            isDark={isDark}
            onAdd={handleAddCategory}
            onClose={() => setShowAddCat(false)}
          />
        )}

        {deleteConfirm && (
          <ConfirmModal
            message={deleteConfirm.message}
            onConfirm={deleteConfirm.onConfirm}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}

        {detailItem && (
          <ItemDetailPanel
            item={{
              id: detailItem.id,
              name: detailItem.name ?? '',
              isCompleted: detailItem.isCompleted ?? false,
              priority: detailItem.priority ?? false,
              quantity: detailItem.quantity ?? 1,
              notes: detailItem.notes ?? '',
              subtasks: Array.isArray(detailItem.subtasks) ? detailItem.subtasks : [],
              attachments: Array.isArray(detailItem.attachments) ? detailItem.attachments : [],
              categoryId: detailItem.categoryId ?? null,
            }}
            categories={listCategories.map(c => ({ id: c.id, name: c.name ?? '', color: c.color ?? 'gray' }))}
            listName={currentListName}
            isDark={isDark}
            onClose={() => setDetailItemId(null)}
            onUpdateName={(id, name) => updateItem(id, { name })}
            onUpdateNotes={(id, notes) => updateItem(id, { notes })}
            onToggleComplete={(id) => {
              const item = items.find(i => i.id === id);
              if (item) toggleItem(id, item.isCompleted ?? false);
            }}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onUpdateCategory={(itemId, categoryId) => updateItem(itemId, { categoryId })}
            onUpdateQuantity={handleUpdateQuantity}
            onDelete={(id) => { setDetailItemId(null); handleDeleteItem(id); }}
          />
        )}
      </div>
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