---
name: ui-ux-design
description: Master UI/UX design and frontend aesthetics guide. Use when designing, redesigning, styling, or improving user interfaces, design systems, visual hierarchy, theme systems (light/dark mode), component ergonomics, micro-interactions, and accessibility in modern React, Next.js, and Tailwind CSS applications.
---

# UI & UX Design System and Aesthetics Skill

This skill equips you to design, craft, and elevate user interfaces into world-class, accessible, and delightful experiences. Apply these principles whenever building, refactoring, or polishing user interfaces.

---

## 1. Visual Hierarchy & Spacing Rhythm

Every screen must have a clear focal point and natural reading path (F-pattern for dense dashboards, Z-pattern for landing pages).

- **Type Scale Rhythm**:
  - Page Titles: `text-2xl` or `text-3xl font-bold tracking-tight`
  - Section Headings: `text-lg` or `text-xl font-semibold`
  - Card Titles & Table Headers: `text-sm font-semibold` or `text-xs font-medium uppercase tracking-wider`
  - Body & Content: `text-sm leading-relaxed text-foreground`
  - Secondary/Meta Info: `text-xs text-muted-foreground`
- **Consistent Spacing Scale**:
  - Micro (gap between icon & text, badges): `gap-1.5` to `gap-2` (6px - 8px)
  - Card padding: `p-4` to `p-6` (16px - 24px)
  - Section spacing: `space-y-6` to `space-y-8` (24px - 32px)
  - Page gutters: `container mx-auto px-4 sm:px-6 lg:px-8`

---

## 2. Color Systems & Semantic Theming

Avoid raw hardcoded hex colors or harsh saturated backgrounds (like `bg-blue-50` or `bg-green-100` that wash out or clash in dark mode).

### Semantic Token Architecture
- **Backgrounds**:
  - `bg-background`: Main viewport surface
  - `bg-card` / `bg-card/80 backdrop-blur`: Card and panel surface
  - `bg-muted` / `bg-accent`: Pill, table header, or subtle control surface
- **Status Accents**:
  - **Not Started / Backlog**: Slate / Blue-gray (`text-slate-500`, `bg-slate-500/10 border-slate-500/20`)
  - **In Progress / Active**: Amber / Sky (`text-amber-500`, `bg-amber-500/10 border-amber-500/20`)
  - **On Hold / Blocked**: Violet / Purple (`text-purple-500`, `bg-purple-500/10 border-purple-500/20`)
  - **Completed / Solved**: Emerald / Green (`text-emerald-500`, `bg-emerald-500/10 border-emerald-500/20`)
  - **High Priority / Critical**: Rose / Crimson (`text-rose-500`, `bg-rose-500/10 border-rose-500/20`)

### Contrast & Legibility
- Maintain WCAG 2.2 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text).
- Never use bright uncalibrated text colors in dark mode. Foreground text must maintain soft high contrast (`hsl(210 40% 98%)` or `#f8fafc`).

---

## 3. Component Ergonomics

### Cards & Kanban Columns
- **Cards**:
  - Give cards subtle borders (`border border-border/60 hover:border-border transition-all`).
  - Subtle interactive elevations (`hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all`).
  - Add priority or category indicator pills with matching icon glyphs.
- **Kanban Columns**:
  - Clean column headers displaying status dot, title, and item count badge (`<Badge variant="secondary">{count}</Badge>`).
  - Highlighting droppable drop targets: apply smooth ring or background transition (`isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-muted/40'`).
  - Always render a friendly empty state when a column has zero items.

### Interactive Controls & Buttons
- **Touch & Click Targets**: Minimum 36x36px (preferably 40px for mobile touch).
- **Focus Rings**: Clear accessible focus indicator: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Loading Indicators**: Replace button content with a spinner and disabled state during async mutation; prevent duplicate submissions.

### Navigation & Routing
- Use Next.js `<Link>` for client-side navigation without full page reload flickers.
- Prominently highlight active navigation items with background pills (`bg-primary/10 text-primary font-medium`) and indicator lines/icons.

---

## 4. State Management in UX

Every interactive view must handle 5 essential UI states:
1. **Initial / Loading State**: Skeleton placeholders matching the real layout structure (avoid generic full-screen spinners).
2. **Success / Populated State**: Clean, readable data display with clear primary actions.
3. **Empty State**: An inviting illustration or icon, explanatory title, supportive description, and a primary CTA button.
4. **Error / Failed State**: Non-technical explanation of what happened, retry button, and clear fallback path.
5. **Partial / Filtered State**: When filters yield zero results, display a "No tickets match your filter" card with a "Reset Filters" action button.

---

## 5. Micro-interactions & Polish

- **Transitions**: Keep duration between 150ms and 250ms (`transition-all duration-200 ease-in-out`). Avoid sluggish animations (> 300ms).
- **Tooltips**: Add tooltips to icon-only buttons to explain what they do.
- **Avatars**: Display user initials with deterministic color tints or clean initials fallbacks.
- **Date Formatting**: Combine relative timestamps (e.g. "2 hours ago") with formatted absolute dates on hover tooltip.
