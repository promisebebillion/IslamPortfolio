# Islam Dubaev — video portfolio

React + TypeScript + Vite, with Tailwind CSS and shadcn-compatible aliases. English-first portfolio with an EN/RU switch, built around the supplied videos, portrait and CV.

## Run locally

```text
npm install
npm run dev
```

Open the local URL printed by Vite. Build the static site with `npm run build`; preview it with `npm run preview`.

## Content

- `scripts/media-catalog.mjs` is the editable project catalog, including confirmed company names and before/after associations.
- `src/media.json` contains generated metadata and asset paths.
- `public/cv.html` is the printable CV. Its print button also supports saving a PDF from the browser.
- `docs/BRIEF.md` records the correspondence interpretation and visual direction.
- Original files stay in `VideoPortfolio` and are never modified.
- The repository includes all optimized media in `public/media`. Heavy originals in `VideoPortfolio`, local dependencies, build output and verification screenshots are excluded from Git. A fresh clone can run and build the complete site; regenerating media requires the original source folder.

## Media

```text
npm run media:inspect
npm run media:prepare
npm run media:verify
```

Inspection reads each file's duration, dimensions, frame rate and codec, extracts posters, and samples three frames. Preparation generates a light rendition and an HD rendition with H.264 video, AAC audio and fast-start metadata. HD keeps source dimensions and frame rate. Re-encoding is lossy; originals remain available in the source folder. The 21 originals total 1,621.8 MB; their light renditions total 86.1 MB and HD renditions 494.6 MB. `output/media/compression.json` reports measured sizes. Verification checks all 42 renditions and writes `output/media/verification.json`.

The gallery has no video elements, so it loads only images. Opening a project mounts its player. Hero previews are short, silent files, paused outside the viewport and when a modal is open. Reduced-motion and data-saver preferences disable initial autoplay. The quality selector lets viewers switch between light and HD. Before/after playback uses common controls, with audio only from the finished edit; the original holds its last frame when it is shorter.

## Deployment

Publish the generated `dist` folder on a static host with HTTP Range support. Large videos are best served from a CDN or object store; update the generated asset URLs if media is moved. Set cache headers for media (for example `Cache-Control: public, max-age=31536000, immutable` when using versioned paths) and validate `206 Partial Content` responses. HTML should revalidate on each visit. HLS is an optional future integration for a dedicated adaptive streaming service, not a requirement for this local portfolio.

The website has no server, analytics, credentials or contact form. Contact links point to the confirmed Telegram accounts and phone number. See `docs/VERIFICATION.md` for the completed checks.

## Design reference

The player interaction was informed by the [21st Video Player by Preet Suthar](https://21st.dev/@preetsuthar17/components/video-player), adapted to portrait media and paired comparisons without its styling/runtime dependencies. Typography is self-hosted Manrope and Instrument Serif.

## Brand assets and menu update

`npm run brand:prepare` regenerates the horizontal DUBAEV path artwork, transparent 2048-pixel-wide logo PNGs and favicons. Files are in `public/brand`; green and white exports are included. The header uses the horizontal vector and turns white on hover or keyboard focus. The favicon contains the same unbroken wordmark.

The trial outline name is in `src/Hero.tsx`. The previous bold wordmark is preserved in the adjacent JSX comment at the user's explicit request; its existing CSS remains. Restore that line and remove the signature image to return to the old treatment.

Adobe app icons are stored locally; their official source links are recorded in `public/icons/SOURCES.md`. Client filtering and quality selection share `SelectMenu`, with arrow keys, Home/End, Enter, Escape, focus restoration and outside-click dismissal.

## Languages and portrait

English is the default; EN/RU stores the visitor's choice locally and translates page copy, filters, project descriptions and player controls. Company names and software names remain unchanged. Translations live in `src/translations.ts`; `npm run cv:prepare` regenerates `public/cv-ru.html` from the English CV without changing links or brand names. This script requires Node 22.18+ for TypeScript stripping.

`npm run portrait:prepare` converts the supplied `public/me.HEIC` to the displayed `public/me.webp` (1100 × 1467). The biography uses the real portrait with its mountain setting.

The animated SVG hero background was removed following a reported slowdown when returning from the bottom of the page. Hero previews now retain their video sources while paused offscreen, so returning to the hero resumes playback without unloading and reloading the files. Text reveals remain one-time viewport animations.

The configured path for future reusable UI is `src/components/ui`, resolved as `@/components/ui`; shared utilities are in `src/lib`. `components.json`, the Vite alias and TypeScript paths support shadcn components. Tailwind's theme and utilities are enabled in `src/styles.css`; its reset is omitted to preserve the existing design. Add a future component using `npx shadcn@latest add <component>` and review its styles against the current tokens.
