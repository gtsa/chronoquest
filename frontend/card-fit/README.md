# Card text fit validation

Run from `frontend`:

```bash
npm install
npx playwright install chromium
npm run validate:card-fit
npm run validate:card-fit -- card-fit/candidates.json
```

Input is a JSON array of `{ "id": "unique-id", "name": "Event title", "riddle": "...", "description": "..." }`. The command prints JSON with a worst-case status per candidate and separate measurements for every field and viewport. A later generation pipeline can write draft cards to a JSON file, invoke this command, parse stdout, regenerate `FAIL` text, and route `REVIEW` text to an editor. This is an editorial gate, not an approval of historical facts.

## Existing layout

The real `src/components/Card.tsx` is mounted in `card-fit.html` with its normal `Card.css` and `index.css`, drag provider and hard-difficulty riddle state. The front places the riddle in `.event-name` inside `.card-front`. Desktop cards are 250 × 400 CSS pixels; the front uses 1.5em text. On portrait phones the front becomes about 240 pixels wide and 9.7–11vh tall with roughly 13px text. The back has an image taking 40% of the desktop card and a `.card-back-low` taking 60%; `.card-details` gets 48% of that lower section, padding and `overflow: hidden`. Phone rules rearrange the image and text side by side, set description heights in vh and change font size/line height. Compact phones hide the back title. The CSS has overlapping media queries and viewport-relative sizes, so the browser's computed layout is authoritative.

The sampled viewport matrix is 1440×900 desktop, 430×932 normal portrait phone (401–768px tall-phone rule), 375×667 compact portrait phone (≤400px rule), 820×1180 tablet portrait, and 844×390 mobile landscape. Add more sizes when supported devices reveal additional edge cases, especially near media-query boundaries.

## Classification

The validator waits for fonts and a frame, disables animation timing during measurement, then uses DOM `Range.getClientRects()` for each word fragment. It measures real wrapped glyph rectangles against the face's available content box on the front and `.card-details` content box on the back, including clipping ancestors. It records lines, computed font and available dimensions for diagnosis. It does not infer fit from character or word counts.

- **FAIL:** empty text, horizontal or vertical glyph overflow, or clipping by a parent. Any failed variant fails the candidate.
- **REVIEW:** a word broken across lines, an isolated single word or final line under one quarter the preceding line's rendered width, or less than the greater of 3px and 0.35 computed line heights of clearance. Any reviewed variant reviews the candidate unless another fails.
- **PASS:** no measured issue across sampled variants.

Run `npm run test:card-fit` for automated assertions against the deliberately short, long-word, long and extreme sample cases. A failed assertion exits non-zero.

The final-line and clearance thresholds are editorial heuristics, not hard layout limits. Inspect `variants[].reasons`, `lines` and `marginPx` before rewriting. Extremely short lines and text near the boundary merit review even if fully visible.

## Limits

A real browser and the production font are required for trustworthy results. `index.css` requests Raleway from Google Fonts; if unavailable, fallback fonts may change wrapping. Verify the intended font loads in the validation environment before treating PASS as definitive. The default preview uses English, a fixed representative date and title, a local placeholder image, and an unsubmitted card. A candidate's actual title can influence the back layout; pass it as `name`. Date formatting/localisation, browser engine differences, OS font rendering, user zoom and accessibility text scaling can change results. Parent cards outside the preview's isolated mount may impose further constraints; this tests the Card component's own layout. Visual balance remains an editorial judgement.
