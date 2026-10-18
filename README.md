# Bilhete Premiado

A one-page landing site for Bilhete Premiado, written in Brazilian Portuguese, with Meta Pixel tracking (pixel ID `3403639113154818`) that fires a `PageView` on every visit.

## Tech
- Plain static HTML and CSS. No framework and no build step.
- Hosted on Netlify, which serves the `public/` folder.

## Run locally
```bash
netlify dev --port 8889
```
Or open `public/index.html` in a browser.

## Editing
- Copy and sections: `public/index.html`
- Colors and layout: `public/styles.css` (theme variables live in `:root`)
- The "Garantir meu bilhete" call-to-action links to `#` for now. Point it at the real checkout or signup URL.
