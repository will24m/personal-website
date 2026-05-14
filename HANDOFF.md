# HANDOFF.md

Working notes for anyone (human or model) picking up this site. Read this before editing — it captures the *why* behind decisions that are not obvious from the code.

---

## 1. Context

Personal portfolio site for William Wu. Multi-page (home / about / contact) React app built with MUI and Framer Motion, served by Vite. Deployed on Vercel with a couple of serverless endpoints (`/api/gallery`, `/api/stats`).

The codebase was migrated from a CDN + in-browser Babel setup (`scripts/mui-app.js`) to a proper Vite + TypeScript build. The legacy `scripts/mui-app.js` still exists alongside `src/` — see [§10 Known Issues](#10-known-issues--workarounds).

---

## 2. Current State

**Working:**
- Vite build with multi-page input ([vite.config.ts](vite.config.ts))
- React 19 + MUI 6 + Framer Motion 12 (real deps, not CDN)
- Components extracted into [src/components/](src/components/)
- Hooks under [src/hooks/](src/hooks/)
- Content/data under [src/data/](src/data/) (`content.ts`, `experience.ts`, `skills.ts`)
- Gallery loads dynamically via `/api/gallery` on Vercel, falls back to directory listing locally
- Timeline filter chips (All / Work / Extracurricular)
- Ambient pointer spotlight, reveal animations, typed section titles

**In flux:**
- The legacy [scripts/mui-app.js](scripts/mui-app.js) is still present. The new `src/` tree mirrors and supersedes most of its logic. Confirm which entry the HTML files actually load before editing.

---

## 3. Setup & Run

```bash
npm install
npm run dev          # vite dev server on :5173
npm run build        # production build
npm run preview      # preview the build
npm run lint
npm run format
```

The old static-server instructions (`py -m http.server 5500`) in [Readme.md](Readme.md) are stale — they only work against the legacy `scripts/mui-app.js` flow. Use `npm run dev` for the current setup.

---

## 4. Architecture Overview

**Entry pages** (each has its own HTML file with `data-page` attribute):
- [index.html](index.html) — `data-page="home"` — renders `AboutPage` + `ContactPage`
- [about.html](about.html) — `data-page="about"` — renders `AboutPage` only
- [contact.html](contact.html) — `data-page="contact"` — renders `ContactPage` only

Header nav resolves to section anchors when on `home`, and to `index.html#...` from `about`/`contact`.

**Key components** ([src/components/](src/components/)):
- `AboutPage.tsx`, `ContactPage.tsx` — page-level
- `InteractiveCvTimeline.tsx` — timeline with slope geometry, filters, detail card
- `RotatingPhotoGallery.tsx` — pointer-driven gallery + dot controls + touch swipe
- `TypedSectionTitle.tsx` — section titles that type on enter / erase on leave
- `Reveal.tsx` — fade + slide reveal animations
- `InteractiveCard.tsx` — uses `motion.div`

**Hooks** ([src/hooks/](src/hooks/)):
- `useAmbientPointer.ts` — global cursor spotlight (writes CSS vars)
- `useGalleryPhotos.ts` — image discovery (Vercel API + local fallback)
- `useVisitorStats.ts`, `useClock.ts`, `useTorontoAvailability.ts`, `useIsNarrowViewport.ts`

**Styles:**
- [styles/revamp.css](styles/revamp.css) — primary
- [styles/dynamic-ui.css](styles/dynamic-ui.css) — layout-sensitive / dynamic rules

**Serverless:**
- [api/gallery.js](api/gallery.js) — lists `images/` for the gallery
- [api/stats.js](api/stats.js) — visitor stats

---

## 5. Content & Tone (Hard Rules)

The owner has strong, repeated preferences:

- Plain, direct, professional. **No** salesy / desperate / buzzword phrasing.
- Do not reintroduce "resume inflation" wording.
- Prefer plain language over hype.

**Why this matters:** these rules have been re-enforced across multiple edit cycles. Violating them is the fastest way to get a change reverted.

---

## 6. Removed Elements — Keep Removed

Do **not** reintroduce these without explicit instruction:

- "Experience overview" heading in right profile card
- "Work photos" chip
- "Move cursor to change photo" helper line
- "Current internship" block under profile photo
- Separate "Full CV" section (all experience lives in the timeline)
- Static hero line: *"I build internal tools, reporting workflows, and systems documentation."*
- "Sample performance feedback" label chip above rotating quote card
- Gallery chip text: *"Software, systems, TPM"*
- Three-item profile story block ("Lockheed Martin internships." / "Global Affairs Canada work term." / "Student organization projects.")

---

## 7. Layout Rules

**Profile area** uses `.contact-panel-grid`. The right photo panel must **not** stretch to match left card height.

Anti-stretch rules — keep these intact:
- [styles/dynamic-ui.css](styles/dynamic-ui.css):
  - `.contact-panel-grid { align-items: start; grid-auto-rows: min-content; }`
  - `.profile-gallery-panel { align-self: start; height: auto; min-height: 0; }`
- Inline `sx` on the profile gallery card: `{ alignSelf: "flex-start", height: "auto", minHeight: 0 }`

**Profile gallery meta header** must remain responsive (`profile-gallery-meta` switches row → column on small viewports).

---

## 8. Gallery Behavior

- Pointer-driven (cursor position changes image); dot controls retained.
- Images loaded dynamically — **not** hardcoded:
  - Vercel: `/api/gallery`
  - Local: directory index parsing via `fetch("images/")` (requires a server that lists directories)
- Profile quote card is synced to photo index (hover or dot change updates quote immediately).
- Mobile: touch drag + swipe-settle. Horizontal drags use `preventDefault` to avoid page drift. `.portrait-frame--gallery` uses `touch-action: pan-y` so vertical scroll still works.

If touching gallery code, verify it handles spaces and mixed-case extensions in filenames.

---

## 9. Timeline Rules

- All experience lives in the timeline. **No separate "Full CV" section.**
- Order: **earliest left → latest right.**
- Data: `professionalExperienceFull` + `extracurricularExperienceFull` (in [src/data/experience.ts](src/data/experience.ts)).
- Sorting: `parseTimelineStart(...)` → ascending into `cvTimelineEntries`.
- Desktop width breakout: `.timeline-section--wide` → `width: min(1480px, calc(100vw - 2.8rem))`, centered offset margin. Mobile resets at `max-width: 980px`.

**Visual geometry:**
- Nodes are vertically offset (left-low → right-high slope).
- Rail (`.cv-timeline-rail`) is rotated slightly upward toward the right.
- Node pin uses ring + inner-core styling via `--node-color`.
- Node sizing is `clamp(...)` based — **do not hard-code inline** (mobile breakpoints depend on this).
- Detail chips wrap on small screens (`.cv-timeline-detail__chips`).

**Filters:** All / Work / Extracurricular. Default is All. Selected node is preserved across filter changes if still visible; otherwise resets to first visible entry.

**Mobile (`<= 980px`):**
- Slope disabled in JS so cards sit flat.
- Horizontal snap + touch panning (`scroll-snap-type`, `touch-action: pan-x`).
- Preserve `-webkit-overflow-scrolling: touch` + contained horizontal overscroll.

**Most recent CV updates applied** (do not regress):
- Lockheed Martin TPM intern: `Jan 2026 – Apr 2026`
- En Ville: `May 2022 – Aug 2022`
- Global Amusement Consulting (Sales Associate): `Jul 2021 – Aug 2021`
- Goldman Sachs Risk Job Simulation credential: `Sep 2025` (with credential ID)
- Education block: Queen's degree details + A.Y. Jackson activities
- Stack tabs: Programming Languages, Frameworks & Tools, Cloud & Databases, Data Science & ML, System Design, Software Testing, Spoken Languages, Achievements

---

## 10. Known Issues & Workarounds

### Dual codebase (legacy + Vite)
The repo contains both [scripts/mui-app.js](scripts/mui-app.js) (legacy CDN/Babel) and [src/](src/) (Vite/TS). Edits should land in `src/` going forward. Before any major change, confirm which entry the HTML files load (look at `<script>` tags in `index.html` / `about.html` / `contact.html`).

### Stale cache symptoms
If removed UI reappears in the browser, assume **stale cache first**. HTML files use cache-busting query params (e.g. `?v=20260413-17`). Bump the version string when shipping CSS/JS changes.

### Stale README
[Readme.md](Readme.md) still documents the static-server run flow (`py -m http.server 5500`). It applies only to the legacy path. Update or remove when the legacy file is deleted.

### Gallery local fallback needs directory listing
The local fallback (`fetch("images/")`) only works against a server that returns HTML directory listings. The Vite dev server may not. Prefer running against `/api/gallery` for parity with production.

---

## 11. Motion Preferences

- Reveal transitions are intentionally slightly slower.
- Reveal effect = fade + slight horizontal slide (**not** heavy rotation).
- Direction alternates section-by-section: right, left, right, left. This alternation must remain visible scrolling **both** up and down.
- Current reveal timing (`.reveal-rotate` in [styles/dynamic-ui.css](styles/dynamic-ui.css)):
  - `opacity 520ms ease 90ms`
  - `transform 620ms cubic-bezier(...) 90ms`

**Typed section titles** ([TypedSectionTitle.tsx](src/components/TypedSectionTitle.tsx)):
- Type in on enter viewport, erase on leave.
- Include occasional typo → backspace → correction frames.
- Caret styling: `.typed-title-caret` + `@keyframes caretBlink` in [styles/revamp.css](styles/revamp.css).

**Ambient pointer spotlight** ([useAmbientPointer.ts](src/hooks/useAmbientPointer.ts)):
- Must track cursor precisely — no obvious lag or offset.
- Listens to `pointermove` and `pointerrawupdate` (when supported), writes exact viewport coords to CSS vars.
- `body::after` renders as fixed, centered spotlight (`left/top + translate(-50%, -50%)`), **not** a full-screen background gradient.

Keep motion subtle and purposeful.

---

## 12. Accordion UX (Technical Focus)

- Right-side toggle must stay visually obvious — clear affordance (index + chevron), not a bare number.
- Summary text must reserve horizontal space for the right-side toggle.
- No overlap between long summary copy and the expand control.

---

## 13. Immediate Next Steps

In priority order, things a future contributor should consider:

1. **Resolve the dual codebase.** Decide whether to delete [scripts/mui-app.js](scripts/mui-app.js) and migrate any remaining unique logic into `src/`. Update HTML entry points accordingly.
2. **Update [Readme.md](Readme.md)** to reflect the Vite setup (`npm run dev`, not `py -m http.server`).
3. **Replace cache-busting query strings** with Vite's content-hashed asset output once the legacy path is removed.
4. **Audit components in [src/components/](src/components/)** against the rules in §6–§9 to confirm none of the removed elements have crept back.

---

## 14. Pre-Merge Regression Checklist

After meaningful changes, verify:

1. Header nav links work on all three pages.
2. Profile right panel has no awkward empty space below photo.
3. Removed profile story block has not reappeared.
4. Gallery loads from `images/` and responds to pointer movement.
5. Timeline is still earliest-left → latest-right.
6. No "Full CV" section reintroduced.
7. Copy is plain and non-buzzwordy.
8. Technical Focus accordion summary does not overlap the right toggle.
9. Reveal animation alternates left/right between adjacent sections (scrolling up **and** down).
10. Mobile timeline: slope disabled, horizontal swipe works.
11. Mobile gallery: vertical page scroll still works while scrubbing photos.

---

## 15. Guardrails for Future Models

Before any edit:
- Re-read §5 (tone) and §6 (removals).
- Confirm whether you're editing `src/` or `scripts/mui-app.js`. Default: `src/`.
- For layout changes: verify removed items aren't reintroduced.
- For timeline changes: chronological order must hold.
- For gallery changes: dynamic loading must handle spaces and mixed-case extensions.
- For desktop layout changes: preserve mobile behavior.
