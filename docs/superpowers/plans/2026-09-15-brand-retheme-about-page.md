# Brand Retheme + About Page (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme the live Hap'n frontend to the official brand palette with a Gumroad-style UI, and add an `/about` page with Vision, Mission, Brand Story, and Incorporators.

**Architecture:** Palette and Gumroad tokens live in `src/index.css`; shared primitives (`.btn`, `.card`, `.pill`, `.band`, `.display`) live in `src/styles/ui.css`. Components keep their own CSS files and consume only tokens/primitives. `react-router-dom` provides `/` and `/about`; all brand copy lives in `src/content/about.js`.

**Tech Stack:** React 19.2, Vite 6.4, react-router-dom 7.13, plain CSS, Vitest 4.0 + jsdom 29 + React Testing Library 16, Node 22.15.

**Spec:** `docs/superpowers/specs/2026-09-15-brand-retheme-about-page-design.md`

## Global Constraints

- All commands run from `frontend/` using Git Bash unless stated otherwise.
- Official palette, the only hues allowed: `--light: #F8F5F6`, `--brand-red: #AF1C1C`, `--brand-crimson: #B10100`, `--brand-maroon: #8B0000`, `--ink: #000000`. Pure white `#FFFFFF` is not used.
- Hex color literals may appear only inside the `:root` block of `src/index.css`.
- Phase 1 files must not use `--gray-*`, `--shadow-sm/md/lg`, `--white`, `rgb()/rgba()/hsl()`, or the keyword `white`.
- Font: Poppins (already loaded in `index.html`).
- Casing: pills UPPERCASE (via `.pill`), headings authored lowercase (proper nouns like "MSMEs", "Davao City" keep capitals).
- Vision, Mission, and Brand Story copy is verbatim from the spec §6, including the fixed sentence "not only about what is being sold".
- Incorporator names are stored and shown exactly as given, uppercase, in this order: GWYNETH ANGEL NICOLE BAANG CENIZA, RENEE MARGAUX JAVIER RAMIREZ, TRISTAN JAMES CABILETE SINTOS, FERDINAND JOHN FRANCISCO DOBLI, HANS ZELMUR GERALDE LAGMAY, JAMILLE CABALIDA FORTADES, ANGELICA PAULA GO SHI, XANDER BARTOLOBA MONTERO.
- No Tailwind, no CSS override layer, no backend changes.
- Do not modify Phase 2 files: any `src/customer-pages/*` other than `HomePage.jsx`/`AboutPage.jsx`, `SellersLayout.*`, `RidersLayout.*`, `DeliveryMap.*`, `PageLayout.css`, `Toast.*`.
- Every commit message ends with the trailer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

**Theme check command** (referenced by several tasks; run from `frontend/`):

```bash
grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" <files>
```

Expected output for Phase 1 files: nothing (exit code 1).

---

### Task 1: Test tooling + `RichText`

Sets up Vitest and declares dependencies that the source already imports. `react-router-dom`, `leaflet`, and `react-leaflet` are in `node_modules` but missing from `package.json`, so any `npm install` would prune them. Declaring them here prevents that.

**Files:**
- Modify: `frontend/package.json`, `frontend/package-lock.json` (via npm)
- Modify: `frontend/vite.config.js`
- Create: `frontend/src/test/setup.js`
- Create: `frontend/src/components/RichText.jsx`
- Test: `frontend/src/components/RichText.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` (runs `vitest run`); default export `RichText({ text: string, as?: string = 'p', className?: string })` rendering `**bold**` segments as `<strong>`.

- [ ] **Step 1: Install dependencies**

```bash
npm install react-router-dom@^7.13.1 leaflet@^1.9.4 react-leaflet@^5.0.0
npm install -D vitest@~4.0.18 jsdom@^29.1.1 @testing-library/react@^16.3.3 @testing-library/dom@^10.4.2 @testing-library/jest-dom@^6.10.0
```

Expected: both finish without `ERR!`. `npm ls --depth=0` no longer lists anything as `extraneous`.

- [ ] **Step 2: Add the test script**

In `frontend/package.json`, replace the `scripts` block with:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Configure Vitest**

Replace `frontend/vite.config.js` with:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

Create `frontend/src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Write the failing test**

Create `frontend/src/components/RichText.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import RichText from './RichText';

describe('RichText', () => {
  it('renders **wrapped** segments as <strong>', () => {
    const { container } = render(<RichText text="go on, **make it hap’n!**" />);
    expect(container.querySelector('strong').textContent).toBe('make it hap’n!');
    expect(container.firstChild.textContent).toBe('go on, make it hap’n!');
  });

  it('renders a <p> by default and honors the as prop', () => {
    const { container, rerender } = render(<RichText text="plain" />);
    expect(container.firstChild.tagName).toBe('P');
    rerender(<RichText as="span" text="plain" />);
    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('passes className through', () => {
    const { container } = render(<RichText className="lead" text="x" />);
    expect(container.firstChild).toHaveClass('lead');
  });

  it('renders HTML-looking text literally', () => {
    const { container } = render(<RichText text="<script>alert(1)</script> **<b>x</b>**" />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.firstChild.textContent).toBe('<script>alert(1)</script> <b>x</b>');
  });

  it('renders an unmatched ** literally', () => {
    const { container } = render(<RichText text="a **b** c **d" />);
    expect(container.querySelectorAll('strong')).toHaveLength(1);
    expect(container.firstChild.textContent).toBe('a b c **d');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- src/components/RichText.test.jsx`
Expected: FAIL, `Failed to resolve import "./RichText"`.

- [ ] **Step 6: Write the implementation**

Create `frontend/src/components/RichText.jsx`:

```jsx
// Renders copy where **double asterisks** mark bold spans. Never injects HTML.
export default function RichText({ text, as: Tag = 'p', className }) {
  const parts = text.split('**');
  // An even number of parts means the last ** has no closing partner.
  const hasUnmatched = parts.length % 2 === 0;
  const lastIndex = parts.length - 1;

  const nodes = parts.map((part, i) => {
    if (hasUnmatched && i === lastIndex) return `**${part}`;
    if (i % 2 === 1) return <strong key={i}>{part}</strong>;
    return part;
  });

  return <Tag className={className}>{nodes}</Tag>;
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`
Expected: 5 passed in `RichText.test.jsx`.

- [ ] **Step 8: Verify the build still works**

Run: `npm run build`
Expected: `✓ built in …`, no errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/setup.js src/components/RichText.jsx src/components/RichText.test.jsx
git commit -m "Add Vitest tooling and RichText component" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Palette tokens + Gumroad primitives

**Files:**
- Modify: `frontend/src/index.css` (full replacement)
- Create: `frontend/src/styles/ui.css`
- Modify: `frontend/src/main.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--light --brand-red --brand-crimson --brand-maroon --ink --ink-muted --ink-subtle --light-muted --border --shadow-hard --shadow-hard-lg --radius --radius-lg --radius-pill --max-width --grain`; classes `.btn .btn-primary .btn-ghost .btn-sm .card .card-interactive .pill .band .band-inner .band-red .band-maroon .display .on-dark`. Global classes kept: `.section-header .section-tag .text-dark .text-accent .view-all`.

- [ ] **Step 1: Replace `src/index.css`**

```css
/* === Global Styles === */
:root {
  /* Official palette (brand guide, Figure 3.2) */
  --light: #F8F5F6;         /* Light Grayish Pink */
  --brand-red: #AF1C1C;     /* Red */
  --brand-crimson: #B10100; /* Dark Crimson */
  --brand-maroon: #8B0000;  /* Dark Red */
  --ink: #000000;           /* Black */

  /* Mixes of palette colors, not new hues */
  --ink-muted: color-mix(in srgb, var(--ink) 65%, var(--light));   /* secondary text on light */
  --ink-subtle: color-mix(in srgb, var(--ink) 20%, var(--light));  /* dividers only */
  --light-muted: color-mix(in srgb, var(--light) 70%, var(--ink)); /* secondary text on ink only */

  /* Aliases so existing references resolve to the palette */
  --primary: var(--brand-red);
  --primary-light: var(--brand-crimson);
  --primary-dark: var(--brand-maroon);
  --accent: var(--brand-crimson);
  --dark: var(--ink);
  --white: var(--light);

  /* Gumroad-style outlines and shadows */
  --border: 2px solid var(--ink);
  --shadow-hard: 4px 4px 0 var(--ink);
  --shadow-hard-lg: 8px 8px 0 var(--ink);
  --radius: 8px;
  --radius-lg: 8px;
  --radius-pill: 999px;
  --max-width: 1280px;

  /* Paper grain from the brand story artwork (black noise, no hex) */
  --grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

  /* Legacy tokens for Phase 2 pages only. Do not use in new code. */
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --gray-900: #212529;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--ink);
  background: var(--light);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
  border: none;
}

img {
  max-width: 100%;
  display: block;
}

:focus-visible {
  outline: 3px solid var(--brand-maroon);
  outline-offset: 2px;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* Section Spacing */
section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 28px;
}

.section-tag {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink-muted);
  margin-bottom: 4px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-dark { color: var(--ink); }
.text-accent { color: var(--brand-crimson); }

.view-all {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--brand-crimson);
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.view-all:hover { color: var(--brand-crimson); }
```

- [ ] **Step 2: Create `src/styles/ui.css`**

```css
/* ui.css: shared Gumroad-style primitives. Colors come only from index.css tokens. */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-hard);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--ink);
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--ink);
}

.btn-primary {
  background: var(--brand-red);
  color: var(--light);
}

.btn-ghost {
  background: var(--light);
  color: var(--ink);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 13px;
}

.card {
  background: var(--light);
  border: var(--border);
  border-radius: var(--radius);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card-interactive:hover {
  transform: translate(-4px, -4px);
  box-shadow: var(--shadow-hard-lg);
}

.pill {
  display: inline-block;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-maroon);
  background: var(--light);
  border: var(--border);
  border-radius: var(--radius-pill);
}

/* Full-bleed colored section. Overrides the global section max-width/padding. */
.band {
  max-width: none;
  margin: 0;
  padding: 72px 0;
}

.band-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.band-red {
  background: var(--grain), var(--brand-red);
  color: var(--light);
}

.band-maroon {
  background: var(--grain), var(--brand-maroon);
  color: var(--light);
}

.display {
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.band-red :focus-visible,
.band-maroon :focus-visible,
.on-dark :focus-visible {
  outline-color: var(--light);
}

@media (prefers-reduced-motion: reduce) {
  .btn,
  .card {
    transition: box-shadow 0.15s ease;
  }

  .btn:hover,
  .btn:active,
  .card-interactive:hover {
    transform: none;
  }
}
```

- [ ] **Step 3: Load global CSS before components**

Replace `frontend/src/main.jsx` with the version below. Global CSS is imported before `App` so component stylesheets load later in the cascade and can override primitives.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/ui.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 4: Run the theme checks**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/styles/ui.css`
Expected: no output.

Run: `awk '/^:root/{r=1} r&&/^}/{r=0;next} !r' src/index.css | grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\("`
Expected: no output (all literals are inside `:root`).

- [ ] **Step 5: Verify tests and build**

Run: `npm test && npm run build`
Expected: all tests pass; build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/styles/ui.css src/main.jsx
git commit -m "Add brand palette tokens and Gumroad-style UI primitives" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `Incorporators` component

**Files:**
- Create: `frontend/src/components/Incorporators.jsx`
- Create: `frontend/src/components/Incorporators.css`
- Test: `frontend/src/components/Incorporators.test.jsx`

**Interfaces:**
- Consumes: `.card`, `--grain`, `--brand-red`, `--light`, `--ink-muted`, `--border`, `--radius`, `--shadow-hard` (Task 2).
- Produces: default export `Incorporators({ people: Array<{ name: string, role?: string, photo?: string }> })`; named export `getInitials(name: string): string`. Each person renders as `<li>` containing `.incorporator-name` and, if present, `.incorporator-role`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/Incorporators.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import Incorporators, { getInitials } from './Incorporators';

describe('getInitials', () => {
  it('uses the first letters of the first and last words', () => {
    expect(getInitials('TRISTAN JAMES CABILETE SINTOS')).toBe('TS');
  });

  it('uses one letter for a single-word name', () => {
    expect(getInitials('Cher')).toBe('C');
  });

  it('ignores extra whitespace and uppercases', () => {
    expect(getInitials('  ana   de  cruz ')).toBe('AC');
  });
});

describe('Incorporators', () => {
  it('shows a coming-soon card when the list is empty', () => {
    render(<Incorporators people={[]} />);
    expect(screen.getByText('meet the team soon')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('renders people in the given order', () => {
    render(<Incorporators people={[{ name: 'B PERSON' }, { name: 'A PERSON' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('B PERSON');
    expect(items[1]).toHaveTextContent('A PERSON');
  });

  it('shows a photo with the name as alt text when photo is set', () => {
    render(<Incorporators people={[{ name: 'JANE DOE', photo: '/team/jane.jpg' }]} />);
    expect(screen.getByRole('img', { name: 'JANE DOE' })).toHaveAttribute('src', '/team/jane.jpg');
    expect(screen.queryByText('JD')).toBeNull();
  });

  it('shows initials when there is no photo', () => {
    render(<Incorporators people={[{ name: 'TRISTAN JAMES CABILETE SINTOS' }]} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('shows the role only when present', () => {
    render(<Incorporators people={[{ name: 'WITH ROLE', role: 'Treasurer' }, { name: 'NO ROLE' }]} />);
    expect(screen.getByText('Treasurer')).toBeInTheDocument();
    const [, second] = screen.getAllByRole('listitem');
    expect(second.querySelector('.incorporator-role')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/Incorporators.test.jsx`
Expected: FAIL, `Failed to resolve import "./Incorporators"`.

- [ ] **Step 3: Write the component**

Create `frontend/src/components/Incorporators.jsx`:

```jsx
import './Incorporators.css';

export function getInitials(name) {
  const words = name.trim().split(/\s+/);
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Incorporators({ people }) {
  if (people.length === 0) {
    return (
      <div className="card incorporators-empty">
        <p>meet the team soon</p>
      </div>
    );
  }

  return (
    <ol className="incorporators-grid">
      {people.map((person) => (
        <li key={person.name} className="card incorporator-card">
          {person.photo ? (
            <img className="incorporator-photo" src={person.photo} alt={person.name} />
          ) : (
            <span className="incorporator-initials" aria-hidden="true">
              {getInitials(person.name)}
            </span>
          )}
          <div className="incorporator-text">
            <p className="incorporator-name">{person.name}</p>
            {person.role && <p className="incorporator-role">{person.role}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Write the styles**

Create `frontend/src/components/Incorporators.css`:

```css
/* Incorporators.css */
.incorporators-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.incorporator-card {
  padding: 20px;
  box-shadow: var(--shadow-hard);
}

.incorporator-photo,
.incorporator-initials {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
}

.incorporator-photo {
  object-fit: cover;
}

.incorporator-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--grain), var(--brand-red);
  color: var(--light);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.incorporator-name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.incorporator-role {
  margin-top: 4px;
  font-size: 13px;
  color: var(--ink-muted);
}

.incorporators-empty {
  padding: 40px 24px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  box-shadow: var(--shadow-hard);
}

@media (max-width: 1023px) {
  .incorporators-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 479px) {
  .incorporators-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .incorporator-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
  }

  .incorporator-photo,
  .incorporator-initials {
    width: 64px;
    flex-shrink: 0;
    margin-bottom: 0;
  }

  .incorporator-initials {
    font-size: 22px;
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/components/Incorporators.test.jsx`
Expected: 8 passed.

- [ ] **Step 6: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/Incorporators.*`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/components/Incorporators.jsx src/components/Incorporators.css src/components/Incorporators.test.jsx
git commit -m "Add Incorporators component with initials fallback" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Brand content + `AboutPage`

**Files:**
- Create: `frontend/src/content/about.js`
- Create: `frontend/src/customer-pages/AboutPage.jsx`
- Create: `frontend/src/customer-pages/AboutPage.css`
- Test: `frontend/src/customer-pages/AboutPage.test.jsx`

**Interfaces:**
- Consumes: `RichText` (Task 1); `Incorporators` (Task 3); `.band .band-inner .band-red .pill .display .card` and tokens (Task 2).
- Produces: named exports from `src/content/about.js`: `aboutHero { pill, heading, subheading }`, `vision { label, text }`, `mission { label, text }`, `brandStory { heading, tagline, paragraphs: string[], signoff }`, `homeBand { tagline, text, cta }`, `incorporators: Array<{ name, role?, photo? }>`. Default export `AboutPage()` (no props).

- [ ] **Step 1: Create the content file**

Create `frontend/src/content/about.js`:

```js
// All brand copy for the About page and the home brand band.
// Bold spans use **double asterisks** and are rendered by <RichText />.

export const aboutHero = {
  pill: "About Hap'n",
  heading: 'go on, make it hap’n!',
  subheading: 'A digital platform where Davao’s local entrepreneurs, small businesses, and dreamers are seen, supported, and celebrated.',
};

export const vision = {
  label: 'Vision',
  text: "At Hap'n, we aim to be Davao City’s go-to e-commerce platform, creating an engaging and convenient digital marketplace that seamlessly connects MSMEs with consumers.",
};

export const mission = {
  label: 'Mission',
  text: "Hap'n is a digital tool for buying and selling. Leveraging technological trends, the application features convenient transactions for merchants and online consumers in Davao City. The company provides all-round opportunities for seller’s market visibility, customer base, and endorsements through low selling fees and minimal registration requirements. Through these, we help small businesses establish a foothold in the competitive market.",
};

export const brandStory = {
  heading: 'brand story',
  tagline: 'gikan diri, para diri.',
  paragraphs: [
    'Davao is built on people with loud dreams, brave beginnings, and a deep desire to create something of their own. That is where our mission lives. Rooted in the city it calls home, **Hap’n is a digital platform dedicated to creating a space where local entrepreneurs, small businesses, and dreamers are seen, supported, and celebrated.**',
    'With every merchant and product, we contribute to a larger narrative of the city’s progress. Because when we choose to uplift what is ours, we create opportunities that stay, grow, and thrive within the community and beyond. Here, it is not only about what is being sold, but about what is being built together.',
  ],
  signoff: 'So, then we say: **go on, make it hap’n!**',
};

export const homeBand = {
  tagline: 'gikan diri, para diri.',
  text: 'Hap’n helps Davao’s small businesses be seen, supported, and celebrated.',
  cta: 'our story',
};

// In the owner's order. Each entry: { name, role?, photo? }.
// Photos, when added, go in frontend/public/team/ and are referenced as '/team/<file>'.
export const incorporators = [
  { name: 'GWYNETH ANGEL NICOLE BAANG CENIZA' },
  { name: 'RENEE MARGAUX JAVIER RAMIREZ' },
  { name: 'TRISTAN JAMES CABILETE SINTOS' },
  { name: 'FERDINAND JOHN FRANCISCO DOBLI' },
  { name: 'HANS ZELMUR GERALDE LAGMAY' },
  { name: 'JAMILLE CABALIDA FORTADES' },
  { name: 'ANGELICA PAULA GO SHI' },
  { name: 'XANDER BARTOLOBA MONTERO' },
];
```

- [ ] **Step 2: Write the failing test**

Create `frontend/src/customer-pages/AboutPage.test.jsx`. Names are hard-coded here on purpose so a content edit that breaks the owner's order fails the test.

```jsx
import { render, screen } from '@testing-library/react';
import AboutPage from './AboutPage';
import { vision, mission } from '../content/about';

describe('AboutPage', () => {
  it('has a single h1 with the hero heading', () => {
    render(<AboutPage />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('go on, make it hap’n!');
  });

  it('shows the vision and mission statements with their labels', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Vision' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Mission' })).toBeInTheDocument();
    expect(screen.getByText(vision.text)).toBeInTheDocument();
    expect(screen.getByText(mission.text)).toBeInTheDocument();
  });

  it('shows the brand story with the typo fixed and bold highlights', () => {
    const { container } = render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'brand story' })).toBeInTheDocument();
    expect(screen.getByText('gikan diri, para diri.')).toBeInTheDocument();
    expect(screen.getByText(/not only about what is being sold/)).toBeInTheDocument();
    expect(screen.queryByText(/what it is being sold/)).toBeNull();
    const bold = [...container.querySelectorAll('.about-story strong')].map((el) => el.textContent);
    expect(bold).toContain('go on, make it hap’n!');
  });

  it('lists all eight incorporators in order', () => {
    render(<AboutPage />);
    const names = screen
      .getAllByRole('listitem')
      .map((li) => li.querySelector('.incorporator-name').textContent);
    expect(names).toEqual([
      'GWYNETH ANGEL NICOLE BAANG CENIZA',
      'RENEE MARGAUX JAVIER RAMIREZ',
      'TRISTAN JAMES CABILETE SINTOS',
      'FERDINAND JOHN FRANCISCO DOBLI',
      'HANS ZELMUR GERALDE LAGMAY',
      'JAMILLE CABALIDA FORTADES',
      'ANGELICA PAULA GO SHI',
      'XANDER BARTOLOBA MONTERO',
    ]);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/customer-pages/AboutPage.test.jsx`
Expected: FAIL, `Failed to resolve import "./AboutPage"`.

- [ ] **Step 4: Write the page**

Create `frontend/src/customer-pages/AboutPage.jsx`:

```jsx
import RichText from '../components/RichText';
import Incorporators from '../components/Incorporators';
import { aboutHero, vision, mission, brandStory, incorporators } from '../content/about';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="band band-red about-hero">
        <div className="band-inner">
          <span className="pill">{aboutHero.pill}</span>
          <h1 className="display about-hero-heading">{aboutHero.heading}</h1>
          <p className="about-hero-sub">{aboutHero.subheading}</p>
        </div>
      </section>

      <section className="about-statements">
        {[vision, mission].map((statement) => (
          <article key={statement.label} className="card about-statement">
            <h2 className="pill">{statement.label}</h2>
            <p>{statement.text}</p>
          </article>
        ))}
      </section>

      <section className="band about-story">
        <div className="band-red about-story-panel">
          <div className="about-story-inner">
            <h2 className="display about-story-heading">{brandStory.heading}</h2>
            <p className="about-story-tagline">{brandStory.tagline}</p>
            {brandStory.paragraphs.map((paragraph, i) => (
              <RichText key={i} text={paragraph} />
            ))}
            <RichText className="about-story-signoff" text={brandStory.signoff} />
          </div>
        </div>
      </section>

      <section className="about-team">
        <span className="pill">Incorporators</span>
        <h2 className="display about-team-heading">the people behind hap’n</h2>
        <Incorporators people={incorporators} />
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Write the page styles**

Create `frontend/src/customer-pages/AboutPage.css`:

```css
/* AboutPage.css */
.about-hero {
  padding-block: 96px 88px;
}

.about-hero-heading {
  margin: 20px 0 16px;
  font-size: clamp(40px, 7vw, 76px);
}

.about-hero-sub {
  max-width: 620px;
  font-size: 18px;
  line-height: 1.7;
}

.about-statements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 72px 24px 32px;
}

.about-statement {
  padding: 32px;
  background: var(--grain), var(--brand-maroon);
  color: var(--light);
  box-shadow: var(--shadow-hard);
}

.about-statement .pill {
  margin-bottom: 20px;
}

.about-statement p {
  font-size: 17px;
  line-height: 1.75;
}

.about-story {
  padding-block: 48px;
}

/* Red panel flush to the left edge, paper showing on the right (brand story artwork). */
.about-story-panel {
  width: 80%;
  border: var(--border);
  border-left: none;
  border-radius: 0 var(--radius) var(--radius) 0;
  box-shadow: var(--shadow-hard-lg);
}

.about-story-inner {
  max-width: 768px;
  padding: 64px 24px;
  margin-left: max(0px, calc((100vw - var(--max-width)) / 2));
}

.about-story-heading {
  font-size: clamp(36px, 5vw, 56px);
  margin-bottom: 20px;
}

.about-story-inner p {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 18px;
}

.about-story-inner .about-story-tagline {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.about-story-inner .about-story-signoff {
  margin: 28px 0 0;
}

.about-team {
  padding: 48px 24px 96px;
}

.about-team-heading {
  font-size: clamp(32px, 4.5vw, 48px);
  margin: 16px 0 32px;
}

@media (max-width: 767px) {
  .about-hero {
    padding-block: 64px 56px;
  }

  .about-hero-sub {
    font-size: 16px;
  }

  .about-statements {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 48px;
  }

  .about-statement {
    padding: 24px;
  }

  .about-story-panel {
    width: 100%;
    border-right: none;
    border-radius: 0;
    box-shadow: none;
  }

  .about-story-inner {
    padding: 48px 24px;
    margin-left: 0;
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/customer-pages/AboutPage.test.jsx`
Expected: 4 passed.

- [ ] **Step 7: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/customer-pages/AboutPage.* src/content/about.js`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add src/content/about.js src/customer-pages/AboutPage.jsx src/customer-pages/AboutPage.css src/customer-pages/AboutPage.test.jsx
git commit -m "Add About page with vision, mission, brand story, incorporators" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Routing, `HomePage`, `ScrollToTop`, `BrandBand`

**Files:**
- Modify: `frontend/src/main.jsx`
- Modify: `frontend/src/App.jsx` (full replacement)
- Create: `frontend/src/customer-pages/HomePage.jsx`
- Create: `frontend/src/components/ScrollToTop.jsx`
- Create: `frontend/src/components/BrandBand.jsx`
- Create: `frontend/src/components/BrandBand.css`
- Test: `frontend/src/App.test.jsx`
- Test: `frontend/src/components/BrandBand.test.jsx`

**Interfaces:**
- Consumes: `AboutPage` and `homeBand` (Task 4); `.band .band-red .band-inner .display .btn .btn-ghost` (Task 2); existing `Hero`, `Categories`, `PromoBanners`, `FeaturedProducts`, `CountdownBanner`, `DealsOfDay`, `Navbar`, `Footer`.
- Produces: `App` (expects to be rendered inside a router); routes `/`, `/about`, `*` → `/`; default exports `HomePage()`, `ScrollToTop()`, `BrandBand()`.

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/BrandBand.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BrandBand from './BrandBand';
import { homeBand } from '../content/about';

describe('BrandBand', () => {
  it('shows the tagline and text and links to the about page', () => {
    render(
      <MemoryRouter>
        <BrandBand />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 2, name: homeBand.tagline })).toBeInTheDocument();
    expect(screen.getByText(homeBand.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our story/ })).toHaveAttribute('href', '/about');
  });
});
```

Create `frontend/src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./api', () => {
  const offline = () => Promise.reject(new Error('offline'));
  return {
    default: {},
    getCategories: offline,
    getProducts: offline,
    getFeaturedProducts: offline,
    getDeals: offline,
    getUpcomingEvents: offline,
  };
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App routes', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the home page at /', async () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: /discover local gems/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our story/ })).toBeInTheDocument();
    expect(await screen.findByText('Dried Mango Pack')).toBeInTheDocument();
  });

  it('renders the about page at /about', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { level: 2, name: 'brand story' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /discover local gems/i })).toBeNull();
  });

  it('redirects unknown paths to home', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { level: 1, name: /discover local gems/i })).toBeInTheDocument();
  });

  it('scrolls to the top when the page renders', () => {
    renderAt('/about');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/App.test.jsx src/components/BrandBand.test.jsx`
Expected: FAIL. `BrandBand.test.jsx` cannot resolve `./BrandBand`; `App.test.jsx` fails because the current `App` has no routes (the `/about` test finds no "brand story" heading).

- [ ] **Step 3: Create `ScrollToTop`**

Create `frontend/src/components/ScrollToTop.jsx`:

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

- [ ] **Step 4: Create `BrandBand`**

Create `frontend/src/components/BrandBand.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { homeBand } from '../content/about';
import './BrandBand.css';

export default function BrandBand() {
  return (
    <section className="band band-red brand-band">
      <div className="band-inner brand-band-inner">
        <div>
          <h2 className="display brand-band-tagline">{homeBand.tagline}</h2>
          <p className="brand-band-text">{homeBand.text}</p>
        </div>
        <Link to="/about" className="btn btn-ghost">
          {homeBand.cta} <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
```

Create `frontend/src/components/BrandBand.css`:

```css
/* BrandBand.css */
.brand-band {
  margin-block: 40px;
  border-block: var(--border);
}

.brand-band-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.brand-band-tagline {
  font-size: clamp(32px, 5vw, 56px);
  margin-bottom: 8px;
}

.brand-band-text {
  max-width: 560px;
  font-size: 17px;
}

@media (max-width: 767px) {
  .brand-band-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

- [ ] **Step 5: Create `HomePage`**

Create `frontend/src/customer-pages/HomePage.jsx`:

```jsx
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import BrandBand from '../components/BrandBand';
import PromoBanners from '../components/PromoBanners';
import FeaturedProducts from '../components/FeaturedProducts';
import CountdownBanner from '../components/CountdownBanner';
import DealsOfDay from '../components/DealsOfDay';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <BrandBand />
      <PromoBanners />
      <FeaturedProducts />
      <CountdownBanner />
      <DealsOfDay />
    </>
  );
}
```

- [ ] **Step 6: Turn `App` into the routed shell**

Replace `frontend/src/App.jsx`:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './customer-pages/HomePage';
import AboutPage from './customer-pages/AboutPage';

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 7: Mount the router**

Replace `frontend/src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/ui.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test`
Expected: all test files pass (RichText, Incorporators, AboutPage, BrandBand, App).

- [ ] **Step 9: Build and theme check**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/BrandBand.* src/components/ScrollToTop.jsx src/customer-pages/HomePage.jsx`
Expected: no output.

- [ ] **Step 10: Commit**

```bash
git add src/main.jsx src/App.jsx src/App.test.jsx src/customer-pages/HomePage.jsx src/components/ScrollToTop.jsx src/components/BrandBand.jsx src/components/BrandBand.css src/components/BrandBand.test.jsx
git commit -m "Add routing for home and about pages with home brand band" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Navbar + Footer

**Files:**
- Modify: `frontend/src/components/Navbar.jsx` (full replacement)
- Modify: `frontend/src/components/Navbar.css` (full replacement)
- Modify: `frontend/src/components/Footer.jsx` (full replacement)
- Modify: `frontend/src/components/Footer.css` (full replacement)
- Test: `frontend/src/components/Navbar.test.jsx`
- Test: `frontend/src/components/Footer.test.jsx`

**Interfaces:**
- Consumes: router context (Task 5); tokens and `.on-dark` (Task 2).
- Produces: Navbar wordmark link (`aria-label="hap'n! home"`, `href="/"`); `NavLink`s "Home" (`/`, `end`) and "About" (`/about`) with `aria-current="page"` and class `active` when current; Footer links "About Hap'n" → `/about`, "Home" → `/`, Instagram → `https://www.instagram.com/hapn.co/`.

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/Navbar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  it('links the wordmark home', () => {
    renderAt('/about');
    expect(screen.getByRole('link', { name: "hap'n! home" })).toHaveAttribute('href', '/');
  });

  it('has Home and About links', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('marks only the current page link as active', () => {
    renderAt('/about');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('does not render the lightning emoji', () => {
    const { container } = renderAt('/');
    expect(container.textContent).not.toContain('⚡');
  });
});
```

Create `frontend/src/components/Footer.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('links to the about and home pages', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: "About Hap'n" })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('links to the Instagram account', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/hapn.co/'
    );
  });

  it('does not render the lightning emoji', () => {
    const { container } = renderFooter();
    expect(container.textContent).not.toContain('⚡');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/Navbar.test.jsx src/components/Footer.test.jsx`
Expected: FAIL. No link named "hap'n! home", no "About" link, no "About Hap'n" link, and the emoji is present.

- [ ] **Step 3: Replace `Navbar.jsx`**

```jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const categoryLinks = ['Apparel', 'Food & Snacks', 'Stationery', 'Crafts', 'Accessories', 'Home & Living', 'Events'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-brand" aria-label="hap'n! home" onClick={closeMenu}>
          <span className="brand-name">hap'n!</span>
        </Link>

        <div className="navbar-search">
          <span className="search-label">All Categories</span>
          <input
            type="text"
            aria-label="Search"
            placeholder="Search for products, merchants, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" aria-label="Search">
            <FiSearch />
          </button>
        </div>

        <div className="navbar-actions">
          <button className="action-btn" aria-label="Account"><FiUser /><span>Account</span></button>
          <button className="action-btn" aria-label="Wishlist"><FiHeart /><span>Wishlist</span></button>
          <button className="action-btn cart-btn" aria-label="Cart">
            <FiShoppingCart />
            <span>Cart</span>
            <span className="cart-badge">0</span>
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <nav className={`navbar-categories ${menuOpen ? 'open' : ''}`} aria-label="Main">
        <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
        {categoryLinks.map((cat) => (
          <a key={cat} href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`} className="nav-link">
            {cat}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Replace `Navbar.css`**

```css
/* Navbar.css */
.navbar {
  background: var(--light);
  border-bottom: var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-top {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 24px;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--brand-crimson);
}

.navbar-search {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: stretch;
  background: var(--light);
  border: var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  max-width: 600px;
  transition: box-shadow 0.15s ease;
}

.navbar-search:focus-within {
  box-shadow: var(--shadow-hard);
}

.search-label {
  display: none;
  align-items: center;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  border-right: var(--border);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .search-label { display: flex; }
}

.navbar-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  color: var(--ink);
}

.navbar-search input::placeholder {
  color: var(--ink-muted);
}

.search-btn {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 18px;
  background: var(--brand-red);
  color: var(--light);
  border-left: var(--border);
  transition: background 0.15s ease;
}

.search-btn:hover {
  background: var(--brand-maroon);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  color: var(--ink);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: var(--radius);
  transition: border-color 0.15s ease;
}

.action-btn:hover {
  border-color: var(--ink);
}

.action-btn svg {
  font-size: 20px;
}

.action-btn span {
  display: none;
}

@media (min-width: 1024px) {
  .action-btn span { display: inline; }
}

.cart-btn {
  position: relative;
}

.cart-badge {
  display: flex !important;
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  background: var(--brand-red);
  color: var(--light);
  border: var(--border);
  border-radius: 50%;
}

.mobile-menu-btn {
  display: flex;
  background: none;
  font-size: 24px;
  color: var(--ink);
  padding: 8px;
}

@media (min-width: 768px) {
  .mobile-menu-btn { display: none; }
}

@media (max-width: 767px) {
  .navbar-actions { display: none; }
}

.navbar-categories {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  padding: 0 24px;
  border-top: 1px solid var(--ink-subtle);
  overflow-x: auto;
}

@media (max-width: 767px) {
  .navbar-categories {
    display: none;
    flex-direction: column;
    padding: 8px 24px;
  }

  .navbar-categories.open {
    display: flex;
  }
}

.nav-link {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.nav-link:hover {
  color: var(--brand-crimson);
  border-bottom-color: var(--brand-crimson);
}

.nav-link.active {
  font-weight: 700;
  color: var(--brand-crimson);
  border-bottom-color: var(--brand-crimson);
}
```

- [ ] **Step 5: Replace `Footer.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="footer-brand">hap'n!</h3>
          <p>Bridging MSMEs and consumers in Davao City. Discover local gems, attend events, and support small businesses.</p>
        </div>
        <div className="footer-col">
          <h4>quick links</h4>
          <Link to="/about">About Hap'n</Link>
          <Link to="/">Home</Link>
          <a href="#products">Products</a>
          <a href="#events">Events</a>
          <a href="#merchants">Merchants</a>
        </div>
        <div className="footer-col">
          <h4>categories</h4>
          <a href="#">Apparel</a>
          <a href="#">Food & Snacks</a>
          <a href="#">Stationery</a>
          <a href="#">Crafts</a>
        </div>
        <div className="footer-col">
          <h4>follow us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="https://www.instagram.com/hapn.co/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
            </a>
          </div>
          <p className="footer-email">hello@hapn.ph</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Hap'n! All rights reserved. Davao City, Philippines.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Replace `Footer.css`**

```css
/* Footer.css */
.footer {
  margin-top: auto;
  background: var(--ink);
  color: var(--light-muted);
  border-top: 8px solid var(--brand-red);
}

.footer-grid {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 60px 24px 40px;
}

.footer-brand {
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--light);
}

.footer-col h4 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
  color: var(--light);
}

.footer-col p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--light-muted);
}

.footer-col a {
  display: block;
  width: fit-content;
  padding: 4px 0;
  font-size: 14px;
  color: var(--light-muted);
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: var(--light);
}

.social-links {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-col .social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  color: var(--light);
  border: 2px solid var(--light);
  border-radius: 50%;
  transition: background 0.15s ease;
}

.footer-col .social-links a:hover {
  background: var(--brand-red);
}

.footer-email {
  font-size: 14px;
}

.footer-bottom {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 20px 24px;
  border-top: 1px solid var(--ink-muted);
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: var(--light-muted);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding: 40px 24px 24px;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`
Expected: all test files pass, including 4 Navbar and 3 Footer tests.

- [ ] **Step 8: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/Navbar.* src/components/Footer.*`
Expected: no output. (`href="#products"` etc. do not match: they are not 3–8 hex characters followed by a word boundary.)

- [ ] **Step 9: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css src/components/Navbar.test.jsx src/components/Footer.jsx src/components/Footer.css src/components/Footer.test.jsx
git commit -m "Restyle navbar and footer and link the about page" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Hero, Categories, PromoBanners

**Files:**
- Modify: `frontend/src/components/Hero.jsx`, `Hero.css` (full replacements)
- Modify: `frontend/src/components/Categories.jsx:33-50` (JSX return block), `Categories.css` (full replacement)
- Modify: `frontend/src/components/PromoBanners.jsx`, `PromoBanners.css` (full replacements)
- Test: `frontend/src/components/HomeSections.test.jsx`

**Interfaces:**
- Consumes: `.btn .btn-primary .btn-ghost .card .card-interactive .pill .display .on-dark`, tokens (Task 2).
- Produces: Hero `h1.display` text "discover local gems from MSMEs in Davao City" (App test from Task 5 matches `/discover local gems/i`).

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/HomeSections.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import Categories from './Categories';
import PromoBanners from './PromoBanners';

vi.mock('../api', () => ({
  getCategories: () => Promise.reject(new Error('offline')),
}));

describe('Hero', () => {
  it('uses a lowercase display heading with MSMEs highlighted', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('display');
    expect(h1).toHaveTextContent('discover local gems from MSMEs in Davao City');
    expect(screen.getByText('MSMEs')).toHaveClass('highlight');
  });

  it('renders a primary button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: 'Shop Now' })).toHaveClass('btn', 'btn-primary');
  });
});

describe('Categories', () => {
  it('uses a lowercase heading and renders fallback categories as interactive cards', async () => {
    render(<Categories />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('featured categories');
    const apparel = await screen.findByText('Apparel');
    expect(apparel.closest('.category-card')).toHaveClass('card', 'card-interactive');
  });
});

describe('PromoBanners', () => {
  it('uses pill badges, lowercase headings, and Gumroad buttons', () => {
    render(<PromoBanners />);
    expect(screen.getByText('Up to 20% Off')).toHaveClass('pill');
    expect(screen.getByText('Bazaar Specials')).toHaveClass('pill');
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('support localMSME products');
    expect(headings[1]).toHaveTextContent('fresh finds,pure quality');
    const buttons = screen.getAllByRole('button', { name: /shop now/i });
    expect(buttons[0]).toHaveClass('btn', 'btn-ghost');
    expect(buttons[1]).toHaveClass('btn', 'btn-primary');
  });
});
```

(`<br />` contributes no text, so "support local" and "MSME products" join without a space in `textContent`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/HomeSections.test.jsx`
Expected: FAIL. The heading text is "Discover local gems…", there is no `display` class, and buttons lack `btn`.

- [ ] **Step 3: Replace `Hero.jsx`**

```jsx
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="display">
          discover local gems from <span className="highlight">MSMEs</span> in Davao City
        </h1>
        <p className="hero-subtitle">
          Shop unique products from local merchants, attend events, and support small businesses — all in one platform.
        </p>
        <button className="btn btn-primary hero-btn">Shop Now</button>
      </div>
      <div className="hero-image" aria-hidden="true">
        <div className="card hero-card">
          <span className="hero-emoji">🛍️</span>
          <span className="hero-tagline">hap'n!</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace `Hero.css`**

```css
/* Hero.css */
.hero {
  display: flex;
  align-items: center;
  gap: 48px;
  min-height: 420px;
  padding: 72px 24px;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  margin-bottom: 16px;
  font-size: clamp(36px, 5vw, 56px);
  color: var(--ink);
}

.hero-content .highlight {
  color: var(--brand-crimson);
}

.hero-subtitle {
  max-width: 460px;
  margin-bottom: 32px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--ink-muted);
}

.hero-btn {
  padding: 14px 32px;
  font-size: 16px;
}

.hero-image {
  flex: 0.8;
  display: flex;
  justify-content: center;
}

.hero-card {
  width: 340px;
  max-width: 100%;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--grain), var(--brand-red);
  box-shadow: var(--shadow-hard-lg);
}

.hero-emoji {
  font-size: 72px;
}

.hero-tagline {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--light);
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 48px 24px;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-card {
    width: 260px;
    height: 200px;
    box-shadow: var(--shadow-hard);
  }

  .hero-emoji { font-size: 52px; }
  .hero-tagline { font-size: 30px; }
}
```

- [ ] **Step 5: Update the `Categories.jsx` return block**

In `frontend/src/components/Categories.jsx`, replace the `return (…);` block (currently lines 33–50) with:

```jsx
  return (
    <section className="categories-section">
      <div className="section-header">
        <h2 className="display"><span className="text-dark">featured</span> <span className="text-accent">categories</span></h2>
        <a href="#categories" className="view-all">View all categories</a>
      </div>
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="card card-interactive category-card">
            <div className="category-icon">
              {categoryEmojis[cat.name] || <FiGrid />}
            </div>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
```

- [ ] **Step 6: Replace `Categories.css`**

```css
/* Categories.css */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  cursor: pointer;
}

.category-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  background: var(--light);
  border: var(--border);
  border-radius: 50%;
  transition: background 0.15s ease;
}

.category-card:hover .category-icon {
  background: var(--brand-red);
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  text-align: center;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .category-icon {
    width: 52px;
    height: 52px;
    font-size: 28px;
  }

  .category-name { font-size: 12px; }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 7: Replace `PromoBanners.jsx`**

```jsx
import './PromoBanners.css';

export default function PromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-card promo-red on-dark">
        <span className="pill">Up to 20% Off</span>
        <h3 className="display">support local<br />MSME products</h3>
        <p>Handpicked items from Davao's finest small businesses.</p>
        <button className="btn btn-ghost">Shop Now →</button>
      </div>
      <div className="promo-card promo-light">
        <span className="pill">Bazaar Specials</span>
        <h3 className="display">fresh finds,<br />pure quality</h3>
        <p>Artisanal crafts and delicacies from weekend markets.</p>
        <button className="btn btn-primary">Shop Now →</button>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Replace `PromoBanners.css`**

```css
/* PromoBanners.css */
.promo-banners {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.promo-card {
  padding: 36px 32px;
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-hard-lg);
}

.promo-red {
  background: var(--grain), var(--brand-red);
  color: var(--light);
}

.promo-light {
  background: var(--light);
  color: var(--ink);
}

.promo-card .pill {
  margin-bottom: 16px;
}

.promo-card h3 {
  margin-bottom: 8px;
  font-size: 28px;
}

.promo-card p {
  margin-bottom: 24px;
  font-size: 14px;
}

.promo-light p {
  color: var(--ink-muted);
}

@media (max-width: 768px) {
  .promo-banners {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .promo-card {
    padding: 28px 24px;
    box-shadow: var(--shadow-hard);
  }

  .promo-card h3 { font-size: 22px; }
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test`
Expected: all test files pass, including 4 in `HomeSections.test.jsx`, and `App.test.jsx` still passes.

- [ ] **Step 10: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/Hero.* src/components/Categories.* src/components/PromoBanners.*`
Expected: no output.

- [ ] **Step 11: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.css src/components/Categories.jsx src/components/Categories.css src/components/PromoBanners.jsx src/components/PromoBanners.css src/components/HomeSections.test.jsx
git commit -m "Restyle hero, categories, and promo banners" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: ProductCard, FeaturedProducts, DealsOfDay

**Files:**
- Modify: `frontend/src/components/ProductCard.jsx`, `ProductCard.css` (full replacements)
- Modify: `frontend/src/components/FeaturedProducts.jsx:26-43` (JSX return block), `FeaturedProducts.css` (full replacement)
- Modify: `frontend/src/components/DealsOfDay.jsx:22-36` (JSX return block), `DealsOfDay.css` (full replacement)
- Test: `frontend/src/components/ProductSections.test.jsx`

**Interfaces:**
- Consumes: `.card .card-interactive .btn .btn-primary .btn-ghost .btn-sm .display`, tokens (Task 2).
- Produces: `.products-grid` (used by both sections) unchanged in name.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/ProductSections.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import FeaturedProducts from './FeaturedProducts';
import DealsOfDay from './DealsOfDay';

vi.mock('../api', () => ({
  getFeaturedProducts: () => Promise.reject(new Error('offline')),
  getDeals: () => Promise.reject(new Error('offline')),
}));

const product = {
  id: 1,
  name: 'Dried Mango Pack',
  price: 180,
  original_price: 220,
  merchant_name: 'Tropik Bites',
  category: { name: 'Food & Snacks' },
};

describe('ProductCard', () => {
  it('shows name, merchant, price, and discount', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Dried Mango Pack')).toBeInTheDocument();
    expect(screen.getByText('Tropik Bites')).toBeInTheDocument();
    expect(screen.getByText('₱180.00')).toBeInTheDocument();
    expect(screen.getByText('-18%')).toBeInTheDocument();
  });

  it('is an interactive card with Gumroad buttons', () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container.firstChild).toHaveClass('card', 'card-interactive', 'product-card');
    expect(screen.getByRole('button', { name: /add to cart/i })).toHaveClass('btn', 'btn-primary', 'btn-sm');
    expect(screen.getByRole('button', { name: 'Add to Wishlist' })).toHaveClass('btn', 'btn-ghost', 'btn-sm');
  });

  it('hides the badge when there is no discount', () => {
    render(<ProductCard product={{ ...product, original_price: null }} />);
    expect(screen.queryByText(/%$/)).toBeNull();
  });
});

describe('FeaturedProducts', () => {
  it('uses a lowercase heading and a ghost see-more button', async () => {
    render(<FeaturedProducts />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('featured products');
    expect(screen.getByRole('button', { name: /see more/i })).toHaveClass('btn', 'btn-ghost');
    expect(await screen.findByText('Dried Mango Pack')).toBeInTheDocument();
  });
});

describe('DealsOfDay', () => {
  it('uses a lowercase heading', async () => {
    render(<DealsOfDay />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('display');
    expect(h2).toHaveTextContent('deals of the day');
    expect(await screen.findByText('Rattan Earrings')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/ProductSections.test.jsx`
Expected: FAIL. Classes `card`/`btn` are missing and headings are "Featured Products" / "Deals of the Day".

- [ ] **Step 3: Replace `ProductCard.jsx`**

```jsx
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="card card-interactive product-card">
      {discount > 0 && <span className="product-badge">-{discount}%</span>}
      <div className="product-image">
        <span className="product-emoji">
          {product.category?.name === 'Food & Snacks' ? '🍜' :
           product.category?.name === 'Apparel' ? '👕' :
           product.category?.name === 'Stationery' ? '📝' :
           product.category?.name === 'Crafts' ? '🎨' :
           product.category?.name === 'Accessories' ? '💍' :
           product.category?.name === 'Home & Living' ? '🏠' : '📦'}
        </span>
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-merchant">{product.merchant_name}</p>
        <div className="product-pricing">
          <span className="product-price">₱{Number(product.price).toFixed(2)}</span>
          {product.original_price && (
            <span className="product-original">₱{Number(product.original_price).toFixed(2)}</span>
          )}
        </div>
        <div className="product-actions">
          <button className="btn btn-primary btn-sm add-to-cart-btn"><FiShoppingCart /> Add to Cart</button>
          <button className="btn btn-ghost btn-sm wishlist-btn" aria-label="Add to Wishlist"><FiHeart /></button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Replace `ProductCard.css`**

```css
/* ProductCard.css */
.product-card {
  position: relative;
  overflow: hidden;
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  background: var(--brand-maroon);
  color: var(--light);
  border: var(--border);
  border-radius: var(--radius-pill);
}

.product-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light);
  border-bottom: var(--border);
}

.product-emoji {
  font-size: 56px;
}

.product-info {
  padding: 16px;
}

.product-name {
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-merchant {
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--ink-muted);
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.product-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--ink);
}

.product-original {
  font-size: 13px;
  color: var(--ink-muted);
  text-decoration: line-through;
}

.product-actions {
  display: flex;
  gap: 10px;
  padding: 0 4px 4px 0; /* room for the buttons' hard shadow inside overflow: hidden */
}

.add-to-cart-btn {
  flex: 1;
}

.wishlist-btn {
  flex-shrink: 0;
  align-self: stretch;
  width: 40px;
  padding: 0;
  font-size: 16px;
}
```

- [ ] **Step 5: Update the `FeaturedProducts.jsx` return block**

In `frontend/src/components/FeaturedProducts.jsx`, replace the `return (…);` block (currently lines 26–43) with:

```jsx
  return (
    <section className="featured-products-section">
      <div className="section-header">
        <div>
          <span className="section-tag">PRODUCTS</span>
          <h2 className="display"><span className="text-dark">featured</span> <span className="text-accent">products</span></h2>
        </div>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="see-more-wrap">
        <button className="btn btn-ghost">See more →</button>
      </div>
    </section>
  );
```

- [ ] **Step 6: Replace `FeaturedProducts.css`**

```css
/* FeaturedProducts.css */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.see-more-wrap {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Update the `DealsOfDay.jsx` return block**

In `frontend/src/components/DealsOfDay.jsx`, replace the `return (…);` block (currently lines 22–36) with:

```jsx
  return (
    <section className="deals-section">
      <div className="section-header">
        <div>
          <span className="section-tag">TODAY'S DEALS</span>
          <h2 className="display"><span className="text-dark">deals of</span> <span className="text-accent">the day</span></h2>
        </div>
      </div>
      <div className="products-grid">
        {deals.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
```

- [ ] **Step 8: Replace `DealsOfDay.css`**

```css
/* DealsOfDay.css */
.deals-section {
  padding-bottom: 72px;
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test`
Expected: all test files pass, including 5 in `ProductSections.test.jsx`.

- [ ] **Step 10: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/ProductCard.* src/components/FeaturedProducts.* src/components/DealsOfDay.*`
Expected: no output.

- [ ] **Step 11: Commit**

```bash
git add src/components/ProductCard.jsx src/components/ProductCard.css src/components/FeaturedProducts.jsx src/components/FeaturedProducts.css src/components/DealsOfDay.jsx src/components/DealsOfDay.css src/components/ProductSections.test.jsx
git commit -m "Restyle product cards and product sections" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: CountdownBanner

**Files:**
- Modify: `frontend/src/components/CountdownBanner.jsx:47-84` (JSX return block)
- Modify: `frontend/src/components/CountdownBanner.css` (full replacement)
- Test: `frontend/src/components/CountdownBanner.test.jsx`

**Interfaces:**
- Consumes: `.btn .btn-ghost .on-dark`, `--grain`, tokens (Task 2).
- Produces: nothing new.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/CountdownBanner.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import CountdownBanner from './CountdownBanner';

vi.mock('../api', () => ({
  getUpcomingEvents: () => Promise.reject(new Error('offline')),
}));

describe('CountdownBanner', () => {
  it('renders the fallback event as a dark block with a ghost button', async () => {
    const { container } = render(<CountdownBanner />);
    expect(await screen.findByRole('heading', { level: 2, name: 'Davao Weekend Bazaar' })).toBeInTheDocument();
    expect(container.querySelector('.countdown-banner')).toHaveClass('on-dark');
    expect(screen.getByRole('button', { name: /shop now/i })).toHaveClass('btn', 'btn-ghost');
    expect(screen.getAllByText(/^(Days|Hours|Minutes|Seconds)$/)).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/CountdownBanner.test.jsx`
Expected: FAIL, `.countdown-banner` lacks `on-dark` and the button lacks `btn`.

- [ ] **Step 3: Update the `CountdownBanner.jsx` return block**

In `frontend/src/components/CountdownBanner.jsx`, replace the final `return (…);` block (currently lines 47–84) with:

```jsx
  return (
    <section className="countdown-banner on-dark">
      <div className="countdown-content">
        <h2 className="countdown-title">{event.name}</h2>
        <p className="countdown-subtitle">
          Get {event.discount_percent}% off · Limited Time Offer!
        </p>
        <div className="countdown-timer">
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.days)}</span>
            <span className="time-label">Days</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.hours)}</span>
            <span className="time-label">Hours</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.minutes)}</span>
            <span className="time-label">Minutes</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.seconds)}</span>
            <span className="time-label">Seconds</span>
          </div>
        </div>
        <button className="btn btn-ghost">Shop Now →</button>
      </div>
      <div className="countdown-image">
        <div className="countdown-image-placeholder">
          <span aria-hidden="true">🎪</span>
          <p>{event.venue}</p>
        </div>
      </div>
    </section>
  );
```

- [ ] **Step 4: Replace `CountdownBanner.css`**

The block is inset 24px on each side (`width: calc(100% - 48px)`) so its 8px hard shadow never causes horizontal page scroll.

```css
/* CountdownBanner.css */
.countdown-banner {
  display: flex;
  align-items: stretch;
  width: calc(100% - 48px);
  max-width: calc(var(--max-width) - 48px);
  margin: 40px auto;
  padding: 0;
  overflow: hidden;
  background: var(--grain), var(--brand-maroon);
  color: var(--light);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-hard-lg);
}

.countdown-content {
  flex: 1;
  padding: 48px 40px;
}

.countdown-title {
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.countdown-subtitle {
  margin-bottom: 28px;
  font-size: 15px;
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  padding: 0 4px 4px 0; /* room for the time blocks' hard shadow */
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
  padding: 10px 8px;
  background: var(--light);
  color: var(--ink);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-hard);
}

.time-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.time-label {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.time-sep {
  font-size: 28px;
  font-weight: 800;
}

.countdown-image {
  flex: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: var(--brand-red);
  border-left: var(--border);
}

.countdown-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
}

.countdown-image-placeholder span {
  font-size: 80px;
}

.countdown-image-placeholder p {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .countdown-banner {
    flex-direction: column;
    box-shadow: var(--shadow-hard);
  }

  .countdown-content {
    padding: 36px 24px;
    text-align: center;
  }

  .countdown-timer {
    justify-content: center;
    gap: 6px;
  }

  .countdown-title { font-size: 24px; }

  .time-block {
    min-width: 56px;
    padding: 8px 4px;
  }

  .time-value { font-size: 26px; }
  .time-sep { font-size: 22px; }

  .countdown-image {
    min-height: 180px;
    border-left: none;
    border-top: var(--border);
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all test files pass.

- [ ] **Step 6: Theme check**

Run: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" src/components/CountdownBanner.*`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/components/CountdownBanner.jsx src/components/CountdownBanner.css src/components/CountdownBanner.test.jsx
git commit -m "Restyle countdown banner" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Full verification pass

**Files:**
- No planned changes. Fix only what this pass finds, in the file that owns the problem.

**Interfaces:**
- Consumes: everything above.
- Produces: a verified Phase 1.

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: 10 test files (RichText, Incorporators, AboutPage, BrandBand, App, Navbar, Footer, HomeSections, ProductSections, CountdownBanner), all passing, 0 failures.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: `✓ built in …`, no errors or warnings about unresolved imports.

- [ ] **Step 3: Theme check across all Phase 1 files**

Run:

```bash
grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|--gray-|--shadow-(sm|md|lg)\b|--white\b|(^|[^-])white([^-]|$)" \
  src/styles/ui.css \
  src/components/{Navbar,Hero,Categories,BrandBand,PromoBanners,FeaturedProducts,DealsOfDay,ProductCard,CountdownBanner,Footer,Incorporators,RichText,ScrollToTop}.* \
  src/customer-pages/{HomePage,AboutPage}.* \
  src/content/about.js src/App.jsx src/main.jsx
```

Expected: no output.

Run: `awk '/^:root/{r=1} r&&/^}/{r=0;next} !r' src/index.css | grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\("`
Expected: no output.

- [ ] **Step 4: Confirm Phase 2 files are untouched**

Run: `git diff --stat main -- src/customer-pages src/components/SellersLayout.* src/components/RidersLayout.* src/components/DeliveryMap.* src/components/PageLayout.css src/components/Toast.*`
Expected: only `src/customer-pages/HomePage.jsx`, `AboutPage.jsx`, `AboutPage.css`, and `AboutPage.test.jsx` appear.

- [ ] **Step 5: Manual visual pass**

With the Laravel backend **not** running (fallback data renders), run `npm run dev` and open `http://localhost:3000/`.

At 1280px width and again at 400px (browser DevTools device toolbar), on both `/` and `/about`, check:

1. Only the five palette colors appear; no green, orange, navy, or pure white.
2. In the DevTools console, `document.documentElement.scrollWidth <= window.innerWidth` returns `true` (no horizontal page scroll).
3. Buttons lift on hover and press in on click; interactive cards lift with an 8px black shadow.
4. Tab through the page: every link, button, and the search field shows a visible outline (maroon on light surfaces, light on red/maroon/black surfaces).
5. With DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", buttons and cards no longer move on hover or click.
6. `/about`: hero band, Vision and Mission maroon cards side by side (stacked at 400px), red brand story panel flush left with light showing on the right (full width at 400px), eight incorporators in the owner's order with initials tiles.
7. Home: the red "gikan diri, para diri." band sits right after Categories, and "our story →" navigates to `/about` scrolled to the top.
8. Navbar "About" shows as active on `/about`; the wordmark returns home.
9. Refreshing the browser on `/about` still shows the About page (Vite dev fallback).

- [ ] **Step 6: Commit any fixes**

If steps 1–5 required changes:

```bash
git add <changed files>
git commit -m "Fix issues found in Phase 1 verification pass" -m "Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

If nothing changed, skip this step.
