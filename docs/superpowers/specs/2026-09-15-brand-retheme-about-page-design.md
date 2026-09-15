# Brand Retheme + About Page (Phase 1) — Design

**Date:** 2026-09-15
**Status:** Awaiting review
**Scope:** `frontend/` only. No backend changes.

## 1. Goal

Bring the live Hap'n site in line with the brand materials (red/maroon, Poppins, lowercase headings, paper texture) using a Gumroad-style neo-brutalist UI, and add an About page carrying the Vision, Mission, Brand Story, and a ready-to-fill Incorporators section.

## 2. Context

- `App.jsx` renders only the home page. There is no router in use.
- About 20 page files in `src/customer-pages/` plus `SellersLayout`/`RidersLayout` already import `react-router-dom`, but nothing mounts them. `react-router-dom@7.13.1` is present in `node_modules` but missing from `package.json`.
- The current theme is green (`--primary: #1B6B3A`). Brand materials are red. Poppins is already loaded in `index.html`.
- Every home component (`Categories`, `FeaturedProducts`, `DealsOfDay`, `CountdownBanner`) falls back to local data when the API is unreachable, so the site renders without Laravel running.

## 3. Decisions

| Topic | Decision |
|---|---|
| Theme | Brand red across the whole visible site; green is removed. |
| UI style | Full Gumroad look (ink outlines, hard offset shadows, flat color blocks, heavy type, press/lift buttons) on every Phase 1 surface. |
| Placement | New `/about` page, plus a brand band on the home page linking to it. |
| Vision | Placeholder text in the content file until the official statement is supplied. |
| Incorporators | Static content file; empty list shows a "coming soon" card. |
| Styling approach | Tokens + shared primitives in plain CSS, then per-component CSS migrates to them. No Tailwind, no override stylesheet. |
| Phasing | Phase 1 = everything reachable today + About. Phase 2 (separate spec) = wiring and restyling the unmounted pages. |

## 4. Design System

### 4.1 Tokens (`src/index.css`, `:root`)

These five brand colors are the only hues allowed in Phase 1 files. Values are eyedropper estimates from the brand images; replace them here if official hex codes are supplied.

```css
--brand-red:    #B71C1C;
--brand-maroon: #7F0000;
--paper:        #F4F3F1;
--ink:          #141414;
--white:        #FFFFFF;
```

Aliases, so existing references (including Phase 2 files) resolve to brand colors:

```css
--primary:       var(--brand-red);
--primary-light: var(--brand-red);
--primary-dark:  var(--brand-maroon);
--accent:        var(--brand-red);
--dark:          var(--ink);
```

Gumroad-style tokens:

```css
--border:         2px solid var(--ink);
--shadow-hard:    4px 4px 0 var(--ink);
--shadow-hard-lg: 8px 8px 0 var(--ink);
--radius:         8px;
--radius-lg:      8px;
--radius-pill:    999px;
```

- `--gray-*` stay as they are and are used only for secondary text and dividers.
- `--shadow-sm/md/lg` stay defined for Phase 2 files. Phase 1 files must not use them.
- `body` background becomes `var(--paper)`.

### 4.2 Primitives (`src/styles/ui.css`, imported once in `main.jsx`)

| Class | Spec |
|---|---|
| `.btn` | Inline-flex, 600 weight, `border: var(--border)`, `box-shadow: var(--shadow-hard)`, `border-radius: var(--radius)`, padding `12px 24px`. Hover: `transform: translate(-2px,-2px)` + `box-shadow: 6px 6px 0 var(--ink)`. Active: `translate(2px,2px)` + `box-shadow: 0 0 0 var(--ink)`. Transition ≤150ms. |
| `.btn-primary` | Red background, white text. |
| `.btn-ghost` | White background, ink text. |
| `.btn-sm` | Padding `8px 14px`, 13px text. |
| `.card` | White background, `border: var(--border)`, `border-radius: var(--radius)`. Hover (when interactive): `translate(-4px,-4px)` + `var(--shadow-hard-lg)`. |
| `.pill` | Inline-block, white background, maroon text, 700 weight, uppercase, letter-spacing `0.08em`, 12px, padding `6px 14px`, `border-radius: var(--radius-pill)`, `border: var(--border)`. |
| `.band` | Full-bleed section; its child `.band-inner` is `max-width: var(--max-width)`, centered, horizontal padding 24px. |
| `.band-red` | Red background, white text, grain overlay. |
| `.band-maroon` | Maroon background, white text, grain overlay. |
| `.band-paper` | Paper background, ink text. |
| `.display` | Poppins 800, lowercase copy (authored lowercase, not `text-transform`), `letter-spacing: -0.02em`, `line-height: 1.1`. |

**Grain:** an inline SVG `feTurbulence` noise as a `data:` URI `background-image`, layered over the band color at ~8% opacity. No image files.

**Casing rule:** pills are UPPERCASE; headings are lowercase.

### 4.3 Accessibility

- Global `:focus-visible { outline: 3px solid var(--brand-maroon); outline-offset: 2px; }`. On red/maroon bands the outline is white.
- `@media (prefers-reduced-motion: reduce)` removes all `transform` on `.btn` and `.card` hover/active; shadow changes remain.
- Contrast: white on `#B71C1C` ≈ 6.6:1 and on `#7F0000` ≈ 11:1 (AA pass). Ink on paper passes AAA.

## 5. Routing

- Add `"react-router-dom": "^7.13.1"` to `dependencies`.
- `main.jsx`: wrap `<App />` in `<BrowserRouter>`. `App` itself contains no router, so tests can wrap it in `<MemoryRouter>`.
- `App.jsx` becomes the shell: `<Navbar />`, `<ScrollToTop />`, `<main><Routes>…</Routes></main>`, `<Footer />`.
  - `/` → `HomePage`
  - `/about` → `AboutPage`
  - `*` → `<Navigate to="/" replace />`
- `src/components/ScrollToTop.jsx`: on `pathname` change, `window.scrollTo(0, 0)`.
- **Navbar:** the brand becomes `<Link to="/">`. "Home" and a new "About" item become `<NavLink>`s with an active style. The other category items stay hash anchors (they are non-functional today; wiring them is Phase 2).
- **Footer:** add "About Hap'n" (`<Link to="/about">`) as the first Quick Link.
- **Deployment note:** the production host must rewrite unknown paths to `index.html` for `/about` to survive a refresh. Vite dev already does this.

## 6. Content (`src/content/about.js`)

Single source for all brand copy. Bold spans use `**…**`. Mission and brand story are verbatim from the brand images.

```js
export const aboutHero = {
  pill: "About Hap'n",
  heading: 'go on, make it hap’n!',
  subheading: 'A digital platform where Davao’s local entrepreneurs, small businesses, and dreamers are seen, supported, and celebrated.',
};

export const vision = {
  label: 'Vision',
  // PLACEHOLDER — replace with the official vision statement.
  text: 'Our vision statement is coming soon.',
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
    'With every merchant and product, we contribute to a larger narrative of the city’s progress. Because when we choose to uplift what is ours, we create opportunities that stay, grow, and thrive within the community and beyond. Here, it is not only about what it is being sold, but about what is being built together.',
  ],
  signoff: 'So, then we say: **go on, make it hap’n!**',
};

export const homeBand = {
  tagline: 'gikan diri, para diri.',
  text: 'Hap’n helps Davao’s small businesses be seen, supported, and celebrated.',
  cta: 'our story',
};

// Each entry: { name, role, photo?, note? }. Photos live in frontend/public/team/.
export const incorporators = [];
```

`aboutHero.subheading` and `homeBand.text` are condensed from the brand story, not verbatim. They live in this file so they can be edited without touching layout.

## 7. Components

### 7.1 New

| File | Responsibility |
|---|---|
| `src/components/RichText.jsx` | `<RichText text="a **b** c" as="p" />`. Splits on `**`, renders odd segments as `<strong>`. Returns React elements only; never uses `dangerouslySetInnerHTML`. An unmatched `**` renders literally. |
| `src/components/BrandBand.jsx` + `.css` | Home band: `.band.band-red`, tagline as `.display`, `homeBand.text`, `<Link className="btn btn-ghost" to="/about">our story →</Link>`. |
| `src/components/Incorporators.jsx` + `.css` | Props `{ people }`. Empty → a single `.card` with a "meet the team soon" message. Non-empty → grid of cards: square photo with ink border (or an initials tile on red when `photo` is missing), name (700), role (gray), optional note. Grid: 4 cols ≥1024px, 2 cols ≥480px, 1 col below. |
| `src/components/ScrollToTop.jsx` | See §5. |
| `src/customer-pages/HomePage.jsx` | Current home sections, in order: `Hero`, `Categories`, `BrandBand`, `PromoBanners`, `FeaturedProducts`, `CountdownBanner`, `DealsOfDay`. |
| `src/customer-pages/AboutPage.jsx` + `.css` | See §7.2. |
| `src/styles/ui.css` | See §4.2. |
| `src/content/about.js` | See §6. |

### 7.2 About page layout (top to bottom)

1. **Hero** — `.band.band-red`: `.pill` (`aboutHero.pill`), `h1.display` (`aboutHero.heading`), subheading paragraph.
2. **Vision + Mission** — two-column grid (stacks below 768px). Vision: `.card`, white, `.pill` label, text. Mission: `.card` with maroon background and white text, `.pill` label, text. Both carry `var(--shadow-hard)`.
3. **Brand story** — red panel (with grain) flush to the left viewport edge, ending ~80% of viewport width on desktop so paper shows on the right; full width below 768px. Contents: `h2.display` heading, bold tagline, paragraphs via `RichText`, sign-off via `RichText`. Text column max-width ~720px.
4. **Incorporators** — `.pill` "Incorporators", `h2.display` "the people behind hap’n", `<Incorporators people={incorporators} />`.

Headings are semantic: one `h1` (hero), `h2` per section.

### 7.3 Restyled (existing)

| Component | Changes |
|---|---|
| `Navbar.jsx/.css` | White bar, `border-bottom: var(--border)`. Remove ⚡ emoji; wordmark `hap'n!` in brand red, 800. Search: ink border, red search button. Nav links: red underline on hover/active. JSX: brand `Link`, `NavLink` for Home/About. |
| `Hero.jsx/.css` | Paper background; `h1.display` lowercase, "MSMEs" in red; `.btn .btn-primary`. Green gradient placeholder → `.card` with red fill, hard shadow, white wordmark. |
| `Categories.css` | Tiles become `.card`-style (white, ink border, lift on hover). Icon circle: white with ink border; on tile hover its background becomes `var(--paper)` (replaces the green `#e8f5e9` tint). |
| `PromoBanners.jsx/.css` | Left card red (white text), right card white (ink text); both ink border + hard shadow. Badges → `.pill`. Buttons → `.btn` (ghost on red, primary on white). |
| `FeaturedProducts.css`, `DealsOfDay.css` | Section headings `.display`; "View all" ink with red underline. |
| `ProductCard.jsx/.css` | `.card` look with hard shadow on hover. Discount badge maroon. Price ink 800. Add to Cart → `.btn .btn-primary .btn-sm`; wishlist → `.btn .btn-ghost .btn-sm` square. Remove `#e53935`/`#fce4ec`. |
| `CountdownBanner.jsx/.css` | Stays a contained block inside the page width (not full-bleed). Navy gradient → maroon background with grain, `border: var(--border)`, `box-shadow: var(--shadow-hard-lg)`. Timer digits in white outlined boxes with ink text. Button → `.btn .btn-ghost`. |
| `Footer.jsx/.css` | Background ink. Remove ⚡ emoji. Social icons hover red. Add About link. |

Section headings in these components are re-authored in lowercase (e.g. "featured products").

## 8. Out of Scope

- Wiring or restyling the unmounted pages (`customer-pages/*` other than Home/About, `SellersLayout`, `RidersLayout`, `DeliveryMap`, `PageLayout.css`, `Toast`) — Phase 2.
- Official Vision text, incorporator entries, and the Mission background photo — content, added later.
- Backend/API changes.
- Making hash-anchor category links functional.

## 9. Testing & Verification

**Tooling:** add dev dependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`. Configure `test: { environment: 'jsdom', setupFiles: './src/test/setup.js' }` in `vite.config.js`; add `"test": "vitest run"` script. Tests are colocated as `*.test.jsx`.

**Unit/integration tests:**

1. `RichText` — `a **b** c` renders `<strong>b</strong>`; text containing `<script>` renders as literal text; unmatched `**` renders literally.
2. `Incorporators` — `[]` shows the coming-soon card; an entry with a photo renders `img` with alt = name, plus name and role; an entry without a photo renders initials.
3. `AboutPage` — renders the Vision, Mission, and brand story headings/text sourced from `about.js`.
4. Routing — `<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>` shows the hero heading; `/about` shows "brand story"; `/nope` lands on home. API calls are mocked to reject so fallbacks render.

**Build:** `npm run build` succeeds.

**Theme check:** no hex colors in any Phase 1 file other than the `:root` block in `index.css`:

```bash
grep -nE "#[0-9a-fA-F]{3,6}\b" src/styles/ui.css src/components/{Navbar,Hero,Categories,BrandBand,PromoBanners,FeaturedProducts,DealsOfDay,ProductCard,CountdownBanner,Footer,Incorporators}.* src/customer-pages/{HomePage,AboutPage}.*
```

must return nothing. The grain SVG data URI uses `currentColor`/`black` keywords, not hex.

**Manual visual pass** (backend off): `/` and `/about` at 1280px and 400px widths. Verify no horizontal page scroll at 400px, hover/press states on buttons and cards, visible keyboard focus on every link and button, and reduced-motion behavior.

## 10. Open Items for the Owner

- Official hex codes, if a brand guide exists (otherwise the estimates in §4.1 stand).
- The Vision statement.
- Incorporator names, roles, and photos.
- The Mission background photo (optional; solid maroon is used until then).
- Brand story typo check: "not only about what **it is** being sold" is kept verbatim from the image; confirm whether it should read "what is being sold".
