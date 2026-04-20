// Main App — per-list categories, floating input, list-aware add

const { useState, useEffect, useMemo } = React;

const GROCERY_CATEGORIES = [
  { id: 'c1', name: 'Produce',  color: 'green'  },
  { id: 'c2', name: 'Meat',     color: 'red'    },
  { id: 'c3', name: 'Dairy',    color: 'blue'   },
  { id: 'c4', name: 'Pantry',   color: 'orange' },
  { id: 'c5', name: 'General',  color: 'gray'   },
];
const DEFAULT_NAMES = new Set(['produce','meat','dairy','pantry','general']);

const INIT_LISTS = [
  { id: 'l1', name: 'Groceries'      },
  { id: 'l2', name: 'Hardware Store' },
  { id: 'l3', name: 'Pharmacy'       },
];
// Only Groceries gets the food categories; others start empty
const INIT_CATEGORIES = {
  l1: GROCERY_CATEGORIES,
  l2: [],
  l3: [],
};
const INIT_ITEMS = {
  l1: [
    { id: 'i1',  name: 'Whole Milk',           categoryId: 'c3', qty: 2,  done: false },
    { id: 'i2',  name: 'Sourdough Bread',       categoryId: 'c5', qty: 1,  done: true  },
    { id: 'i3',  name: 'Organic Bananas',       categoryId: 'c1', qty: 6,  done: false },
    { id: 'i4',  name: 'Free Range Eggs',       categoryId: 'c3', qty: 12, done: false },
    { id: 'i5',  name: 'Chicken Thighs',        categoryId: 'c2', qty: 1,  done: true  },
    { id: 'i6',  name: 'Extra Virgin Olive Oil',categoryId: 'c4', qty: 1,  done: false },
    { id: 'i7',  name: 'Spinach',               categoryId: 'c1', qty: 1,  done: false },
    { id: 'i8',  name: 'Greek Yogurt',          categoryId: 'c3', qty: 3,  done: false },
    { id: 'i9',  name: 'Cherry Tomatoes',       categoryId: 'c1', qty: 2,  done: false },
    { id: 'i10', name: 'Pasta',                 categoryId: 'c4', qty: 2,  done: true  },
  ],
  l2: [
    { id: 'i11', name: 'Sandpaper 120 grit', categoryId: null, qty: 4, done: false },
    { id: 'i12', name: 'Wood screws',         categoryId: null, qty: 1, done: false },
    { id: 'i13', name: 'Paint roller',        categoryId: null, qty: 2, done: true  },
  ],
  l3: [
    { id: 'i14', name: 'Vitamin D3', categoryId: null, qty: 1, done: false },
    { id: 'i15', name: 'Bandages',   categoryId: null, qty: 2, done: true  },
    { id: 'i16', name: 'Ibuprofen',  categoryId: null, qty: 1, done: false },
  ],
};

const uid = () => Math.random().toString(36).slice(2, 10);

const NavIcons = {
  list: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  categories: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  pro: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('airlist:theme') === 'dark');
  const [lists, setLists] = useState(INIT_LISTS);
  const [currentListId, setCurrentListId] = useState(() => localStorage.getItem('airlist:listId') || 'l1');
  const [itemsByList, setItemsByList] = useState(INIT_ITEMS);
  const [categoriesByList, setCategoriesByList] = useState(INIT_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState(null);
  const [sortMode, setSortMode] = useState('category');
  const [tab, setTab] = useState('list');

  const [showLists, setShowLists]     = useState(false);
  const [showShare, setShowShare]     = useState(false);
  const [itemModal, setItemModal]     = useState(null);
  const [confirm, setConfirm]         = useState(null);
  const [showAddCat, setShowAddCat]   = useState(false);
  const [selectionMode, setSelMode]   = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selCatIds, setSelCatIds]     = useState(new Set());
  const [detailItem, setDetailItem]   = useState(null);
  const [draggedId, setDraggedId]     = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('airlist:theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => { localStorage.setItem('airlist:listId', currentListId); }, [currentListId]);

  const curItems      = itemsByList[currentListId] || [];
  const curCategories = categoriesByList[currentListId] || [];
  const curList       = lists.find(l => l.id === currentListId);
  const doneCount     = curItems.filter(i => i.done).length;
  const totalCount    = curItems.length;

  const catCounts = useMemo(() => {
    const m = { all: curItems.length };
    curItems.forEach(i => { if (i.categoryId) m[i.categoryId] = (m[i.categoryId] || 0) + 1; });
    return m;
  }, [curItems]);

  const filteredItems = useMemo(() => {
    let items = selectedCat ? curItems.filter(i => i.categoryId === selectedCat) : [...curItems];
    items.sort((a, b) => {
      // Priority first
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      if (sortMode === 'category') {
        const order = new Map(curCategories.map((c, i) => [c.id, i]));
        const d = (order.get(a.categoryId) ?? 99) - (order.get(b.categoryId) ?? 99);
        if (d !== 0) return d;
      }
      return (a.name || '').localeCompare(b.name || '');
    });
    return items;
  }, [curItems, selectedCat, sortMode, curCategories]);

  const listsWithCounts = useMemo(() =>
    lists.map(l => ({ ...l, itemCount: (itemsByList[l.id] || []).length })),
  [lists, itemsByList]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const mutateCur = fn =>
    setItemsByList(p => ({ ...p, [currentListId]: fn(p[currentListId] || []) }));

  const toggleItem = id =>
    mutateCur(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i));

  const togglePriority = id =>
    mutateCur(items => items.map(i => i.id === id ? { ...i, priority: !i.priority } : i));

  const toggleSelect = id =>
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const deleteSelected = () => {
    if (!selectedIds.size) return;
    setConfirm({
      message: `Delete ${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''}?`,
      onConfirm: () => {
        mutateCur(items => items.filter(i => !selectedIds.has(i.id)));
        setSelectedIds(new Set()); setSelMode(false); setConfirm(null);
      },
    });
  };

  const toggleCatSelect = id =>
    setSelCatIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const deleteSelectedCats = () => {
    if (!selCatIds.size) return;
    const names = new Set(['produce','meat','dairy','pantry','general']);
    const deletable = [...selCatIds].filter(id => !names.has(curCategories.find(c=>c.id===id)?.name?.toLowerCase()));
    if (!deletable.length) return;
    setConfirm({
      message: `Delete ${deletable.length} categor${deletable.length > 1 ? 'ies' : 'y'}?`,
      onConfirm: () => {
        setCategoriesByList(p => ({ ...p, [currentListId]: (p[currentListId]||[]).filter(c => !deletable.includes(c.id)) }));
        mutateCur(items => items.map(i => deletable.includes(i.categoryId) ? { ...i, categoryId: null } : i));
        setSelCatIds(new Set()); setConfirm(null);
      },
    });
  };

  // addItem supports cross-list adds via listId
  const addItem = ({ name, categoryId, qty, listId }) => {
    const targetId = listId || currentListId;
    const newItem = { id: uid(), name, categoryId: categoryId || null, qty: qty || 1, done: false };
    setItemsByList(p => ({ ...p, [targetId]: [...(p[targetId] || []), newItem] }));
  };

  const saveItem = (updated) => {
    if (updated.id) {
      mutateCur(items => items.map(i => i.id === updated.id ? { ...i, ...updated } : i));
      setDetailItem(prev => prev?.id === updated.id ? { ...prev, ...updated } : prev);
    } else {
      addItem(updated);
    }
  };

  const handleReorder = (sourceId, targetId) => {
    if (sortMode !== 'custom') setSortMode('custom');
    setItemsByList(p => {
      const items = [...(p[currentListId] || [])];
      const si = items.findIndex(i => i.id === sourceId);
      const ti = items.findIndex(i => i.id === targetId);
      if (si === -1 || ti === -1) return p;
      const [moved] = items.splice(si, 1);
      items.splice(ti, 0, moved);
      return { ...p, [currentListId]: items };
    });
  };

  const deleteItem = id => {
    const item = curItems.find(i => i.id === id);
    setConfirm({
      message: `Delete "${item?.name}"?`,
      onConfirm: () => { mutateCur(items => items.filter(i => i.id !== id)); setConfirm(null); },
    });
  };

  const clearDone = () => {
    if (!doneCount) return;
    setConfirm({
      message: `Clear all ${doneCount} checked item${doneCount > 1 ? 's' : ''}?`,
      onConfirm: () => { mutateCur(items => items.filter(i => !i.done)); setConfirm(null); },
    });
  };

  // Add category — supports cross-list via listId
  const addCategory = ({ name, color, listId }) => {
    const targetId = listId || currentListId;
    setCategoriesByList(p => ({
      ...p,
      [targetId]: [...(p[targetId] || []), { id: uid(), name, color }],
    }));
  };

  // New list: empty categories
  const addList = name => {
    const id = uid();
    setLists(p => [...p, { id, name }]);
    setItemsByList(p => ({ ...p, [id]: [] }));
    setCategoriesByList(p => ({ ...p, [id]: [] }));
    setCurrentListId(id);
  };

  const deleteCategory = id => {
    const cat = curCategories.find(c => c.id === id);
    if (DEFAULT_NAMES.has(cat?.name?.toLowerCase())) return;
    setConfirm({
      message: `Delete "${cat?.name}"? Items will become uncategorized.`,
      onConfirm: () => {
        setCategoriesByList(p => ({
          ...p,
          [currentListId]: (p[currentListId] || []).filter(c => c.id !== id),
        }));
        mutateCur(items => items.map(i => i.categoryId === id ? { ...i, categoryId: null } : i));
        setConfirm(null);
      },
    });
  };

  const NAV_H  = 64;
  // bottom of scroll area: nav + floating input (~120px) + breathing room
  const SCROLL_BOTTOM = NAV_H + 130;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Selection bar ────────────────────────────────────────────────── */}
      {selectionMode && tab === 'list' && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:'var(--accent-bg)', borderBottom:'1px solid var(--border)', flexShrink:0, zIndex:31 }}>
          <span style={{ flex:1, fontSize:13, fontWeight:600, color:'var(--accent-fg)' }}>{selectedIds.size} selected</span>
          <button onClick={() => setSelectedIds(new Set(filteredItems.map(i=>i.id)))} style={{ fontSize:12, fontWeight:600, padding:'5px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', cursor:'pointer', color:'var(--text)', fontFamily:'var(--font)' }}>All</button>
          <button onClick={deleteSelected} disabled={!selectedIds.size} style={{ fontSize:12, fontWeight:700, padding:'5px 10px', background:'oklch(52% 0.22 25)', color:'white', border:'none', borderRadius:'var(--r-sm)', cursor:'pointer', fontFamily:'var(--font)', opacity:selectedIds.size?1:0.4 }}>Delete</button>
          <button onClick={() => { setSelMode(false); setSelectedIds(new Set()); }} style={{ fontSize:12, fontWeight:600, padding:'5px 10px', background:'var(--surface-2)', border:'none', borderRadius:'var(--r-sm)', cursor:'pointer', color:'var(--text)', fontFamily:'var(--font)' }}>Cancel</button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        flexShrink: 0, zIndex: 30,
      }}>
        <button onClick={() => setShowLists(true)} aria-label="My Lists" style={hdrBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="2.5" y1="5"  x2="15.5" y2="5"/>
            <line x1="2.5" y1="9"  x2="15.5" y2="9"/>
            <line x1="2.5" y1="13" x2="10"   y2="13"/>
          </svg>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {curList?.name || 'AirList'}
          </div>
          {totalCount > 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{doneCount} of {totalCount} done</div>
          )}
        </div>

        {tab === 'list' && (
          <button onClick={() => { setSelMode(s => !s); setSelectedIds(new Set()); }} aria-label="Select items" style={{ ...hdrBtn, background: selectionMode ? 'var(--accent-bg)' : 'var(--surface-2)', color: selectionMode ? 'var(--accent-fg)' : 'var(--text-2)' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="2" y="2" width="4.5" height="4.5" rx="1"/><rect x="8.5" y="2" width="4.5" height="4.5" rx="1"/>
              <rect x="2" y="8.5" width="4.5" height="4.5" rx="1"/><rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1"/>
            </svg>
          </button>
        )}
        <button onClick={() => setShowShare(true)} aria-label="Share" style={hdrBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
          </svg>
        </button>

        <button onClick={() => setIsDark(d => !d)} aria-label="Toggle theme" style={hdrBtn}>
          {isDark
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      {tab === 'list' && totalCount > 0 && <ProgressBar done={doneCount} total={totalCount} />}

      {/* ── Category filter ──────────────────────────────────────────────── */}
      {tab === 'list' && curCategories.length > 0 && (
        <CategoryFilterBar
          categories={curCategories}
          selected={selectedCat}
          onSelect={setSelectedCat}
          sortMode={sortMode}
          onSortChange={setSortMode}
          isDark={isDark}
          counts={catCounts}
        />
      )}

      {/* ── Main scroll area ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 0', paddingBottom: SCROLL_BOTTOM }}>

        {/* LIST TAB */}
        {tab === 'list' && (
          <div>
            {doneCount > 0 && (
              <button onClick={clearDone} style={{
                width: '100%', padding: '7px 10px', marginBottom: 10,
                background: 'transparent', border: '1px dashed var(--border)',
                borderRadius: 'var(--r-sm)', color: 'var(--text-2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
                Clear {doneCount} checked item{doneCount > 1 ? 's' : ''}
              </button>
            )}
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)', opacity: 0.5 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p style={{ fontSize: 14, fontWeight: 500 }}>List is empty</p>
                <p style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>Type below to add your first item</p>
              </div>
            ) : filteredItems.map(item => (
              <ListItemCard key={item.id} item={item}
                category={curCategories.find(c => c.id === item.categoryId)}
                onToggle={toggleItem}
                onDelete={deleteItem}
                onPriorityToggle={togglePriority}
                onOpenDetail={setDetailItem}
                isSelectionMode={selectionMode}
                isSelected={selectedIds.has(item.id)}
                onSelectToggle={toggleSelect}
                isDark={isDark}
                draggedId={draggedId}
                setDraggedId={setDraggedId}
                onReorder={handleReorder}
              />
            ))}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === 'categories' && (
          <div style={{ paddingTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Categories</h2>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>For "{curList?.name}"</p>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {selCatIds.size > 0 && (
                  <button onClick={deleteSelectedCats} style={{ padding:'7px 14px', background:'oklch(52% 0.22 25)', color:'white', border:'none', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font)' }}>Delete {selCatIds.size}</button>
                )}
              <button onClick={() => setShowAddCat(true)} style={{
                padding: '7px 14px', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text)',
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
                Add
              </button>
              </div>
            </div>

            {curCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-2)', opacity: 0.5 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>No categories yet</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>This list has no categories. Add one above.</p>
              </div>
            ) : curCategories.map(cat => {
              const cs = getCat(cat.color, isDark);
              const count = curItems.filter(i => i.categoryId === cat.id).length;
              const isDefault = DEFAULT_NAMES.has(cat.name?.toLowerCase());
              return (
                <div key={cat.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', marginBottom: 6,
                }}>
                  <button onClick={() => !isDefault && toggleCatSelect(cat.id)} style={{ width:18, height:18, borderRadius:'var(--r-xs)', border: selCatIds.has(cat.id)?'none':'1.5px solid var(--border)', background: selCatIds.has(cat.id)?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor: isDefault?'default':'pointer', flexShrink:0 }}>
                    {selCatIds.has(cat.id) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M1 3.5l2.5 2.5L8 1"/></svg>}
                  </button>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cs.dot, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{count} item{count !== 1 ? 's' : ''}</span>
                  {isDefault
                    ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default</span>
                    : <button onClick={() => deleteCategory(cat.id)} style={{ width: 26, height: 26, borderRadius: 'var(--r-xs)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                      </button>
                  }
                </div>
              );
            })}
          </div>
        )}

        {/* PRO TAB */}
        {tab === 'pro' && (
          <div style={{ paddingTop: 4 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Pro Features</h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.6 }}>Future features powered by AWS Amplify.</p>
            {[
              { e: '💬', t: 'Share to WhatsApp',    s: 'Send your list directly to chats'      },
              { e: '📄', t: 'Export as PDF',         s: 'Download a clean printable version'    },
              { e: '🔔', t: 'Smart Reminders',       s: 'Location-aware shopping alerts'        },
              { e: '🤝', t: 'Shared Lists',          s: 'Collaborate with family or housemates' },
            ].map(f => (
              <div key={f.t} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', marginBottom: 8,
              }}>
                <span style={{ fontSize: 22 }}>{f.e}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.s}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--r-full)', background: 'var(--surface-2)', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Soon</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Floating bottom input (list tab only) ────────────────────────── */}
      {tab === 'list' && !selectionMode && (
        <BottomInputBar
          lists={listsWithCounts}
          currentListId={currentListId}
          categoriesByList={categoriesByList}
          onAdd={addItem}
          onAddCategory={addCategory}
          isDark={isDark}
          navHeight={NAV_H}
        />
      )}

      {/* ── Bottom nav ───────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: NAV_H,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 30,
      }}>
        {[
          { id: 'list', label: 'List' },
          { id: 'categories', label: 'Categories' },
          { id: 'pro', label: 'Pro' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 20px', background: 'none', border: 'none', cursor: 'pointer',
            color: tab === t.id ? 'var(--accent)' : 'var(--text-2)',
            transition: 'color 0.15s', fontFamily: 'var(--font)',
          }}>
            {NavIcons[t.id]}
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Overlays ─────────────────────────────────────────────────────── */}
      {showLists && (
        <MyListsPanel
          lists={listsWithCounts}
          currentListId={currentListId}
          onSelectList={id => { setCurrentListId(id); setSelectedCat(null); }}
          onAddList={addList}
          onClose={() => setShowLists(false)}
        />
      )}
      {showShare && (
        <ShareModal list={curList} items={curItems} categories={curCategories} onClose={() => setShowShare(false)} />
      )}
      {itemModal && (
        <ItemModal mode={itemModal.mode} item={itemModal.item} categories={curCategories} onSave={saveItem} onClose={() => setItemModal(null)} />
      )}
      {detailItem && (
        <ItemDetailPanel
          item={detailItem}
          listName={curList?.name || 'List'}
          categories={curCategories}
          onSave={saveItem}
          onClose={() => setDetailItem(null)}
          onDelete={id => { deleteItem(id); setDetailItem(null); }}
          onToggle={id => { toggleItem(id); setDetailItem(prev => prev ? { ...prev, done: !prev.done } : prev); }}
          isDark={isDark}
        />
      )}
      {confirm && (
        <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />
      )}
      {showAddCat && (
        <AddCategoryModal onAdd={addCategory} onClose={() => setShowAddCat(false)} isDark={isDark} />
      )}
    </div>
  );
}

const hdrBtn = {
  width: 36, height: 36, borderRadius: 'var(--r-sm)',
  background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text-2)', flexShrink: 0,
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
