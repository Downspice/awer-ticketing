---
name: ui-ux-audit
description: Comprehensive UI/UX heuristic audit, accessibility (a11y) review, and usability checklist. Use when evaluating interfaces, reviewing pull requests for UX flaws, checking accessibility compliance (WCAG 2.2 AA), detecting visual defects, and testing responsive mobile and desktop usability.
---

# UI & UX Audit & Heuristic Review Skill

This skill provides an actionable auditing framework based on Nielsen Norman Group 10 usability heuristics, WCAG 2.2 AA guidelines, and modern design system quality bars.

---

## 1. Usability Heuristics Checklist

1. **Visibility of System Status**:
   - Are loading spinners or skeletons present during network operations?
   - Is there immediate visual feedback when an action is performed (toast notification, active button state)?
   - Are drag-and-drop targets clearly marked when hovering over valid drop zones?

2. **Match Between System and Real World**:
   - Are status names intuitive (e.g. "Not Started", "In Progress", "On Hold", "Solved")?
   - Are icons universally recognized (e.g., search magnifying glass, filter funnel/sliders, alert triangle)?

3. **User Control and Freedom**:
   - Can users undo or cancel modals without saving?
   - Can filters be reset with a single click?
   - Are destructive actions guarded with confirmation dialogs?

4. **Consistency and Standards**:
   - Are colors, padding, button variants, and fonts consistent across pages?
   - Does dark mode have consistent contrast, card backgrounds, and border colors?

5. **Error Prevention and Handling**:
   - Are form validation errors displayed inline directly beneath the problematic input?
   - Are error messages constructive, explaining how to fix the issue rather than showing technical stack traces?

6. **Flexibility and Efficiency of Use**:
   - Are keyboard shortcuts supported (e.g., ESC to close modal, Enter to submit)?
   - Can users filter, search, and sort dense lists effortlessly?

7. **Aesthetic and Minimalist Design**:
   - Is visual clutter eliminated?
   - Are secondary actions deprioritized into dropdown menus or muted buttons?

---

## 2. Accessibility (a11y) Verification

- **Color Contrast**:
  - Normal text (< 18pt or < 14pt bold): minimum 4.5:1 ratio against background.
  - Large text (>= 18pt or >= 14pt bold): minimum 3:1 ratio.
  - UI components and graphical objects: minimum 3:1 ratio.
- **Keyboard Navigation**:
  - All interactive elements must be focusable via `Tab` / `Shift+Tab`.
  - Focus rings must be clearly visible (`focus-visible:ring-2 focus-visible:ring-ring`).
- **Screen Reader Support**:
  - Icon-only buttons must have `aria-label` or `<span className="sr-only">Label</span>`.
  - Modals and sheets must have accessible descriptions and titles (`DialogTitle`, `DialogDescription`).
