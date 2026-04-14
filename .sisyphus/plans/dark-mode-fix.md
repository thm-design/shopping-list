# Dark Mode Toggle Fix Plan

## TL;DR
> Fix broken dark mode toggle by removing problematic `@custom-variant` syntax in Tailwind CSS.

> **Deliverables**: Dark/light mode toggle works visually
> **Estimated Effort**: Trivial (2 min)
> **Critical Path**: Remove 1 line → Test

---

## Context

### Original Issue
- Toggling to light/dark mode doesn't visually change anything
- The `dark` class IS being added to `html` and `body` elements correctly
- The `:where()` syntax in the custom variant is causing zero-specificity issues

### Root Cause
In `src/index.css`, this line breaks dark mode:
```css
@custom-variant dark (&:where(.dark, [data-theme="dark"]) &);
```

- `:where()` has **zero specificity**, making styles easily overridden
- Tailwind v4 with `darkMode: 'class'` handles this natively - no custom variant needed

---

## Work Objective

**Core Objective**: Fix dark mode so toggling actually changes the visual theme.

---

## Verification Strategy

- User toggles theme button → UI changes between light/dark appearance
- No test infrastructure needed - manual visual verification

---

## TODOs

- [ ] 1. Remove problematic custom variant line

  **What to do**:
  - Open `src/index.css`
  - Delete line 1: `@custom-variant dark (&:where(.dark, [data-theme="dark"]) &);`
  
  **Acceptance Criteria**:
  - [ ] Line removed from src/index.css
  - [ ] Dark mode toggles visually when clicking theme button

---

## Commit Strategy

- **1**: `fix: remove broken custom-variant for dark mode` - src/index.css

---

## Success Criteria
- [ ] Dark/light mode toggle visually changes the app appearance