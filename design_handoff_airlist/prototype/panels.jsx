// Panels and modals — exported to window

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 2l10 10M12 2L2 12"/>
  </svg>
);

// ─── MyListsPanel ────────────────────────────────────────────────────────────
function MyListsPanel({ lists, currentListId, onSelectList, onAddList, onDeleteList, onClose }) {
  const [adding, setAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  const commit = () => {
    const n = newName.trim();
    if (!n) return;
    onAddList(n);
    setNewName('');
    setAdding(false);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'oklch(0% 0 0 / 0.42)',
        zIndex: 50, animation: 'fadeIn 0.2s',
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'min(288px, 82vw)',
        background: 'var(--surface)',
        zIndex: 51,
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        animation: 'slideInLeft 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '48px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' }}>My Lists</h2>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 'var(--r-xs)',
            background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
          }}><XIcon /></button>
        </div>

        {/* List rows */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {lists.map(list => {
            const active = list.id === currentListId;
            return (
              <button key={list.id} onClick={() => { onSelectList(list.id); onClose(); }} style={{
                width: '100%', textAlign: 'left',
                padding: '10px 20px',
                background: active ? 'var(--accent-bg)' : 'transparent',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background 0.1s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--r-sm)', flexShrink: 0,
                  background: active ? 'var(--accent)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke={active ? 'white' : 'var(--text-2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: active ? 'var(--accent-fg)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {list.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                    {list.itemCount} item{list.itemCount !== 1 ? 's' : ''}
                  </div>
                </div>
                {active && (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="var(--accent-fg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7.5l4 4 7-8"/>
                  </svg>
                )}
                {!active && onDeleteList && (
                  <button onMouseDown={e => { e.stopPropagation(); onDeleteList(list.id); }} style={{
                    width: 22, height: 22, borderRadius: 'var(--r-xs)', background: 'transparent',
                    border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, pointerEvents: 'none',
                  }} className="list-delete-btn">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
                  </button>
                )}
              </button>
            );
          })}
        </div>

        {/* New list */}
        <div style={{ padding: '10px 16px 20px', borderTop: '1px solid var(--border)' }}>
          {adding ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setAdding(false); }}
                placeholder="List name…"
                style={{
                  flex: 1, padding: '9px 12px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text)',
                  fontFamily: 'var(--font)', outline: 'none',
                }}
              />
              <button onClick={commit} style={{
                padding: '9px 14px', background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>Add</button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} style={{
              width: '100%', padding: '10px', background: 'transparent',
              border: '1.5px dashed var(--border)', borderRadius: 'var(--r-sm)',
              color: 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--font)',
            }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6.5 1v11M1 6.5h11"/>
              </svg>
              New List
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── ShareModal ──────────────────────────────────────────────────────────────
function ShareModal({ list, items, categories, onClose }) {
  const [copied, setCopied] = React.useState(false);
  const qrRef = React.useRef(null);

  const shareUrl = React.useMemo(() => {
    try {
      const payload = btoa(JSON.stringify({
        n: list?.name || 'My List',
        i: (items || []).map(item => {
          const cat = (categories || []).find(c => c.id === item.categoryId);
          return { n: item.name, q: item.qty || item.quantity || 1, c: cat?.name || '' };
        }),
      }));
      return `https://airlist.app/s/${payload.slice(0, 24)}`;
    } catch { return 'https://airlist.app/s/share'; }
  }, [list, items, categories]);

  React.useEffect(() => {
    if (!qrRef.current || !window.QRCode) return;
    qrRef.current.innerHTML = '';
    try {
      new window.QRCode(qrRef.current, {
        text: shareUrl, width: 160, height: 160,
        colorDark: '#18181b', colorLight: '#ffffff',
      });
    } catch(e) {}
  }, [shareUrl]);

  const copy = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'oklch(0% 0 0 / 0.5)',
      zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, animation: 'fadeIn 0.15s',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--r-xl)',
        padding: 24, width: '100%', maxWidth: 340,
        animation: 'slideUp 0.2s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Share List</h3>
            <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{list?.name}</p>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 'var(--r-sm)',
            background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
          }}><XIcon /></button>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'white', borderRadius: 'var(--r-md)',
          padding: 16, marginBottom: 16,
          border: '1px solid var(--border)', minHeight: 192,
        }}>
          <div ref={qrRef} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, padding: '8px 10px',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', fontSize: 12, color: 'var(--text-2)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{shareUrl}</div>
          <button onClick={copy} style={{
            padding: '8px 16px', flexShrink: 0,
            background: copied ? 'oklch(52% 0.17 145)' : 'var(--accent)',
            color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
            fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'background 0.2s',
          }}>{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ItemModal ───────────────────────────────────────────────────────────────
function ItemModal({ mode, item, categories, onSave, onClose }) {
  const [name, setName] = React.useState(item?.name || '');
  const [catId, setCatId] = React.useState(item?.categoryId || categories[0]?.id || '');
  const [qty, setQty] = React.useState(item?.qty || item?.quantity || 1);

  const submit = e => {
    e.preventDefault();
    if (!name.trim() || !catId) return;
    onSave({ name: name.trim(), categoryId: catId, qty, id: item?.id });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'oklch(0% 0 0 / 0.45)',
      zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 0.15s',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        padding: '20px 20px 36px', width: '100%', maxWidth: 480,
        animation: 'slideUp 0.2s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{mode === 'add' ? 'New Item' : 'Edit Item'}</h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 'var(--r-sm)',
            background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
          }}><XIcon /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input autoFocus type="text" placeholder="e.g. Organic Bananas"
            value={name} onChange={e => setName(e.target.value)}
            style={{
              padding: '12px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
              fontSize: 15, color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Category</label>
              <select value={catId} onChange={e => setCatId(e.target.value)} style={{
                width: '100%', padding: '10px 12px',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text)',
                fontFamily: 'var(--font)', outline: 'none', appearance: 'none',
              }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ width: 100 }}>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Qty</label>
              <div style={{
                display: 'flex', alignItems: 'center', height: 42,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', overflow: 'hidden',
              }}>
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0 12px', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 18 }}>−</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} style={{ padding: '0 12px', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 18 }}>+</button>
              </div>
            </div>
          </div>
          <button type="submit" disabled={!name.trim() || !catId} style={{
            padding: '13px', background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            opacity: (!name.trim() || !catId) ? 0.5 : 1, marginTop: 4, fontFamily: 'var(--font)',
          }}>{mode === 'add' ? 'Add Item' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

// ─── ConfirmModal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'oklch(0% 0 0 / 0.45)',
      zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'fadeIn 0.15s',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--r-xl)',
        padding: 24, width: '100%', maxWidth: 320,
        animation: 'slideUp 0.2s ease-out',
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 20, textWrap: 'pretty' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', background: 'var(--surface-2)',
            border: 'none', borderRadius: 'var(--r-sm)',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', background: 'oklch(52% 0.22 25)',
            color: 'white', border: 'none', borderRadius: 'var(--r-sm)',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── AddCategoryModal ────────────────────────────────────────────────────────
function AddCategoryModal({ onAdd, onClose, isDark }) {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('gray');

  const submit = e => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), color });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'oklch(0% 0 0 / 0.45)',
      zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      animation: 'fadeIn 0.15s',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        padding: '20px 20px 36px', width: '100%', maxWidth: 480,
        animation: 'slideUp 0.2s ease-out',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>New Category</h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 'var(--r-sm)',
            background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)',
          }}><XIcon /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input autoFocus type="text" placeholder="Category name"
            value={name} onChange={e => setName(e.target.value)}
            style={{
              padding: '12px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
              fontSize: 15, color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none',
            }}
          />
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {AVAILABLE_COLORS.map(c => {
                const cs = getCat(c, isDark);
                return (
                  <button key={c} type="button" onClick={() => setColor(c)} style={{
                    width: 28, height: 28, borderRadius: '50%', background: cs.dot,
                    border: color === c ? '3px solid var(--text)' : '3px solid transparent',
                    cursor: 'pointer', transition: 'border 0.1s',
                  }} />
                );
              })}
            </div>
          </div>
          <button type="submit" disabled={!name.trim()} style={{
            padding: '13px', background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', opacity: !name.trim() ? 0.5 : 1, marginTop: 4, fontFamily: 'var(--font)',
          }}>Add Category</button>
        </form>
      </div>
    </div>
  );
}

// ─── ItemDetailPanel ──────────────────────────────────────────────────────────
function ItemDetailPanel({ item, listName, categories, onSave, onClose, onDelete, onToggle, isDark }) {
  const _uid = () => Math.random().toString(36).slice(2, 10);
  const [name, setName]               = React.useState(item.name || '');
  const [notes, setNotes]             = React.useState(item.notes || '');
  const [subtasks, setSubtasks]       = React.useState(item.subtasks || []);
  const [attachments, setAttachments] = React.useState(item.attachments || []);
  const [newSubtask, setNewSubtask]   = React.useState('');
  const [dragFile, setDragFile]       = React.useState(false);
  const fileRef = React.useRef(null);
  const category = categories.find(c => c.id === item.categoryId);
  const cs = getCat(category?.color || 'gray', isDark);
  const doneTasks = subtasks.filter(s => s.done).length;

  const save = (patch = {}) =>
    onSave({ ...item, name, notes, subtasks, attachments, ...patch });

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const u = [...subtasks, { id: _uid(), name: newSubtask.trim(), done: false }];
    setSubtasks(u); setNewSubtask(''); save({ subtasks: u });
  };
  const toggleSub = id => {
    const u = subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s);
    setSubtasks(u); save({ subtasks: u });
  };
  const deleteSub = id => {
    const u = subtasks.filter(s => s.id !== id);
    setSubtasks(u); save({ subtasks: u });
  };
  const handleFiles = files => {
    const u = [...attachments, ...[...files].map(f => ({ id: _uid(), name: f.name, size: f.size, type: f.type }))];
    setAttachments(u); save({ attachments: u });
  };
  const deleteAttachment = id => {
    const u = attachments.filter(a => a.id !== id);
    setAttachments(u); save({ attachments: u });
  };

  const SLabel = ({ children, extra }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase', color:'var(--text-2)' }}>{children}</span>
      {extra}
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'oklch(0% 0 0 / 0.45)', zIndex:60, animation:'fadeIn 0.15s' }} />
      <div style={{
        position:'fixed', bottom:0, left:0, right:0,
        maxHeight:'92dvh',
        background:'var(--surface)',
        borderRadius:'var(--r-xl) var(--r-xl) 0 0',
        zIndex:61, display:'flex', flexDirection:'column',
        animation:'slideUp 0.22s ease-out',
        boxShadow:'0 -8px 40px oklch(0% 0 0 / 0.18)',
      }}>
        {/* Drag handle bar */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <span style={{ fontSize:12, color:'var(--text-2)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            My Lists › <strong style={{ color:'var(--text)' }}>{listName}</strong>
          </span>
          <button onClick={() => { onToggle(item.id); onClose(); }} style={{
            padding:'5px 12px', borderRadius:'var(--r-full)', fontSize:12, fontWeight:700,
            background: item.done ? 'oklch(96% 0.04 145)' : 'var(--accent-bg)',
            color: item.done ? 'oklch(34% 0.14 145)' : 'var(--accent-fg)',
            border:'none', cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
          }}>{item.done ? '✓ Completed' : 'Mark done'}</button>
          <button onClick={() => { onDelete(item.id); onClose(); }} title="Delete" style={{ width:30, height:30, borderRadius:'var(--r-sm)', background:'transparent', border:'none', cursor:'pointer', color:'oklch(52% 0.22 25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:'var(--r-sm)', background:'var(--surface-2)', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l9 9M11 2L2 11"/></svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px 20px 48px' }}>

          {/* Editable title */}
          <input value={name} onChange={e => setName(e.target.value)} onBlur={() => save({ name })}
            style={{ width:'100%', fontSize:22, fontWeight:700, letterSpacing:'-0.4px', background:'transparent', border:'none', outline:'none', color:'var(--text)', fontFamily:'var(--font)', marginBottom:14, textDecoration: item.done?'line-through':'none', opacity: item.done?0.6:1 }}
          />

          {/* Meta chips */}
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
            {category && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:'var(--r-full)', background:cs.bg, color:cs.text, fontSize:13, fontWeight:600 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:cs.dot }} />{category.name}
              </span>
            )}
            {item.priority && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:'var(--r-full)', background:'oklch(97% 0.03 25)', color:'oklch(36% 0.18 25)', fontSize:13, fontWeight:600 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(52% 0.22 25)" stroke="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/></svg>
                Priority
              </span>
            )}
            {(item.qty||1) > 1 && (
              <span style={{ display:'inline-flex', alignItems:'center', padding:'6px 14px', borderRadius:'var(--r-full)', background:'var(--surface-2)', color:'var(--text-2)', fontSize:13, fontWeight:600 }}>×{item.qty} qty</span>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom:24 }}>
            <SLabel>Notes</SLabel>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => save({ notes })}
              placeholder="Insert your notes here…"
              style={{ width:'100%', minHeight:76, padding:'10px 12px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', fontSize:14, color:'var(--text)', fontFamily:'var(--font)', resize:'vertical', outline:'none', lineHeight:1.6 }}
            />
          </div>

          {/* Subtasks */}
          <div style={{ marginBottom:24 }}>
            <SLabel>
              Subtasks {doneTasks}/{subtasks.length}
            </SLabel>
            {subtasks.length > 0 && (
              <div style={{ height:3, background:'var(--surface-2)', borderRadius:'var(--r-full)', marginBottom:8, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${subtasks.length?(doneTasks/subtasks.length)*100:0}%`, background:'var(--accent)', borderRadius:'var(--r-full)', transition:'width 0.3s' }} />
              </div>
            )}
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:4 }}>
              {subtasks.map(s => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                  <button onClick={() => toggleSub(s.id)} style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, border: s.done?'none':'1.5px solid var(--border)', background: s.done?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    {s.done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M1 3.5l2.5 2.5L8 1"/></svg>}
                  </button>
                  <span style={{ flex:1, fontSize:14, color: s.done?'var(--text-2)':'var(--text)', textDecoration: s.done?'line-through':'none' }}>{s.name}</span>
                  <button onClick={() => deleteSub(s.id)} style={{ width:20, height:20, background:'transparent', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l7 7M9 2L2 9"/></svg>
                  </button>
                </div>
              ))}
              {/* Add subtask row */}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:'1.5px solid var(--border)', flexShrink:0 }} />
                <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter') addSubtask(); }}
                  placeholder="Add a new subtask…"
                  style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:14, color:'var(--text)', fontFamily:'var(--font)' }}
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <SLabel>Attachments</SLabel>
            {attachments.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'var(--surface-2)', borderRadius:'var(--r-sm)', marginBottom:4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                <span style={{ flex:1, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</span>
                <span style={{ fontSize:11, color:'var(--text-2)', flexShrink:0 }}>{(a.size/1024).toFixed(0)} KB</span>
                <button onClick={() => deleteAttachment(a.id)} style={{ width:18, height:18, background:'transparent', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l6 6M8 2L2 8"/></svg>
                </button>
              </div>
            ))}
            <div
              onDragOver={e => { e.preventDefault(); setDragFile(true); }}
              onDragLeave={() => setDragFile(false)}
              onDrop={e => { e.preventDefault(); setDragFile(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              style={{ padding:'22px', textAlign:'center', border:`1.5px dashed ${dragFile?'var(--accent)':'var(--border)'}`, borderRadius:'var(--r-md)', cursor:'pointer', background: dragFile?'var(--accent-bg)':'transparent', transition:'all 0.15s', marginTop:4 }}
            >
              <p style={{ fontSize:13, color:'var(--text-2)' }}>Click to add · drop files here</p>
            </div>
            <input ref={fileRef} type="file" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MyListsPanel, ShareModal, ItemModal, ConfirmModal, AddCategoryModal, ItemDetailPanel });
