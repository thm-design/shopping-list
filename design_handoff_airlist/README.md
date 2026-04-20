# Handoff: AirList — UI Redesign + Feature Additions

## Overview

AirList is a mobile-first shopping list app built on React + TypeScript + AWS Amplify. This handoff documents a full UI polish pass plus several new features designed in HTML prototypes. The goal is to bring the real codebase up to this design without replacing the Amplify data layer.

## About the Design Files

The files in this bundle (`prototype/`, `AirList Prototype.html`, `AirList Design System.html`) are **HTML design references** — interactive prototypes showing intended look, behavior, and interactions. They use mock in-memory data and React/Babel in the browser.

**The task is to recreate these designs inside the existing React + TypeScript + Tailwind v4 + AWS Amplify codebase** (`src/` folder), using its established patterns, components, and data layer. Do not ship the prototype HTML directly.

## Fidelity

**High-fidelity.** The prototypes are pixel-close mockups with final colors (oklch tokens), typography (system-ui stack), spacing, border radii, and interactions. Recreate the UI as closely as possible within the existing codebase conventions.

---

## Design Tokens

All tokens are defined as CSS custom properties. Add these to `src/index.css` (replace or extend the existing Tailwind theme).

### Typography
```css
--font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```
Replace `Inter` with this native stack in the `@theme` block.

### Color tokens
```css
:root {
  --bg:        oklch(98.5% 0.004 240);
  --surface:   oklch(100% 0 0);
  --surface-2: oklch(96.5% 0.005 240);
  --border:    oklch(91% 0.008 240);
  --text:      oklch(14% 0.012 240);
  --text-2:    oklch(50% 0.012 240);
  --accent:    oklch(55% 0.20 245);   /* blue, ~#2563eb */
  --accent-bg: oklch(95.5% 0.05 245);
  --accent-fg: oklch(52% 0.20 245);

  --r-xs:   4px;
  --r-sm:   8px;
  --r-md:   12px;
  --r-lg:   16px;
  --r-xl:   20px;
  --r-full: 9999px;
}

.dark {
  --bg:        oklch(9% 0.006 240);
  --surface:   oklch(13% 0.008 240);
  --surface-2: oklch(18% 0.008 240);
  --border:    oklch(24% 0.009 240);
  --text:      oklch(96% 0.004 240);
  --text-2:    oklch(62% 0.012 240);
  --accent:    oklch(65% 0.18 245);
  --accent-bg: oklch(19% 0.07 245);
  --accent-fg: oklch(68% 0.16 245);
}
```

### Category colors
Each category has a `dot`, light `bg`/`text`, and dark `bg`/`text`:

| Name   | Dot color               | Light bg               | Light text             | Dark bg                | Dark text              |
|--------|-------------------------|------------------------|------------------------|------------------------|------------------------|
| green  | oklch(52% 0.17 145)    | oklch(96% 0.04 145)   | oklch(34% 0.14 145)   | oklch(19% 0.07 145)   | oklch(72% 0.14 145)   |
| red    | oklch(52% 0.22 25)     | oklch(97% 0.03 25)    | oklch(36% 0.18 25)    | oklch(17% 0.06 25)    | oklch(72% 0.16 25)    |
| blue   | oklch(55% 0.20 245)    | oklch(96% 0.04 245)   | oklch(38% 0.16 245)   | oklch(17% 0.07 245)   | oklch(72% 0.14 245)   |
| orange | oklch(63% 0.20 65)     | oklch(97% 0.04 65)    | oklch(42% 0.16 65)    | oklch(20% 0.07 65)    | oklch(75% 0.14 65)    |
| yellow | oklch(76% 0.17 90)     | oklch(98% 0.04 90)    | oklch(48% 0.15 80)    | oklch(22% 0.07 85)    | oklch(82% 0.13 90)    |
| purple | oklch(55% 0.22 300)    | oklch(96% 0.04 300)   | oklch(38% 0.18 300)   | oklch(17% 0.08 300)   | oklch(72% 0.14 300)   |
| pink   | oklch(60% 0.22 350)    | oklch(97% 0.03 350)   | oklch(42% 0.18 350)   | oklch(20% 0.07 350)   | oklch(74% 0.14 350)   |
| gray   | oklch(52% 0.01 240)    | oklch(95% 0.005 240)  | oklch(40% 0.01 240)   | oklch(22% 0.007 240)  | oklch(65% 0.01 240)   |

### Dark mode fix
Remove the broken `@custom-variant` line from `src/index.css`:
```diff
- @custom-variant dark (&:where(.dark, [data-theme="dark"]) &);
```
Tailwind v4 handles `.dark` class natively — this line was causing zero-specificity issues.

---

## Data Model Changes

### Categories are now per-list
The existing global `categories` model should become **per-list**. Each list owns its own category set.

- `Groceries` list pre-seeds with the 5 default food categories (Produce, Meat, Dairy, Pantry, General).
- **New lists start with zero categories.**
- Users can add categories per-list from the Categories tab or inline from the bottom input bar.

### New fields on `ListItem`
Add these optional fields to the `ListItem` schema (`amplify/data/resource.ts`):

```typescript
priority:    a.boolean().default(false),  // pins to top of list
notes:       a.string(),                  // free-text notes
subtasks:    a.json(),                    // [{id, name, done}]
attachments: a.json(),                    // [{id, name, size, type}]
```

### Multiple lists
The app now supports multiple shopping lists (currently a `UserPreference`-scoped single list). Add a `ShoppingList` model:

```typescript
ShoppingList: a.model({
  name:       a.string().required(),
  userKey:    a.string().required(),
  sortOrder:  a.integer(),
})
```

Items and categories should reference a `listId`.

---

## Screens & Views

### 1. App Shell

**Layout:** Fixed header (top) + scrollable main + floating input bar + fixed bottom nav. Height: `100dvh`, no page overflow.

**Header** (`padding: 10px 14px`, `background: --surface`, `border-bottom: 1px solid --border`):
- Left: hamburger/list icon button (36×36px, `--r-sm`, `--surface-2`) → opens My Lists panel
- Center: list name (`16px/700/−0.3px`) + subtitle `"X of Y done"` (`11px`, `--text-2`)
- Right: share icon button, then theme toggle icon button (both 36×36px, `--r-sm`, `--surface-2`)

**Progress bar** (below header, only when list has items):
- `3px` tall track, `--surface-2` background
- Fill: `--accent`; turns `oklch(52% 0.17 145)` (green) at 100%
- Label row: `"PROGRESS"` label (10px/700/uppercase) + `"X / Y"` count (11px/700)
- Transition: `width 0.5s cubic-bezier(0.4,0,0.2,1)`

**Category filter bar** (below progress bar, only on List tab):
- Horizontal scroll, `gap: 6px`, `padding: 7px 14px`
- Left: sort icon button (26×26px, `--r-xs`, filled `--accent-bg` when custom sort is active)
- Separator: `1px × 18px` vertical line
- "All" chip + one chip per category; active chip gets `cs.dot` as background (white text); inactive gets `cs.bg`/`cs.text`
- Chips show item count suffix `·N` in lighter weight

**Bottom nav** (`height: 64px`, `position: fixed, bottom: 0`):
- 3 tabs: List, Categories, Pro
- Active: `--accent`; inactive: `--text-2`
- Icon 20×20px + label 10px/600/UC

---

### 2. List Tab — Item List

**List item row** (`min-height: 46px`, `padding: 11px 10px 11px 8px`):

| Element | Spec |
|---------|------|
| Drag handle | 6-dot grip SVG, `14×20px`, `color: --border`, `cursor: grab`, far left, `draggable` attribute on this element only |
| Checkbox | 20×20px circle; unchecked: `1.5px border --border`; checked: `--accent` fill + white checkmark SVG |
| Priority flag | 12×12px filled red flag SVG (`oklch(52% 0.22 25)`), shown when `item.priority === true` |
| Item name | `14px/500`, truncated; strikethrough + `--text-2` when done |
| Subtask count badge | `"2/4"` format, `10px/600`, `--surface-2` bg, `--r-xs`, only shown when subtasks exist |
| Category pill | `10px/700/UC`, `padding: 2px 7px`, `--r-full`, category bg/text |
| Qty badge | `11px/700`, `padding: 2px 5px`, `--r-xs`, `--surface-2`/`--text-2`, only shown when qty > 1 |
| ⋯ button | `28×28px`, `--r-xs`, transparent bg, `--text-2`, `font-size: 17px` (literal `···` character) |

**Priority item background:** `oklch(99% 0.015 25)` light / `oklch(17% 0.06 25)` dark; border `oklch(52% 0.22 25 / 0.28)`.

**Done item:** `opacity: 0.52`.

**Drag state:** dragged item at `opacity: 0.4`; drop target gets `border-color: --accent`.

**Swipe-to-delete (mobile):** swipe left to reveal a `72px` wide red (`oklch(52% 0.22 25)`) delete zone behind the card. Snaps to `translateX(-72px)` at threshold `-40px`, snaps back at `translateX(0)`. The outer wrapper must **not** have `overflow: hidden` (this clips the ⋯ dropdown).

**Drag-and-drop (desktop):** HTML5 drag API from the grip handle. Dragging switches `sortMode` to `'custom'` automatically.

**Click item body → opens Item Detail Panel** (not the checkbox or ⋯ button).

#### ⋯ Dropdown
`position: absolute, right: 0, top: 110%`, `z-index: 100`, `min-width: 172px`, `--r-md`, `box-shadow: 0 8px 24px oklch(0% 0 0 / 0.14)`. Items:
1. Flag as priority / Remove priority (red when active)
2. View details
3. `1px divider`
4. Delete (red text)

Close on outside click via `document.addEventListener('mousedown', ...)`.

#### Selection mode
Triggered by a grid-4 icon button in the header (36×36px). When active:
- A blue selection bar slides in below the header: `"N selected"`, Select All, Delete, Cancel buttons
- Checkboxes replace the ⋯ menus (square, `--r-xs`, blue fill when selected)
- Floating input bar hides
- Batch delete shows a `ConfirmModal`

**Clear checked items button:** shown when `doneCount > 0`; dashed border, full width, `12px/600`, `--text-2`.

---

### 3. Item Detail Panel

Bottom sheet. `position: fixed, bottom: 0, left: 0, right: 0`, `max-height: 92dvh`, `border-radius: --r-xl --r-xl 0 0`, `z-index: 61`, `animation: slideUp 0.22s ease-out`. Backdrop at `z-index: 60`.

**Drag handle bar:** `36×4px`, `--border`, centered, `padding-top: 10px`.

**Header row** (`padding: 10px 16px`, `border-bottom: 1px solid --border`):
- Breadcrumb: `"My Lists › List Name"` (`12px`, `--text-2`)
- "Mark done" pill button (`--r-full`, `--accent-bg`/`--accent-fg`; turns green bg/text when done)
- Delete icon button (red)
- Close icon button (`--surface-2`)

**Scrollable body** (`padding: 18px 20px 48px`):

1. **Editable title** — `<input>`, `22px/700/−0.4px`, transparent bg, no border, blur → save. Strikethrough + `opacity: 0.6` when done.
2. **Meta chips row** — category chip (dot + name), priority chip (red flag + "Priority"), qty chip (`×N qty`); all `padding: 6px 14px`, `--r-full`, `13px/600`.
3. **Notes** — section label (`10px/700/UC/0.09em LS`) + `<textarea>` (`min-height: 76px`, `--surface-2`, `--r-sm`, `14px`, `resize: vertical`). Save on blur.
4. **Subtasks** — section label + `"X/Y"` count + `3px` progress bar (blue → green at 100%). Each subtask: circle checkbox (`18px`), name, delete button. Inline "Add a new subtask…" row at bottom. Save on toggle/add/delete.
5. **Attachments** — section label + file list (name + size + delete) + dashed drop zone. Click drop zone → file input (`multiple`). Handle `dragover`/`drop` events. Save metadata (name, size, type) to `item.attachments`.

---

### 4. Floating Bottom Input Bar

`position: fixed`, `bottom: NAV_H + 10px`, `left: 12px`, `right: 12px`, `z-index: 40`.  
Card style: `border-radius: --r-lg`, `box-shadow: 0 4px 20px oklch(0% 0 0 / 0.10)`, `border: 1px solid --border`.

**Input bar** (`padding: 10px 12px`, `gap: 8px`):
- Left: `+` icon button (32×32px, `--r-sm`, `--accent` bg, white icon) → focuses the text input
- Center: plain text input (`15px`, transparent bg, no border)
- Right: submit arrow button (32×32px, `--r-sm`; `--accent` when text present, `--surface-2` when empty)
- `Enter` key submits

**Expansion panel** (slides up above bar when input focused, `animation: slideUp 0.18s`):

Section 1 — **Add to list:**
- Label: `"ADD TO LIST"` (10px/700/UC)
- Stacked rows (not pills): each row is a button `padding: 8px 10px`, `--r-sm`
  - Active: `--accent-bg` bg, blue circle checkbox with checkmark, name in `--accent-fg`
  - Inactive: transparent bg, empty circle, name in `--text`
  - Right: item count in `--text-2`

Section 2 — **Category** (always rendered, prevents layout shift):
- Label: `"CATEGORY"` (10px/700/UC)
- Category chips in `--r-full` pill style (active: `cs.dot` bg / white text)
- `"No categories"` italic placeholder when list has no categories
- `"+ Add"` dashed pill button → inline form: text input + color dot picker (7 colors, 18px dots) + Add / ✕

**Inline category add form** (replaces chip row):
- Text input `12px`, `--surface-2`, `--r-sm`
- Color dots: gray, green, blue, red, orange, purple, pink — `18px` circles, `2.5px border --text` when selected
- Add button: `--accent`; ✕ button: `--surface-2`
- `Enter` → commit; `Escape` → cancel

---

### 5. My Lists Panel

Left drawer. `position: fixed, top: 0, left: 0, bottom: 0`, `width: min(288px, 82vw)`, `z-index: 51`, `animation: slideInLeft 0.22s cubic-bezier(0.4,0,0.2,1)`. Backdrop at `z-index: 50`.

**Header:** `padding: 48px 20px 14px` (safe area top), `border-bottom`, title `22px/700/−0.4px`, close button top-right.

**List rows** (`padding: 10px 20px`, `gap: 12px`):
- 32×32px icon box (`--r-sm`): `--accent` bg + white icon when active; `--surface-2` bg + `--text-2` icon when inactive
- Name `14px/600`; subtitle `11px --text-2` showing item count
- Active row: `--accent-bg` bg, name in `--accent-fg`, checkmark on right

**Add new list** (bottom, `border-top`): dashed button → inline text input + "Add" button (`--accent`). `Enter` to confirm, `Escape` to cancel.

---

### 6. Share Modal

Centered modal. `max-width: 340px`, `--r-xl`, `padding: 24px`, backdrop `z-index: 60`.

- Header: list name + close button
- QR code area: `160×160px` white box, `border: 1px solid --border`, `--r-md` (use `qrcodejs` or equivalent)
- URL row: read-only text truncated + "Copy" button (`--accent`, turns green on copy for 2s)
- Share URL: encode list data as base64 in the URL hash (prototype pattern)

---

### 7. Categories Tab

Header: `"Categories"` + `"For 'List Name'"` subtitle + "Add" button.

When `selCatIds.size > 0`: a red "Delete N" button appears next to "Add".

**Category rows** (`padding: 11px 14px`, `--r-sm`):
- Selection checkbox (square, `--r-xs`) — disabled/hidden for default categories
- 10px color dot
- Name `14px/600`
- Item count `11px --text-2`
- "Default" badge (10px/700/UC, `--surface-2`) for protected categories; trash icon for custom ones

Default category names (protected): Produce, Meat, Dairy, Pantry, General.

**Empty state** (for new non-grocery lists): centered text, "No categories yet / This list has no categories."

---

### 8. Confirm Modal

Centered, `max-width: 320px`, `--r-xl`, `padding: 24px`. Backdrop at `z-index: 70`.
- Message text `15px/1.55`
- Two buttons: Cancel (`--surface-2`) + Delete (`oklch(52% 0.22 25)` red)

---

## Interactions & Animations

| Interaction | Spec |
|-------------|------|
| Panel slide-in (My Lists) | `translateX(-100%) → 0`, `0.22s cubic-bezier(0.4,0,0.2,1)` |
| Sheet slide-up (detail, modals) | `translateY(16px) opacity:0 → 0 opacity:1`, `0.2s ease-out` |
| Backdrop fade | `opacity 0 → 1`, `0.15s` |
| Progress bar fill | `width`, `0.5s cubic-bezier(0.4,0,0.2,1)` |
| Checkbox check | `background + border`, `0.15s` |
| Category chip select | `background + color`, `0.15s` |
| Swipe snap | `translateX`, `0.2s ease-out` on release; none during drag |
| Copy button | bg changes to green for 2s |
| Submit button | `background 0.15s` (accent ↔ surface-2) |

---

## Priority Sort Logic

Priority items always float to the top, before any category or custom sort:

```typescript
items.sort((a, b) => {
  if (a.priority && !b.priority) return -1;
  if (!a.priority && b.priority) return 1;
  // then apply category or custom sort
});
```

---

## Known Issues / TODOs

- [ ] **Dark mode bug** — remove `@custom-variant dark` line from `src/index.css` (see above)
- [ ] Touch drag-and-drop for mobile reordering (HTML5 drag API is desktop-only; use a touch drag library like `@dnd-kit/sortable`)
- [ ] Attachments: prototype only stores metadata; real implementation needs S3 via Amplify Storage
- [ ] Subtasks: currently stored as JSON on the `ListItem`; consider a separate `Subtask` model for querying
- [ ] Share URL: prototype encodes data client-side; real implementation needs a server-side share link with Amplify
- [ ] Multiple lists: requires new `ShoppingList` Amplify model + migration of existing single-list data
- [ ] QR code: prototype uses `qrcodejs` CDN; in production use `qrcode` npm package

---

## Files in This Package

| File | Description |
|------|-------------|
| `AirList Prototype.html` | Interactive prototype entry point (open in browser) |
| `AirList Design System.html` | Design token + component reference (open in browser) |
| `prototype/tokens.css` | All CSS custom properties (copy into `src/index.css`) |
| `prototype/shared.jsx` | ProgressBar, CategoryFilterBar, ListItemCard, BottomInputBar |
| `prototype/panels.jsx` | MyListsPanel, ShareModal, ItemModal, ConfirmModal, AddCategoryModal, ItemDetailPanel |
| `prototype/App.jsx` | Full app state + layout reference |

Open `AirList Prototype.html` in any browser for a live clickable demo.  
Open `AirList Design System.html` for the full token + component reference.
