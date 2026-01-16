# Hongbo Wei — Portfolio

Interactive portfolio with supporting pages (experience, matrix demo, visitor map, 404). Pure HTML/CSS/JS—no build tooling or package installs needed.

## Run locally
- Open `index.html` directly, or serve the repo root: `python -m http.server 8000`.
- Key pages: `index.html` (home), `experience.html` (work/skills), `matrix.html` (matrix effect demo), `map.html` (visitor map fallback), `404.html`.

## Lint
- CI runs HTMLHint on `*.html`. Run locally: `npx --yes htmlhint@1.1.4 *.html -c .htmlhintrc`.

## Structure
- Styles: `assets/css/main.sass` entrypoint importing Sass partials under `assets/css/base`, `assets/css/layouts`, and `assets/css/modules/`; compiled output lives at `assets/css/main.css`. Matrix page uses `assets/css/matrix.css`.
- Scripts: `assets/js/script.js` (navigation, slider, map fallback), `assets/js/matrix.js`, vendor libs in `assets/js/vendor/`.
- Media: `assets/img/` for logos/illustrations, `assets/music/` for audio.

## Behavior notes
- Navigation: header logo links to `index.html`; outer nav/side nav handled by `assets/js/script.js`.
- Contact card: right-aligned on desktop, auto-centered on mobile; shared styling lives in `assets/css/main.css` and `_contact.sass`.
- Visitor globe: ClustrMaps embed with iframe fallback to `map.html` on devices that block the script.
- Safe areas: header/top spacing uses `env(safe-area-inset-*)` to avoid mobile browser UI overlap.

## Credits
- Base template: [Bucky Maler — global](https://github.com/BuckyMaler/global)
- Adaptations: [Ginny Dang — ginny100.github.io](https://github.com/ginny100/ginny100.github.io)
