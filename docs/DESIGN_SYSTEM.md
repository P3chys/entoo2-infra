# Design System

## Overview

Entoo2 uses a modern, clean design inspired by Linear and GitHub. The design prioritizes readability, accessibility, and a seamless experience across light and dark modes.

## Color System

### Base Colors

The color palette uses CSS custom properties for easy theming.

#### Light Mode

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f6f8fa;
  --bg-tertiary: #f0f2f4;
  --bg-elevated: #ffffff;

  /* Borders */
  --border-default: #d0d7de;
  --border-muted: #e4e8ec;
  --border-strong: #8c959f;

  /* Text */
  --text-primary: #1f2328;
  --text-secondary: #656d76;
  --text-tertiary: #8b949e;
  --text-placeholder: #a1a9b1;

  /* Accent (Blue) */
  --accent-primary: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-muted: #dbeafe;
  --accent-text: #1e40af;

  /* Semantic */
  --success: #16a34a;
  --success-bg: #dcfce7;
  --warning: #ca8a04;
  --warning-bg: #fef9c3;
  --error: #dc2626;
  --error-bg: #fee2e2;
  --info: #0284c7;
  --info-bg: #e0f2fe;
}
```

#### Dark Mode

```css
[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --bg-elevated: #1c2128;

  /* Borders */
  --border-default: #30363d;
  --border-muted: #21262d;
  --border-strong: #484f58;

  /* Text */
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-tertiary: #6e7681;
  --text-placeholder: #484f58;

  /* Accent (Blue) */
  --accent-primary: #3b82f6;
  --accent-hover: #60a5fa;
  --accent-muted: #1e3a5f;
  --accent-text: #93c5fd;

  /* Semantic */
  --success: #22c55e;
  --success-bg: #0d3320;
  --warning: #eab308;
  --warning-bg: #3d3200;
  --error: #ef4444;
  --error-bg: #3d1010;
  --info: #38bdf8;
  --info-bg: #0c2d4a;
}
```

### Color Usage

| Element | Light | Dark |
|---------|-------|------|
| Page background | `--bg-primary` | `--bg-primary` |
| Cards | `--bg-secondary` | `--bg-secondary` |
| Modals | `--bg-elevated` | `--bg-elevated` |
| Primary text | `--text-primary` | `--text-primary` |
| Buttons | `--accent-primary` | `--accent-primary` |
| Links | `--accent-primary` | `--accent-primary` |
| Borders | `--border-default` | `--border-default` |

---

## Typography

### Font Stack

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 36px | 700 | 1.2 | Hero sections |
| H1 | 28px | 600 | 1.3 | Page titles |
| H2 | 24px | 600 | 1.3 | Section headers |
| H3 | 20px | 600 | 1.4 | Card titles |
| H4 | 16px | 600 | 1.4 | Subsections |
| Body | 14px | 400 | 1.5 | Default text |
| Small | 13px | 400 | 1.4 | Secondary text |
| Caption | 12px | 400 | 1.4 | Labels, hints |
| Tiny | 11px | 500 | 1.3 | Badges |

### CSS Classes

```css
.text-display { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.text-h1 { font-size: 1.75rem; font-weight: 600; line-height: 1.3; }
.text-h2 { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
.text-h4 { font-size: 1rem; font-weight: 600; line-height: 1.4; }
.text-body { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.text-small { font-size: 0.8125rem; font-weight: 400; line-height: 1.4; }
.text-caption { font-size: 0.75rem; font-weight: 400; line-height: 1.4; }
```

---

## Spacing

Use an 8px base grid for consistent spacing.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icons |
| `--space-2` | 8px | Default inline spacing |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Standard padding |
| `--space-5` | 20px | Medium gaps |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large gaps |
| `--space-10` | 40px | Page sections |
| `--space-12` | 48px | Major sections |
| `--space-16` | 64px | Page margins |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs, badges |
| `--radius-md` | 8px | Cards, dropdowns |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Feature cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

In dark mode, prefer borders over shadows.

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
}
```

---

## Animation

### Transitions

```css
:root {
  --transition-fast: 100ms ease;
  --transition-normal: 150ms ease;
  --transition-slow: 300ms ease;
}
```

### Hover Effects

```css
/* Subtle scale for interactive cards */
.card-interactive:hover {
  transform: scale(1.02);
  transition: transform var(--transition-normal);
}

/* Color transitions for buttons */
.btn:hover {
  background-color: var(--accent-hover);
  transition: background-color var(--transition-fast);
}
```

### Loading States

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 2s ease-in-out infinite;
  background: var(--bg-tertiary);
}
```

---

## Components

### Buttons

#### Primary Button

```html
<button class="btn btn-primary">
  Upload Document
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
}
```

#### Button Variants

| Variant | Usage |
|---------|-------|
| Primary | Main actions (Submit, Save) |
| Secondary | Secondary actions (Cancel) |
| Ghost | Tertiary actions, icon buttons |
| Danger | Destructive actions (Delete) |

### Input Fields

```html
<div class="input-group">
  <label class="input-label" for="email">Email</label>
  <input type="email" id="email" class="input" placeholder="your@email.com">
  <span class="input-hint">We'll never share your email</span>
</div>
```

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-muted);
}
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Subject Name</h3>
    <span class="badge">5 credits</span>
  </div>
  <div class="card-body">
    <p class="card-description">Subject description...</p>
  </div>
  <div class="card-footer">
    <span class="text-caption">12 documents</span>
  </div>
</div>
```

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-muted);
}

.card-body {
  padding: var(--space-4);
}

.card-footer {
  padding: var(--space-3) var(--space-4);
  background: var(--bg-tertiary);
}
```

### Badges

```html
<span class="badge badge-primary">PDF</span>
<span class="badge badge-success">Answered</span>
<span class="badge badge-warning">Pending</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: var(--radius-full);
}

.badge-primary {
  background: var(--accent-muted);
  color: var(--accent-text);
}

.badge-success {
  background: var(--success-bg);
  color: var(--success);
}
```

---

## Icons

Use [Lucide Icons](https://lucide.dev/) for consistency.

### Common Icons

| Icon | Usage |
|------|-------|
| `file-text` | Documents |
| `folder` | Subjects |
| `calendar` | Semesters |
| `search` | Search |
| `upload` | Upload |
| `download` | Download |
| `heart` | Favorite |
| `message-circle` | Comments |
| `help-circle` | Questions |
| `user` | Profile |
| `sun` / `moon` | Theme toggle |
| `globe` | Language |

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `sm` | 16px | Inline with text |
| `md` | 20px | Buttons, list items |
| `lg` | 24px | Headers, standalone |
| `xl` | 32px | Empty states |

---

## Layout

### Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}
```

### Grid

```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

---

## Breakpoints

| Name | Width | Devices |
|------|-------|---------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Accessibility

### Focus States

All interactive elements must have visible focus states:

```css
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

### Color Contrast

Minimum contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

### Motion

Respect reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## File Type Icons

| Extension | Color | Icon |
|-----------|-------|------|
| PDF | Red | `file-text` |
| DOCX, DOC | Blue | `file-text` |
| PPTX, PPT | Orange | `presentation` |
| XLSX, XLS | Green | `table` |
| TXT | Gray | `file` |
| Images | Purple | `image` |
