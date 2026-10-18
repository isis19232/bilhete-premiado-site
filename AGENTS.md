# AGENTS.md

## Architecture
A static landing page with no build step. Netlify publishes `public/` (see `netlify.toml`).

- `public/index.html`: the whole page (nav, hero with ticket illustration, how it works, benefits, FAQ, CTA, footer). The copy is in pt-BR.
- `public/styles.css`: all styles. Theme tokens are CSS variables in `:root`.

## Conventions and decisions
- The Meta Pixel snippet sits in `<head>` of `index.html`, exactly as the owner supplied it. If you add more pages, copy the snippet into each page's `<head>`. Keep the pixel ID unchanged.
- Only `PageView` is tracked. If you add conversion events, call `fbq('track', 'Lead')` (or similar) from the CTA buttons.
- Keep the responsible-gaming notice (18+) in the footer.
- The primary CTA's `href` is a placeholder (`#`).
