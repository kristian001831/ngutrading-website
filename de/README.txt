NGU Trading — static bilingual site (EN / DE)

Run locally:  python3 -m http.server 8000   (serve from repo root, open /en/ or /de/)
Deploy:       GitHub Pages, served at domain root. All asset + page links are root-absolute (/assets/, /en/, /de/).

SYNC RULE (important):
- Shared CSS/JS/fonts/images live ONCE in /assets/. Edit them there only.
- The en/ and de/ HTML trees must keep IDENTICAL structure and class names.
  Only the visible text differs. Any structural change goes into BOTH trees.
