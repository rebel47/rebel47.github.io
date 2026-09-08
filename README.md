# Mohammad Ayaz Alam — Personal Portfolio

A personal website for my work in data science, AI engineering, and independent product development.

Live website: [rebel47.github.io](https://rebel47.github.io)

## Design and features

- Editorial typography, warm ivory and charcoal, and a restrained orange accent.
- Three featured projects and a searchable, filterable index of all 25 projects.
- Expandable work experience, education, and certifications.
- Light and dark themes, with a saved preference when browser storage is available.
- Responsive navigation, keyboard focus states, and reduced-motion support.
- Direct email, copy-email fallback, and the existing Formspree contact form.
- Downloadable résumé and a custom social sharing image.
- Content, résumé links, project links, and native disclosure panels work without JavaScript.

## Run locally

Open `index.html` directly, or serve the repository with Python:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000`.

There is no build step or package installation. The site uses HTML, CSS, and vanilla JavaScript. Google Fonts provides Manrope, Instrument Serif, and DM Mono, with system font fallbacks when offline.

## Files

- `index.html` — content, metadata, project index, and contact form.
- `style.css` — typography, layout, themes, responsive and print styles.
- `script.js` — progressive enhancement for navigation, filters, theme, and clipboard.
- `assets/CV.pdf` — downloadable résumé.
- `assets/social-preview.png` — social sharing card.
- `assets/favicon.png` — browser icon.
- `image/self1.png` — portrait; other original image assets remain available.

## Publishing

The repository uses GitHub Pages. Push reviewed changes to the configured publishing branch to update the live website. Local edits do not change the published site.

## Contact

- [GitHub](https://github.com/rebel47)
- [LinkedIn](https://linkedin.com/in/ayaz-alam)
- [Email](mailto:alam.ayaz47@gmail.com)
