# Brand Retheme + About Page (Phase 1) — Design

**Date:** 2026-09-15
**Status:** Content and palette confirmed by owner
**Scope:** `frontend/` only. No backend changes.

## 1. Goal

Bring the live Hap'n site in line with the brand guide (official palette, Poppins, lowercase headings, paper texture) using a Gumroad-style neo-brutalist UI, and add an About page carrying the Vision, Mission, Brand Story, and Incorporators.

## 2. Context

- `App.jsx` renders only the home page. There is no router in use.
- About 20 page files in `src/customer-pages/` plus `SellersLayout`/`RidersLayout` already import `react-router-dom`, but nothing mounts them. `react-router-dom@7.13.1` is present in `node_modules` but missing from `package.json`.
- The current theme is green (`--primary: #1B6B3A`). The brand guide is red. Poppins is already loaded in `index.html`.
- Every home component (`Categories`, `FeaturedProducts`, `DealsOfDay`, `CountdownBanner`) falls back to local data when the API is unreachable, so the site renders without Laravel running.

## 3. Decisions

| Topic | Decision |
|---|---|
| Theme | Official brand palette (§4.1) across the whole visible site; green is removed. |
| UI style | Full Gumroad look (ink outlines, hard offset shadows, flat color blocks, heavy type, press/lift buttons) on every Phase 1 surface. |
| Placement | New `/about` page, plus a brand band on the home page linking to it. |
| Vision / Mission | Text only, verbatim from the brand images. The market photos in those images are not used. |
| Brand story | Verbatim, with one typo fixed ("what it is being sold" → "what is being sold"). |
| Incorporators | Static content file, seven names in the owner's order. No roles or photos yet. |
| Styling approach | Tokens + shared primitives in plain CSS, then per-component CSS migrates to them. No Tailwind, no override stylesheet. |
| Phasing | Phase 1 = everything reachable today + About. Phase 2 (separate spec) = wiring and restyling the unmounted pages. |

## 4. Design System

### 4.1 Tokens (`src/index.css`, `:root`)

**Official palette** (brand guide, Figure 3.2). These are the only hues allowed in Phase 1 files. Pure white `#FFFFFF` is not in the palette and is not used.

```css
--light:         #F8F5F6; /* Light Grayish Pink */
--brand-red:     #AF1C1C; /* Red */
--brand-crimson: #B10100; /* Dark Crimson */
--brand-maroon:  #8B0000; /* Dark Red */
--ink:           #000000; /* Black */
```

**Roles**

| Token | Used for |
|---|---|
| `--light` | Page background, card surfaces, text and pills on red/maroon/ink. |
| `--brand-red` | Primary buttons, red bands, brand story panel, initials tiles. |
| `--brand-crimson` | Small accents on light surfaces: wordmark, "MSMEs" highlight, nav hover/active underline, link underline. |
| `--brand-maroon` | Vision and Mission cards, countdown block, pill text, discount badge, focus ring. |
| `--ink` | Body text, outlines, hard shadows, footer background. |

Cards share the page's `--light` color; they are separated by the ink border and hard shadow, which is the Gumroad pattern.

**Derived tokens** (mixes of palette colors, not new hues):

```css
--ink-muted:   color-mix(in srgb, var(--ink) 65%, var(--light)); /* secondary text on light, ≈6.7:1 */
--ink-subtle:  color-mix(in srgb, var(--ink) 20%, var(--light)); /* dividers only, never text */
--light-muted: color-mix(in srgb, var(--light) 70%, var(--ink)); /* secondary text on ink only, ≈9:1 */
```

`--light-muted` is not used on red or maroon; text there is full `--light`.

**Aliases**, so existing references (including Phase 2 files) resolve to palette colors:

```css
--primary:       var(--brand-red);
--primary-light: var(--brand-crimson);
--primary-dark:  var(--brand-maroon);
--accent:        var(--brand-crimson);
--dark:          var(--ink);
--white:         var(--light);
```

**Gumroad-style tokens:**

```css
--border:         2px solid var(--ink);
--shadow-hard:    4px 4px 0 var(--ink);
--shadow-hard-lg: 8px 8px 0 var(--ink);
--radius:         8px;
--radius-lg:      8px;
--radius-pill:    999px;
```

- `--gray-*` and `--shadow-sm/md/lg` stay defined for Phase 2 files only. Phase 1 files must not use them, nor `--white`.
- `body` background becomes `var(--light)`, text `var(--ink)`.
- Global rules in `index.css` (`.section-tag`, `.view-all`, etc.) move to palette tokens.

### 4.2 Primitives (`src/styles/ui.css`, imported once in `main.jsx`)

| Class | Spec |
|---|---|
| `.btn` | Inline-flex, 600 weight, `border: var(--border)`, `box-shadow: var(--shadow-hard)`, `border-radius: var(--radius)`, padding `12px 24px`. Hover: `transform: translate(-2px,-2px)` + `box-shadow: 6px 6px 0 var(--ink)`. Active: `translate(2px,2px)` + `box-shadow: 0 0 0 var(--ink)`. Transition ≤150ms. |
| `.btn-primary` | `--brand-red` background, `--light` text. |
| `.btn-ghost` | `--light` background, `--ink` text. |
| `.btn-sm` | Padding `8px 14px`, 13px text. |
| `.card` | `--light` background, `border: var(--border)`, `border-radius: var(--radius)`. Hover (when interactive): `translate(-4px,-4px)` + `var(--shadow-hard-lg)`. |
| `.pill` | Inline-block, `--light` background, `--brand-maroon` text, 700 weight, uppercase, letter-spacing `0.08em`, 12px, padding `6px 14px`, `border-radius: var(--radius-pill)`, `border: var(--border)`. |
| `.band` | Full-bleed section; its child `.band-inner` is `max-width: var(--max-width)`, centered, horizontal padding 24px. |
| `.band-red` | `--brand-red` background, `--light` text, grain overlay. |
| `.band-maroon` | `--brand-maroon` background, `--light` text, grain overlay. |
| `.display` | Poppins 800, lowercase copy (authored lowercase, not `text-transform`), `letter-spacing: -0.02em`, `line-height: 1.1`. |

**Grain:** an inline SVG `feTurbulence` noise as a `data:` URI `background-image`, tinted black via `feColorMatrix`, layered over the band color at ~8% opacity. No image files, no hex values (`#` in the URI is encoded as `%23`).

**Casing rule:** pills are UPPERCASE; headings are lowercase.

### 4.3 Accessibility

- Global `:focus-visible { outline: 3px solid var(--brand-maroon); outline-offset: 2px; }`. Inside `.band-red`, `.band-maroon`, and the footer the outline is `--light`.
- `@media (prefers-reduced-motion: reduce)` removes all `transform` on `.btn` and `.card` hover/active; shadow changes remain.
- Contrast (WCAG): `--light` on red ≈ 6.4:1, on crimson ≈ 6.7:1, on maroon ≈ 9.2:1; crimson text on `--light` ≈ 6.7:1; ink on `--light` ≈ 19:1. All pass AA for body text.

## 5. Routing

- Add `"react-router-dom": "^7.13.1"` to `dependencies`.
- `main.jsx`: wrap `<App />` in `<BrowserRouter>`. `App` itself contains no router, so tests can wrap it in `<MemoryRouter>`.
- `App.jsx` becomes the shell: `<Navbar />`, `<ScrollToTop />`, `<main><Routes>…</Routes></main>`, `<Footer />`.
  - `/` → `HomePage`
  - `/about` → `AboutPage`
  - `*` → `<Navigate to="/" replace />`
- `src/components/ScrollToTop.jsx`: on `pathname` change, `window.scrollTo(0, 0)`.
- **Navbar:** the brand becomes `<Link to="/">`. "Home" and a new "About" item become `<NavLink>`s with an active style. The other category items stay hash anchors (they are non-functional today; wiring them is Phase 2).
- **Footer:** add "About Hap'n" (`<Link to="/about">`) as the first Quick Link. Instagram icon links to `https://www.instagram.com/hapn.co/` (handle from the brand images).
- **Deployment note:** the production host must rewrite unknown paths to `index.html` for `/about` to survive a refresh. Vite dev already does this.

## 6. Content (`src/content/about.js`)

Single source for all brand copy. Bold spans use `**…**`. Vision, Mission, and brand story are verbatim from the brand images except the one typo fix noted in §3.

```js
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
];
```

- Names are stored and displayed exactly as provided (uppercase); no CSS case transform is applied.
- `aboutHero.subheading` and `homeBand.text` are condensed from the brand story, not verbatim.

## 7. Components

### 7.1 New

| File | Responsibility |
|---|---|
| `src/components/RichText.jsx` | `<RichText text="a **b** c" as="p" />`. Splits on `**`, renders odd segments as `<strong>`. Returns React elements only; never uses `dangerouslySetInnerHTML`. An unmatched `**` renders literally. |
| `src/components/BrandBand.jsx` + `.css` | Home band: `.band.band-red`, tagline as `.display`, `homeBand.text`, `<Link className="btn btn-ghost" to="/about">our story →</Link>`. |
| `src/components/Incorporators.jsx` + `.css` | Props `{ people }`. Renders an ordered list (`<ol>`) preserving array order. Each card: square photo with ink border when `photo` is set, otherwise an initials tile (`--brand-red` background, `--light` text; initials = first letter of first and last word, e.g. "GC"); name (700); role (`--ink-muted`) only when present. Empty array → a single `.card` with "meet the team soon". Grid: 4 cols ≥1024px, 2 cols ≥480px, 1 col below. |
| `src/components/ScrollToTop.jsx` | See §5. |
| `src/customer-pages/HomePage.jsx` | Current home sections, in order: `Hero`, `Categories`, `BrandBand`, `PromoBanners`, `FeaturedProducts`, `CountdownBanner`, `DealsOfDay`. |
| `src/customer-pages/AboutPage.jsx` + `.css` | See §7.2. |
| `src/styles/ui.css` | See §4.2. |
| `src/content/about.js` | See §6. |

### 7.2 About page layout (top to bottom)

1. **Hero** — `.band.band-red`: `.pill` (`aboutHero.pill`), `h1.display` (`aboutHero.heading`), subheading paragraph.
2. **Vision + Mission** — two-column grid, Vision first (stacks below 768px). Both cards match the brand images: `--brand-maroon` background, `--light` text, `.pill` label on top, `border: var(--border)`, `box-shadow: var(--shadow-hard)`. Text is left-aligned (not justified) for readability on the web.
3. **Brand story** — `--brand-red` panel (with grain) flush to the left viewport edge, ending ~80% of viewport width on desktop so `--light` shows on the right; full width below 768px. Contents: `h2.display` heading, bold tagline, paragraphs via `RichText`, sign-off via `RichText`. Text column max-width ~720px.
4. **Incorporators** — `.pill` "Incorporators", `h2.display` "the people behind hap’n", `<Incorporators people={incorporators} />`.

Headings are semantic: one `h1` (hero), `h2` per section.

### 7.3 Restyled (existing)

| Component | Changes |
|---|---|
| `Navbar.jsx/.css` | `--light` bar, `border-bottom: var(--border)`. Remove ⚡ emoji; wordmark `hap'n!` in `--brand-crimson`, 800. Search: ink border, `--brand-red` search button with `--light` icon; placeholder text `--ink-muted`. Nav links: crimson underline on hover/active. JSX: brand `Link`, `NavLink` for Home/About. |
| `Hero.jsx/.css` | `h1.display` lowercase, "MSMEs" in `--brand-crimson`; `.btn .btn-primary`. Green gradient placeholder → `.card` with `--brand-red` fill, hard shadow, `--light` wordmark. |
| `Categories.css` | Tiles become `.card`-style (ink border, lift on hover). Icon circle: `--light` with ink border; on tile hover its background becomes `--brand-red` (replaces the green `#e8f5e9` tint). Category name `--ink`. |
| `PromoBanners.jsx/.css` | Left card `--brand-red` with `--light` text; right card `--light` with ink text; both ink border + hard shadow. Badges → `.pill`. Buttons → `.btn` (ghost on red, primary on light). |
| `FeaturedProducts.css`, `DealsOfDay.css` | Section headings `.display`; "View all" ink with crimson underline. |
| `ProductCard.jsx/.css` | `.card` look with hard shadow on hover. Discount badge `--brand-maroon` with `--light` text. Price ink 800. Merchant name `--ink-muted`. Add to Cart → `.btn .btn-primary .btn-sm`; wishlist → `.btn .btn-ghost .btn-sm` square. Image area: `--light` with bottom ink border. |
| `CountdownBanner.jsx/.css` | Stays a contained block inside the page width (not full-bleed). Navy gradient → `--brand-maroon` with grain, `border: var(--border)`, `box-shadow: var(--shadow-hard-lg)`. Timer digits in `--light` outlined boxes with ink text. Button → `.btn .btn-ghost`. |
| `Footer.jsx/.css` | Background `--ink`, headings `--light`, links and body `--light-muted`, hover `--light`. Remove ⚡ emoji. Social icons: `--light` outline circles, hover `--brand-red` fill. Add About link; Instagram URL per §5. |

Section headings in these components are re-authored in lowercase (e.g. "featured products").

## 8. Out of Scope

- Wiring or restyling the unmounted pages (`customer-pages/*` other than Home/About, `SellersLayout`, `RidersLayout`, `DeliveryMap`, `PageLayout.css`, `Toast`) — Phase 2.
- Incorporator roles and photos — content, added later via `about.js`.
- Backend/API changes.
- Making hash-anchor category links functional.

## 9. Testing & Verification

**Tooling:** add dev dependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`. Configure `test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.js' }` in `vite.config.js`; add `"test": "vitest run"` script. Tests are colocated as `*.test.jsx`.

**Unit/integration tests:**

1. `RichText` — `a **b** c` renders `<strong>b</strong>`; text containing `<script>` renders as literal text; unmatched `**` renders literally.
2. `Incorporators` — `[]` shows the coming-soon card; an entry with `photo` renders `img` with `alt` = name; an entry without `photo` renders its initials ("TS" for "TRISTAN JAMES CABILETE SINTOS"); `role` renders only when present; list order matches input order.
3. `AboutPage` — renders the Vision text, Mission text, the corrected brand story sentence ("what is being sold"), and all seven incorporator names in order.
4. Routing — `<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>` shows the hero heading; `/about` shows "brand story"; `/nope` lands on home. The `api` module is mocked to reject so fallbacks render.

**Build:** `npm run build` succeeds.

**Theme check** (run in `frontend/`): no color literals, grays, soft shadows, or `white` in Phase 1 files other than `index.css`:

```bash
grep -nP "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\bwhite\b(?!-space)|--gray-|--shadow-(sm|md|lg)\b" \
  src/styles/ui.css \
  src/components/{Navbar,Hero,Categories,BrandBand,PromoBanners,FeaturedProducts,DealsOfDay,ProductCard,CountdownBanner,Footer,Incorporators,RichText,ScrollToTop}.* \
  src/customer-pages/{HomePage,AboutPage}.*
```

must return nothing. In `index.css`, hex literals may appear only inside the `:root` block.

**Manual visual pass** (backend off): `/` and `/about` at 1280px and 400px widths. Verify no horizontal page scroll at 400px, hover/press states on buttons and cards, visible keyboard focus on every link and button, and reduced-motion behavior.

## 10. Open Items for the Owner

- Facebook page URL (brand images show the page name "Hap’n"); the icon keeps `#` until provided.
- Typography: this spec assumes Poppins, which matches the brand images and the current site. Share the brand guide's typography page if it specifies otherwise.
- Optional: incorporator roles and photos.
