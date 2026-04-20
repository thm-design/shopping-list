// Shared UI primitives — exported to window

const CAT_COLORS = {
  green:  { dot: 'oklch(52% 0.17 145)',  lBg: 'oklch(96% 0.04 145)',   lTxt: 'oklch(34% 0.14 145)',  dBg: 'oklch(19% 0.07 145)',  dTxt: 'oklch(72% 0.14 145)' },
  red:    { dot: 'oklch(52% 0.22 25)',   lBg: 'oklch(97% 0.03 25)',    lTxt: 'oklch(36% 0.18 25)',   dBg: 'oklch(17% 0.06 25)',   dTxt: 'oklch(72% 0.16 25)'  },
  blue:   { dot: 'oklch(55% 0.20 245)',  lBg: 'oklch(96% 0.04 245)',   lTxt: 'oklch(38% 0.16 245)',  dBg: 'oklch(17% 0.07 245)',  dTxt: 'oklch(72% 0.14 245)' },
  orange: { dot: 'oklch(63% 0.20 65)',   lBg: 'oklch(97% 0.04 65)',    lTxt: 'oklch(42% 0.16 65)',   dBg: 'oklch(20% 0.07 65)',   dTxt: 'oklch(75% 0.14 65)'  },
  yellow: { dot: 'oklch(76% 0.17 90)',   lBg: 'oklch(98% 0.04 90)',    lTxt: 'oklch(48% 0.15 80)',   dBg: 'oklch(22% 0.07 85)',   dTxt: 'oklch(82% 0.13 90)'  },
  purple: { dot: 'oklch(55% 0.22 300)',  lBg: 'oklch(96% 0.04 300)',   lTxt: 'oklch(38% 0.18 300)',  dBg: 'oklch(17% 0.08 300)',  dTxt: 'oklch(72% 0.14 300)' },
  pink:   { dot: 'oklch(60% 0.22 350)',  lBg: 'oklch(97% 0.03 350)',   lTxt: 'oklch(42% 0.18 350)',  dBg: 'oklch(20% 0.07 350)',  dTxt: 'oklch(74% 0.14 350)' },
  gray:   { dot: 'oklch(52% 0.01 240)',  lBg: 'oklch(95% 0.005 240)',  lTxt: 'oklch(40% 0.01 240)',  dBg: 'oklch(22% 0.007 240)', dTxt: 'oklch(65% 0.01 240)' },
};
const AVAILABLE_COLORS = Object.keys(CAT_COLORS);

function getCat(color, isDark) {
  const c = CAT_COLORS[color] || CAT_COLORS.gray;
  return { dot: c.dot, bg: isDark ? c.dBg : c.lBg, text: isDark ? c.dTxt : c.lTxt };
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : (done / total) * 100;
  const complete = done === total && total > 0;
  return (
    <div style={{ padding: '9px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: 'var(--text-2)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Progress</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: complete ? 'oklch(52% 0.17 145)' : 'var(--text-2)' }}>{done} / {total} {complete && '✓'}</span>
      </div>
      <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: complete ? 'oklch(52% 0.17 145)' : 'var(--accent)', borderRadius: 'var(--r-full)', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.3s' }} />
      </div>
    </div>
  );
}

// ─── CategoryFilterBar ────────────────────────────────────────────────────────
function CategoryFilterBar({ categories, selected, onSelect, sortMode, onSortChange, isDark, counts }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', overflowX: 'auto', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
      <button onClick={() => onSortChange(sortMode === 'category' ? 'custom' : 'category')}
        style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 'var(--r-xs)', border: '1px solid var(--border)', background: sortMode === 'custom' ? 'var(--accent-bg)' : 'var(--surface)', color: sortMode === 'custom' ? 'var(--accent-fg)' : 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 3.5h10M3 6.5h7M4.5 9.5h4"/></svg>
      </button>
      <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />
      <button onClick={() => onSelect(null)} style={{ flexShrink: 0, padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600, background: selected === null ? 'var(--accent)' : 'var(--surface-2)', color: selected === null ? 'white' : 'var(--text-2)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
        All {counts?.all > 0 && <span style={{ opacity: 0.65, fontWeight: 400, fontSize: 11 }}>·{counts.all}</span>}
      </button>
      {categories.map(cat => {
        const cs = getCat(cat.color, isDark);
        const isActive = selected === cat.id;
        return (
          <button key={cat.id} onClick={() => onSelect(cat.id)} style={{ flexShrink: 0, padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: 12, fontWeight: 600, background: isActive ? cs.dot : cs.bg, color: isActive ? 'white' : cs.text, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {cat.name}{counts?.[cat.id] > 0 && <span style={{ opacity: 0.65, fontWeight: 400, fontSize: 11, marginLeft: 2 }}>·{counts[cat.id]}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ─── MenuBtn helper ───────────────────────────────────────────────────────────
function MenuBtn({ onClick, icon, label, color }) {
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 'var(--r-sm)', color: color || 'var(--text)', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font)', textAlign: 'left' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{icon}{label}</button>
  );
}

// ─── ListItemCard ─────────────────────────────────────────────────────────────
function ListItemCard({ item, category, onToggle, onDelete, onPriorityToggle, onOpenDetail,
  isSelectionMode, isSelected, onSelectToggle, isDark, draggedId, setDraggedId, onReorder }) {

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [tx, setTx]             = React.useState(0);
  const [dragOver, setDragOver] = React.useState(false);
  const touchStartX = React.useRef(null);
  const menuRef     = React.useRef(null);
  const cs = getCat(category?.color || 'gray', isDark);

  React.useEffect(() => {
    if (!menuOpen) return;
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  const onTS = e => { touchStartX.current = e.touches[0].clientX; };
  const onTM = e => { if (touchStartX.current===null) return; const d = e.touches[0].clientX-touchStartX.current; if (d<0&&d>-80) setTx(d); };
  const onTE = () => { setTx(tx<-40?-72:0); touchStartX.current=null; };

  const onDragStart = e => { setDraggedId(item.id); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',item.id); };
  const onDragOver  = e => { e.preventDefault(); if (draggedId&&draggedId!==item.id) setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onDrop      = e => { e.preventDefault(); setDragOver(false); const src=e.dataTransfer.getData('text/plain'); if(src&&src!==item.id) onReorder(src,item.id); setDraggedId(null); };

  return (
    <div style={{ position:'relative', marginBottom:4, borderRadius:'var(--r-sm)' }}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>

      {/* Swipe-reveal delete */}
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:72, background:'oklch(52% 0.22 25)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0 var(--r-sm) var(--r-sm) 0' }}>
        <button onClick={() => { setTx(0); onDelete(item.id); }} style={{ background:'none', border:'none', cursor:'pointer', color:'white', display:'flex', padding:8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>

      {/* Card */}
      <div style={{
        display:'flex', alignItems:'center', gap:8, padding:'11px 10px 11px 8px',
        background: item.priority ? (isDark?'oklch(17% 0.06 25)':'oklch(99% 0.015 25)') : 'var(--surface)',
        border:`1px solid ${dragOver?'var(--accent)':item.priority?'oklch(52% 0.22 25 / 0.28)':'var(--border)'}`,
        borderRadius:'var(--r-sm)', minHeight:46,
        opacity: draggedId===item.id ? 0.4 : item.done ? 0.52 : 1,
        transform:`translateX(${tx}px)`,
        transition: tx===0 ? 'transform 0.2s ease-out' : 'none',
      }} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>

        {/* Drag handle */}
        <div draggable onDragStart={onDragStart} onDragEnd={() => setDraggedId(null)}
          onClick={e => e.stopPropagation()}
          style={{ flexShrink:0, cursor:'grab', color:'var(--border)', display:'flex', touchAction:'none', padding:'0 2px' }}>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
            <circle cx="4.5" cy="5"  r="1.4"/><circle cx="9.5" cy="5"  r="1.4"/>
            <circle cx="4.5" cy="10" r="1.4"/><circle cx="9.5" cy="10" r="1.4"/>
            <circle cx="4.5" cy="15" r="1.4"/><circle cx="9.5" cy="15" r="1.4"/>
          </svg>
        </div>

        {/* Checkbox / select */}
        {isSelectionMode ? (
          <button onClick={() => onSelectToggle?.(item.id)} style={{ flexShrink:0, width:20, height:20, borderRadius:'var(--r-xs)', border: isSelected?'none':'1.5px solid var(--border)', background: isSelected?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 4l3 3 5-6"/></svg>}
          </button>
        ) : (
          <button onClick={e => { e.stopPropagation(); onToggle(item.id); }} style={{ flexShrink:0, width:20, height:20, borderRadius:'50%', border: item.done?'none':'1.5px solid var(--border)', background: item.done?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}>
            {item.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 4l3 3 5-6"/></svg>}
          </button>
        )}

        {/* Priority flag */}
        {item.priority && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(52% 0.22 25)" stroke="none" style={{ flexShrink:0 }}>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          </svg>
        )}

        {/* Clickable body */}
        <div onClick={() => !isSelectionMode && onOpenDetail?.(item)}
          style={{ flex:1, display:'flex', alignItems:'center', gap:8, overflow:'hidden', cursor: isSelectionMode?'default':'pointer', minWidth:0 }}>
          <span style={{ fontSize:14, fontWeight:500, color: item.done?'var(--text-2)':'var(--text)', textDecoration: item.done?'line-through':'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {item.name}
          </span>
          {(item.subtasks?.length||0) > 0 && (
            <span style={{ flexShrink:0, fontSize:10, fontWeight:600, color:'var(--text-2)', background:'var(--surface-2)', padding:'1px 5px', borderRadius:'var(--r-xs)' }}>
              {item.subtasks.filter(s=>s.done).length}/{item.subtasks.length}
            </span>
          )}
          {category && (
            <span style={{ flexShrink:0, fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:'var(--r-full)', background:cs.bg, color:cs.text, letterSpacing:'0.04em', textTransform:'uppercase' }}>
              {category.name}
            </span>
          )}
          {(item.qty||1)>1 && (
            <span style={{ flexShrink:0, fontSize:11, fontWeight:700, padding:'2px 5px', borderRadius:'var(--r-xs)', background:'var(--surface-2)', color:'var(--text-2)' }}>×{item.qty}</span>
          )}
        </div>

        {/* ⋯ menu */}
        {!isSelectionMode && (
          <div ref={menuRef} style={{ position:'relative', flexShrink:0 }}>
            <button onClick={e => { e.stopPropagation(); setMenuOpen(o=>!o); }} style={{ width:28, height:28, borderRadius:'var(--r-xs)', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>···</button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:'110%', zIndex:100, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'4px', minWidth:172, boxShadow:'0 8px 24px oklch(0% 0 0 / 0.14)', animation:'slideUp 0.12s ease-out' }}>
                <MenuBtn onClick={() => { onPriorityToggle(item.id); setMenuOpen(false); }}
                  color={item.priority?'oklch(52% 0.22 25)':undefined}
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill={item.priority?'oklch(52% 0.22 25)':'none'} stroke={item.priority?'oklch(52% 0.22 25)':'currentColor'} strokeWidth="2" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>}
                  label={item.priority?'Remove priority':'Flag as priority'}
                />
                <MenuBtn onClick={() => { onOpenDetail?.(item); setMenuOpen(false); }}
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
                  label="View details"
                />
                <div style={{ height:1, background:'var(--border)', margin:'3px 4px' }} />
                <MenuBtn onClick={() => { onDelete(item.id); setMenuOpen(false); }} color="oklch(52% 0.22 25)"
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>}
                  label="Delete"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BottomInputBar ───────────────────────────────────────────────────────────
function BottomInputBar({ lists, currentListId, categoriesByList, onAdd, onAddCategory, isDark, navHeight }) {
  const [text, setText]           = React.useState('');
  const [targetListId, setTarget] = React.useState(currentListId);
  const [catId, setCatId]         = React.useState('');
  const [focused, setFocused]     = React.useState(false);
  const [addingCat, setAddingCat] = React.useState(false);
  const [newCatName, setNCN]      = React.useState('');
  const [newCatColor, setNCC]     = React.useState('gray');
  const inputRef = React.useRef(null);

  React.useEffect(() => { setTarget(currentListId); }, [currentListId]);
  React.useEffect(() => {
    const cats = categoriesByList[targetListId] || [];
    setCatId(cats[0]?.id || '');
    setAddingCat(false);
  }, [targetListId, categoriesByList]);

  const targetCats = categoriesByList[targetListId] || [];

  const submit = () => {
    if (!text.trim()) return;
    onAdd({ name: text.trim(), categoryId: catId || null, qty: 1, listId: targetListId });
    setText(''); inputRef.current?.blur();
  };

  const commitCat = () => {
    if (!newCatName.trim()) return;
    onAddCategory({ name: newCatName.trim(), color: newCatColor, listId: targetListId });
    setNCN(''); setNCC('gray'); setAddingCat(false);
  };

  return (
    <div style={{ position:'fixed', bottom:(navHeight||0)+10, left:12, right:12, zIndex:40 }}>
      {focused && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'12px 14px', marginBottom:8, boxShadow:'0 8px 32px oklch(0% 0 0 / 0.12)', animation:'slideUp 0.18s ease-out' }}>
          {/* List picker */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-2)', marginBottom:7 }}>Add to list</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {lists.map(list => {
                const active = targetListId === list.id;
                return (
                  <button key={list.id}
                    onMouseDown={e => { e.preventDefault(); setTarget(list.id); }}
                    onTouchStart={() => setTarget(list.id)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:'var(--r-sm)', background: active?'var(--accent-bg)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.12s' }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', flexShrink:0, border: active?'none':'1.5px solid var(--border)', background: active?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M1 3.5l2.5 2.5L8 1"/></svg>}
                    </div>
                    <span style={{ fontSize:13, fontWeight: active?600:500, color: active?'var(--accent-fg)':'var(--text)', flex:1 }}>{list.name}</span>
                    <span style={{ fontSize:11, color:'var(--text-2)' }}>{list.itemCount} item{list.itemCount!==1?'s':''}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Category picker */}
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-2)', marginBottom:7 }}>Category</div>
            {addingCat ? (
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <input autoFocus value={newCatName} onChange={e => setNCN(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter') commitCat(); if(e.key==='Escape') setAddingCat(false); }}
                  placeholder="Category name…"
                  style={{ flex:1, padding:'6px 10px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', fontSize:12, color:'var(--text)', fontFamily:'var(--font)', outline:'none' }}
                />
                <div style={{ display:'flex', gap:4 }}>
                  {['gray','green','blue','red','orange','purple','pink'].map(c => {
                    const ccs = getCat(c, isDark);
                    return <button key={c} onMouseDown={e => { e.preventDefault(); setNCC(c); }} style={{ width:18, height:18, borderRadius:'50%', background:ccs.dot, border: newCatColor===c?'2.5px solid var(--text)':'2.5px solid transparent', cursor:'pointer' }} />;
                  })}
                </div>
                <button onMouseDown={e => { e.preventDefault(); commitCat(); }} style={{ padding:'6px 12px', background:'var(--accent)', color:'white', border:'none', borderRadius:'var(--r-sm)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Add</button>
                <button onMouseDown={e => { e.preventDefault(); setAddingCat(false); }} style={{ padding:'6px 8px', background:'var(--surface-2)', border:'none', borderRadius:'var(--r-sm)', fontSize:12, cursor:'pointer', color:'var(--text-2)' }}>✕</button>
              </div>
            ) : (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                {targetCats.map(cat => {
                  const ccs = getCat(cat.color, isDark);
                  const active = catId===cat.id;
                  return <button key={cat.id} onMouseDown={e => { e.preventDefault(); setCatId(cat.id); }} style={{ padding:'3px 10px', borderRadius:'var(--r-full)', fontSize:11, fontWeight:600, background: active?ccs.dot:ccs.bg, color: active?'white':ccs.text, border:'none', cursor:'pointer', transition:'all 0.12s' }}>{cat.name}</button>;
                })}
                {targetCats.length===0 && <span style={{ fontSize:12, color:'var(--text-2)', opacity:0.5, fontStyle:'italic' }}>No categories</span>}
                <button onMouseDown={e => { e.preventDefault(); setAddingCat(true); }} style={{ padding:'3px 9px', borderRadius:'var(--r-full)', fontSize:11, fontWeight:600, background:'var(--surface-2)', color:'var(--text-2)', border:'1px dashed var(--border)', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 1v8M1 5h8"/></svg>Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating input */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', boxShadow:'0 4px 20px oklch(0% 0 0 / 0.10)' }}>
        <button onClick={() => inputRef.current?.focus()} style={{ flexShrink:0, width:32, height:32, borderRadius:'var(--r-sm)', background:'var(--accent)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M8 2v12M2 8h12"/></svg>
        </button>
        <input ref={inputRef} type="text" placeholder="Add an item…" value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={e => e.key==='Enter' && submit()}
          style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:15, color:'var(--text)', fontFamily:'var(--font)' }}
        />
        <button onClick={submit} disabled={!text.trim()} style={{ flexShrink:0, width:32, height:32, borderRadius:'var(--r-sm)', background: text.trim()?'var(--accent)':'var(--surface-2)', border:'none', cursor: text.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={text.trim()?'white':'var(--text-2)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { CAT_COLORS, AVAILABLE_COLORS, getCat, ProgressBar, CategoryFilterBar, MenuBtn, ListItemCard, BottomInputBar });
