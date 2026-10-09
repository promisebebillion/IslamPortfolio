# Islam Dubaev — video portfolio

React + TypeScript + Vite. English portfolio for a video editor and motion designer, built around the supplied videos and CV.

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

`npm run brand:prepare` regenerates the vector path artwork, transparent 1024 × 1024 logo PNGs, horizontal variants and favicons. Files are in `public/brand`; green and white exports are included. The header uses the compact vector for legibility at small sizes and turns white on hover or keyboard focus.

The trial outline name is in `src/Hero.tsx`. The previous bold wordmark is preserved in the adjacent JSX comment at the user's explicit request; its existing CSS remains. Restore that line and remove the signature image to return to the old treatment.

Adobe app icons are stored locally; their official source links are recorded in `public/icons/SOURCES.md`. Client filtering and quality selection share `SelectMenu`, with arrow keys, Home/End, Enter, Escape, focus restoration and outside-click dismissal.
