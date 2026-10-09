# Verification — 9 October 2026

## Build and media

- `npm run build`: TypeScript and Vite production build pass.
- `npm run media:verify`: all 42 MP4 renditions pass codec, pixel format, duration, aspect ratio, frame rate, audio codec, HD dimension and fast-start checks.
- 21 originals are represented by 17 finished projects and 4 paired source videos. The Base and Altao PP were added after the user supplied the missing files.
- Original videos are preserved in `VideoPortfolio`. Samples were inspected through three extracted frames per finished project rather than full viewing.
- Measured totals: originals 1,621,751,889 bytes; light 86,135,001 bytes; HD 494,627,561 bytes.
- Gallery uses image posters only. Complete MP4s mount when opening a project; the player code is a separate lazy-loaded bundle. Hero previews are short and silent.

## Browser checks

Checked in the Codex browser at desktop 1440 × 1000 and mobile 390 × 844 viewports:

- All 17 projects render. Category counts: commercial 5, expert 4, motion 6, creative 2. Rasul Abdulla client filter returns 2 projects.
- Mobile menu opens, navigation selects the requested section and closes the menu.
- Finished video plays; pause, seek, mute and fullscreen controls work.
- HD loads 1080 × 1920 for the tested portrait project; the light version loads 540 × 960.
- Both before/after videos play together. Original is muted; measured timestamps were within 0.1 seconds, both readyState 4. This is timeline synchronization, not semantic shot matching: editing can change timing.
- Seeking and pausing do not produce false playback errors. Interrupted play promises are handled.
- Source-only mode loads the paired original rendition.
- Escape closes the project, restores the trigger's focus and unlocks page scrolling.
- The still-comparison slider reaches both ends and switches projects.
- No horizontal page overflow at the tested widths. Mobile comparison keeps both panels visible and controls usable.
- Browser console returned no errors or warnings after the fixes.
- CV page opens with all supplied biography, skill, software, industry, format and contact details. Its print stylesheet and button are present; an actual PDF export was not performed.

## Review and limits

21st review found no error-level issues. Removed its autofocus warning; native dialog focus behavior remains. Informational color-token notices reflect the intentionally authored palette and tonal variants.

Applied the unslop React, structure and noise checks. Effects synchronize browser APIs only; filters are derived during render; player state resets use component keys; the media encoder writes temporary files before publishing completed outputs.

Screenshots are in `output/screenshots`. Static deployment is not performed. HTTP Range, caching and performance on a public host should be verified after selecting hosting. Adaptive HLS is not implemented; this site uses demand-loaded fast-start MP4s with manual light/HD selection. Quality changes restart playback. Cross-browser device testing is still needed before public launch.

## Brand and menu revision — 10 October 2026

- Stacked DUB / AEV artwork and horizontal DUBAEV variants are available as transparent green/white PNGs and path-based SVGs. PNG exports are rendered from the SVG masters; the favicons use heavier strokes for small-size readability.
- Experimental outline hero name uses the same glyph system. The original bold name remains in a JSX comment per the user's request.
- Official Adobe Premiere Pro, After Effects and Photoshop icons load successfully from local files.
- Client menu mouse selection returns 2 Rasul projects; keyboard Home and Enter restore all 17. Escape closes the list and returns focus to the combobox.
- 21st review of all 5 changed React files reports 0 findings. Production build passes.
- Mobile client menu fits within the viewport; selecting The Base returns 1 project. The new quality menu selects `/media/base-hd.mp4`, which plays at 1080 × 1920. Browser reports no errors.
- Green and white square PNGs are 1024 × 1024 RGBA with alpha ranging from 0 to 255; horizontal exports are 2048 × 263. Header logo responds to keyboard focus with the white treatment.

## Responsive and preview audit — 10 October 2026

- Storytelling is intentionally a still poster, not a failed video. Desktop has two silent looping previews (Academy and BG Optics); below 700 CSS pixels, BG Optics becomes a poster and only Academy plays. Preview pause/resume and offscreen suspension were verified. No autoplay was added to Storytelling.
- Browser viewport checks: 320 × 700, 375 × 812, 390 × 844, 430 × 932, 601 × 800, 768 × 1024, 844 × 390 and 1440 × 1000. Document scroll width equals client width at every tested size. Scrollbars reduce the available content width by 15 pixels in these checks.
- Found and fixed the client list extending beyond the short landscape viewport. Both client and quality menus now choose the available direction and constrain their height, with internal scrolling. Quality menus also respect the dialog's visible bounds. Option focus does not scroll the entire page; keyboard navigation reveals the focused option inside the list.
- Mobile navigation opens and closes after selecting Work and About. Client filtering returns two Rasul projects, category filtering returns six motion projects, and resetting restores all 17.
- At 320 pixels, all three player modes and video controls fit. In comparison playback, both videos reached readyState 4 and progressed together with a measured difference under 0.1 seconds. Pause and seek affect both videos. Escape dismisses the quality menu while leaving the dialog open. HD selection loads both paired HD sources.
- Biography, contacts and CV remain readable on the 390-pixel viewport. No horizontal overflow was found on the CV. Physical iOS/Safari and Android devices were not tested.
- Production build passes. 21st review reports no errors or warnings; the changed SelectMenu component has no findings. Browser console has no errors or warnings. Unslop review found no further actionable issues in this small change; the layout effect synchronizes DOM geometry and cleans up its browser listeners.
- Evidence: `output/screenshots/responsive-mobile-hero.jpg`, `responsive-mobile-gallery.jpg`, `responsive-mobile-comparison.jpg` and `responsive-landscape-menu.jpg`.

## Hero overlap and text motion — 10 October 2026

- Constrained the hero media group to 410px on desktop, 330px below 1100px and 290px below 800px. The existing phone layout and 48px space above the media group remain. Side frames now overlap the central frame even on a wide screen.
- Added one-time viewport reveals for hero text, section headings, introductory copy, capability summaries and the contact heading. The browser's Web Animations API handles a 620ms opacity/20px lift with 60–120ms delays; there is no animation library or per-scroll React state.
- Content remains visible by default. Reduced-motion preferences skip animation setup, and turning reduced motion on cancels running reveals. Observer, preference listener and running animations are cleaned up on unmount.
- Checked 1920 × 1080, 1440 × 1000, 390 × 844 and 320 × 700 in the browser. No horizontal overflow. Confirmed the first heading starts at opacity 0 / 20px vertical translation and finishes at opacity 1 / no transform; navigation and gallery headings remain readable. Browser console contains no errors or warnings.
- Production build passes; 21st review reports no errors or warnings. Unslop review of the animation hook found no further actionable issues: the effect synchronizes browser visibility and animation APIs only.
- Evidence: `output/screenshots/hero-overlap-desktop.jpg` and `hero-overlap-mobile.jpg`. Physical-device and reduced-motion emulation were not performed; reduced-motion behavior was checked in source.
