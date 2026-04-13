# Website Handoff Notes (Model-Readable)

This file captures current website direction, implementation choices, and guardrails for future edits.

## 1) Project Setup and Architecture

- Main entry page: `index.html`
- Main app logic: `scripts/mui-app.js` (React + MUI via CDN + Babel in browser)
- Primary styles: `styles/revamp.css`, `styles/dynamic-ui.css`
- Assets folder: `images/`

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
- `index.html` currently uses cache-busting query params:
  - `styles/revamp.css?v=20260413-6`
  - `styles/dynamic-ui.css?v=20260413-6`
  - `scripts/mui-app.js?v=20260413-6`
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

## 8) Motion Preference

- Reveal transitions are intentionally slightly slower.
- Reveal effect should be fade + slight horizontal slide (not heavy rotation).
- Direction should alternate section-by-section: right, left, right, left.
- This alternation should remain visible while scrolling up and down.
- Current reveal timing:
  - `.reveal-rotate` in `styles/dynamic-ui.css`
  - `opacity 520ms ease 90ms`
  - `transform 620ms cubic-bezier(...) 90ms`

Keep motion subtle and purposeful.

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
