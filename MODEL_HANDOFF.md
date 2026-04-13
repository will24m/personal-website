# Website Handoff Notes (Model-Readable)

This file captures current website direction, implementation choices, and guardrails for future edits.

## 1) Project Setup and Architecture

- Entry pages:
  - `index.html` (`data-page="home"`)
  - `about.html` (`data-page="about"`)
  - `contact.html` (`data-page="contact"`)
- Main app logic: `scripts/mui-app.js` (React + MUI via CDN + Babel in browser)
- Primary styles: `styles/revamp.css`, `styles/dynamic-ui.css`
- Assets folder: `images/`
- Page render behavior in `App()`:
  - `home` renders `AboutPage` + `ContactPage`
  - `about` renders `AboutPage` only
  - `contact` renders `ContactPage` only
- Header nav links are resolved to section anchors on `home`, and to `index.html#...` from `about`/`contact`.

Repo cleanup completed:

- Consolidated readme files:
  - Removed obsolete `READ.me`
  - Replaced empty `Readme.md` with run/deploy/structure notes
- Removed legacy unused files:
  - `scripts/app.js`
  - `scripts/script.js`
  - `styles/styles.css`
- Removed dead code from `scripts/mui-app.js`:
  - `HomePage`
  - `HeroPanel`
  - `CountUp`
  - `RotatingWord`
  - legacy `experiences`/`quickStats` data used only by removed components

This is a static site (no build step). Local run:

```powershell
py -m http.server 5500
```

## 2) Tone and Content Direction

User preference is clear:

- Keep copy grounded, direct, and professional.
- Avoid desperate, salesy, or buzzword-heavy phrasing.
- Prefer plain language over hype.
- Do not reintroduce "resume inflation" wording.

## 3) Specific Removals Requested by User

Keep these removed unless user explicitly asks for them back:

- "Experience overview" heading in right profile card
- "Work photos" chip
- "Move cursor to change photo" helper line
- "Current internship" block under the profile photo
- Separate "Full CV" section
- Static hero line "I build internal tools, reporting workflows, and systems documentation."
- "Sample performance feedback" label chip above rotating quote card
- Bottom gallery chip text "Software, systems, TPM" on profile photos
- Three-item profile story block under the education sentence
  - "Lockheed Martin internships."
  - "Global Affairs Canada work term."
  - "Student organization projects."

## 4) Layout and Space Fixes

- Profile area uses `.contact-panel-grid`.
- Right photo panel must not stretch to match left card height.
- Anti-stretch rules:
  - CSS in `styles/dynamic-ui.css`:
    - `.contact-panel-grid { align-items: start; grid-auto-rows: min-content; }`
    - `.profile-gallery-panel { align-self: start; height: auto; min-height: 0; }`
  - JSX inline safety in `scripts/mui-app.js` on the profile gallery card:
    - `sx={{ alignSelf: "flex-start", height: "auto", minHeight: 0 }}`

## 5) Cache and Stale UI Guidance

- If user still sees removed UI, assume stale cache first.
- HTML pages currently use cache-busting query params:
  - `styles/revamp.css?v=20260413-17`
  - `styles/dynamic-ui.css?v=20260413-17`
  - `scripts/mui-app.js?v=20260413-17`
- Keep version string updated when necessary.

## 6) Gallery Behavior

Current behavior:

- Pointer-driven gallery (changes image by cursor position)
- Dot controls retained
- Images auto-loaded from `images/` directory (not hardcoded)
  - On Vercel: via serverless endpoint `api/gallery.js` (`/api/gallery`)
  - Local fallback: directory index parsing via `fetch("images/")`
- Profile quote card is synchronized to photo index.
  - Hover or dot-switching photo changes quote immediately.
  - Quotes are sample performance-feedback style content.

Implementation points in `scripts/mui-app.js`:

- `useGalleryPhotos()`
- `buildGalleryPhotosFromIndex(...)`
- `filenameToAlt(...)`

Note: relies on directory listing from local server (works with `python -m http.server`).
For deployment compatibility, prefer keeping `/api/gallery` available so folder listing is not required in production.

## 7) Timeline Rules

- All experience content should live in timeline (no separate full CV block).
- Timeline order must be earliest on left and latest on right.
- Data sources:
  - `professionalExperienceFull`
  - `extracurricularExperienceFull`
- Timeline mapping/sorting:
  - `toTimelineEntry(...)`
  - `parseTimelineStart(...)`
  - sorted ascending into `cvTimelineEntries`
- Timeline width rule (desktop):
  - Timeline section uses `timeline-section--wide` breakout to use more side space than base page width.
  - CSS: `width: min(1480px, calc(100vw - 2.8rem))` with centered offset margin.
  - Mobile reset at `max-width: 980px` returns to normal section width.
- Timeline visual geometry:
  - Nodes are intentionally vertically offset to create a left-low to right-high slope.
  - Timeline rail is rendered as `.cv-timeline-rail` and rotated slightly upward toward the right.
  - Node pin/dot uses ring + inner-core styling via CSS variables (`--node-color`) for less awkward visuals.
  - Node sizing is responsive (`clamp(...)`) and no longer hard-coded inline, so mobile breakpoints can actually apply.
  - Timeline detail chips wrap on small screens (`.cv-timeline-detail__chips`) to avoid overflow.
- Timeline filters:
  - Three filter chips are available: `All`, `Work`, `Extracurricular`.
  - Default state is `All`.
  - `Work` and `Extracurricular` filter both timeline nodes and active detail card.
  - When changing filters, selected node is preserved if still visible; otherwise it resets to the first visible entry.
- Mobile timeline interaction:
  - On narrow viewports (`<= 980px`), timeline slope is disabled in JS so cards sit flat for easier horizontal swipe.
  - Timeline strip uses horizontal snap and touch panning (`scroll-snap-type`, `touch-action: pan-x`).
- CV refresh updates applied:
  - Lockheed Martin TPM intern updated to `Jan 2026-Apr 2026`.
  - En Ville timeframe updated to `May 2022-Aug 2022`.
  - Global Amusement Consulting Sales Associate timeframe updated to `Jul 2021-Aug 2021`.
  - Added `Goldman Sachs - Risk Job Simulation (Credential)` entry (`Sep 2025`, credential ID included).
  - Education block in profile now shows Queen's degree details + A.Y. Jackson details and activities.
  - Stack tabs expanded to CV categories: Programming Languages, Frameworks & Tools, Cloud & Databases, Data Science & ML, System Design, Software Testing, Spoken Languages, Achievements.

## 8) Motion Preference

- Reveal transitions are intentionally slightly slower.
- Reveal effect should be fade + slight horizontal slide (not heavy rotation).
- Direction should alternate section-by-section: right, left, right, left.
- This alternation should remain visible while scrolling up and down.
- Current reveal timing:
  - `.reveal-rotate` in `styles/dynamic-ui.css`
  - `opacity 520ms ease 90ms`
  - `transform 620ms cubic-bezier(...) 90ms`
- Section title typing behavior:
  - Major section titles use `TypedSectionTitle` in `scripts/mui-app.js`.
  - Titles type in when entering viewport and erase when leaving viewport.
  - Typing includes occasional typo -> backspace -> corrected character frames.
  - Caret styling is in `.typed-title-caret` and `@keyframes caretBlink` in `styles/revamp.css`.

Keep motion subtle and purposeful.

Ambient pointer light behavior:

- Global spotlight should track cursor precisely (no obvious lag or offset).
- `useAmbientPointer()` listens to `pointermove` and `pointerrawupdate` (when supported) and writes exact viewport coordinates to CSS vars.
- `body::after` now renders as a fixed, centered spotlight element (`left/top + translate(-50%, -50%)`) instead of a full-screen gradient anchored by background-position.

Mobile gallery interaction:

- Gallery supports touch drag/scrub + swipe settle in `RotatingPhotoGallery`.
- Horizontal touch drags are detected and handled with `preventDefault` to avoid accidental page drift while scrubbing photos.
- `.portrait-frame--gallery` uses `touch-action: pan-y` so vertical page scrolling still works naturally.

## 9) Accordion UX Rule (Technical Focus)

- In the Technical Focus accordion, right-side toggle must stay visually obvious.
- Use a clear toggle affordance (index + chevron), not just a bare number.
- Summary text must reserve horizontal space for the right-side toggle.
- Ensure no overlap between long summary copy and the expand control.

## 10) Guardrails for Future Models

- Before copy edits, preserve direct and non-hype tone.
- Before layout edits, verify removed items are not reintroduced.
- When touching timeline, verify chronological order still holds.
- When touching gallery, verify dynamic loading still handles spaces and mixed-case extensions.
- Preserve mobile behavior when changing desktop layout.
- Keep profile gallery meta header responsive:
  - `profile-gallery-meta` switches from row to column on small viewports.
- Timeline mobile touch UX:
  - Preserve horizontal scrolling with touch momentum (`-webkit-overflow-scrolling: touch`) and contained horizontal overscroll.

## 11) Quick Regression Checklist

After meaningful changes, verify:

1. Header nav links still work.
2. Profile right panel does not show awkward empty space below photo.
3. Removed profile story block does not reappear.
4. Gallery loads from `images/` and responds to pointer movement.
5. Timeline remains earliest-left to latest-right.
6. No reintroduced "Full CV" section.
7. Copy remains plain and non-buzzwordy.
8. Technical Focus accordion summary text does not overlap the right toggle.
9. Reveal animation alternates left/right between adjacent sections.
