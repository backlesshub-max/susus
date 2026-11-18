# Raha College NSS Website

Primary website: https://rahacollegenss.in/

This repository contains the static front-end for the Raha College NSS portal. The visual design and existing interactions are retained while the source is organized into smaller files.

## Project structure

- `index.html` — shared home-page markup, navigation shell, footer, and metadata
- `assets/css/base.css` — core layout and base styles
- `assets/css/consent.css` — entry terms and consent interface
- `assets/css/nss-theme.css` — NSS theme and component styling
- `assets/css/overrides.css` — responsive and final visual overrides
- `assets/js/volunteers.js` — the 12 volunteer display slots
- `assets/js/page-data.js` — titles and metadata for routed pages
- `assets/js/app.js` — navigation, interactions, SEO route updates, and page loading
- `pages/*.html` — separate HTML content fragments for each information page
- `robots.txt` and `sitemap.xml` — crawler directives and canonical URL list

## Editing a page

Edit the relevant file in `pages/` to change the content of an information page. Edit `assets/js/page-data.js` to change its title or eyebrow label. Shared visual styling belongs in `assets/css/`.

## Deployment

Vercel is the production host and deploys from the `main` branch. Changes on a feature branch do not change the live website until they are reviewed and merged into `main`.

This is a static HTML/CSS/JavaScript website. A Python backend or Java runtime is not required for the current front-end features.
