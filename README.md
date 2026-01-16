# Hongbo Wei — Portfolio

Interactive portfolio with supporting pages (experience, matrix demo, visitor map, 404). PWA-enabled with offline support.

## Run locally
```bash
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload
npm test             # Run unit tests
npm run build        # Production build
```
Or open `index.html` directly / `python -m http.server 8000`.

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Watch + live reload server |
| `npm run build` | Minify CSS & JS |
| `npm test` | Run Jest unit tests |
| `npm run test:coverage` | Test with coverage report |

## Lint
- CI runs HTMLHint on `*.html`. Run locally: `npx --yes htmlhint@1.1.4 *.html -c .htmlhintrc`.

## Structure
- Styles: `assets/css/main.sass` entrypoint importing Sass partials under `assets/css/base`, `assets/css/layouts`, and `assets/css/modules/`; compiled output lives at `assets/css/main.css`. Matrix page uses `assets/css/matrix.css`.
- Scripts: `assets/js/app.js` (navigation, slider, map fallback), `assets/js/matrix.js`, vendor libs in `assets/js/vendor/`.
- Tests: `assets/js/app.test.js` — 47 unit tests for utility functions.
- Media: `assets/img/` for logos/illustrations, `assets/music/` for audio.
- PWA: `sw.js` (service worker), `offline.html` (fallback page), `site.webmanifest`.

## Features
- **PWA**: Installable with offline support via service worker
- **Keyboard navigation**: Up/Down arrows for sections, Left/Right for project slider
- **Touch gestures**: Swipe navigation on mobile
- **Performance**: Lazy loading, minified assets, WebP images

## Behavior notes
- Navigation: header logo links to `index.html`; outer nav/side nav handled by `assets/js/app.js`.
- Contact card: right-aligned on desktop, auto-centered on mobile; shared styling lives in `assets/css/main.css` and `_contact.sass`.
- Visitor globe: ClustrMaps embed with iframe fallback to `map.html` on devices that block the script.
- Safe areas: header/top spacing uses `env(safe-area-inset-*)` to avoid mobile browser UI overlap.

## Credits
- Base template: [Bucky Maler — global](https://github.com/BuckyMaler/global)
- Adaptations: [Ginny Dang — ginny100.github.io](https://github.com/ginny100/ginny100.github.io)
