# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website (Clement Tailleur) built with Create React App: portfolio/home page plus an interactive travel map. React 16.10.1 + react-router-dom 5.1.1 (both older than what `react-scripts` 5.0.1 expects — see `IMPROVEMENTS.md`/`MIGRATION_GUIDE.md` for a planned React 18 / Router v6 migration, not yet done).

## Commands

```bash
npm start            # dev server, http://localhost:3000
npm run build         # production build -> build/
npm test              # CRA/Jest interactive test runner
npm run deploy        # aws s3 sync build/ s3://clementtailleur.com  (profile: user-clement)
npm run cache          # CloudFront invalidation, distribution E2294DXPG9HTGF, paths '/*'
```

There is no separate lint script; ESLint runs via `react-scripts` using the `react-app` config (`eslintConfig` in `package.json`).

The AWS CLI is only available through the project's `.venv` (`.venv/bin/aws`) — this is not a Python project, the venv exists solely to provide `awscli`. Make sure `.venv/bin` is on `PATH` (or call the binary directly) before running `npm run deploy` / `npm run cache`.

## Deployment

Deploy is a three-step pipeline, both locally (`npm run deploy` + `npm run cache`) and in CI:
1. `npm run build`
2. `aws s3 sync build/ s3://clementtailleur.com` (CI adds `--delete` and also syncs `public/img/map/` separately)
3. CloudFront invalidation on distribution `E2294DXPG9HTGF`

CI (`.github/workflows/main.yml`) runs this automatically on push to `master`: build job → deploy job (S3 sync + map image sync) → clear_cache job (CloudFront invalidation), using `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_DEFAULT_REGION` repo secrets. `npm test` is not run in CI.

## Architecture

### Routing / i18n shell
`src/App.js` wraps everything in `LanguageProvider` (`src/i18n/LanguageContext.js`) then a `react-router-dom` v5 `Switch` with three routes: `/` → `HomeComponent`, `/ctr-map` → `JourneyPage`, catch-all → `NotFoundComponent`.

`LanguageContext` holds `locale` ('en'|'fr', persisted to `localStorage` under `ctr-site-locale`) and a `t(key, vars)` lookup into `src/i18n/messages.js`, falling back to English when a key is missing for the current locale.

### Map feature (`src/Components/Map/`)
This is the most involved part of the codebase — several files combine to render the interactive world map:

- `PersonalData.json` — the source of truth: an array of `travels`, each `{ country, city, coordinates, description, journey: [{ year, purpose, photos: [...], 'half-marathon'?: bool }] }`. Adding/editing a trip means editing this file (and adding matching photo files, see below).
- `MapData.js` — a large generated GeoJSON `FeatureCollection` of world country polygons; not meant to be hand-edited.
- `journeyModel.js` — derives everything else from `PersonalData`: per-purpose country lists (`visit`/`studies`/`work`), half-marathon countries, and `countryFillColor(name)` used to color the choropleth.
- `mapColors.js` / `leafletConfig.js` — shared color palette and Leaflet config (tile URL, default view, world bounds) reused by both maps below.
- `MainMap.js` — the main clickable world map (Leaflet + the `MapData` GeoJSON). Clicking a colored country zooms in and drops a marker per city from `PersonalData`; clicking a marker calls `showDescription`, which injects HTML built by `tripDescriptionHtml.js` via `innerHTML` (not JSX).
- `tripDescriptionHtml.js` — builds the detail panel: a Bootstrap carousel when a location has multiple photos across its `journey` entries. Photo `src` is always resolved against the **S3 bucket** (`IMG_BASE = https://s3.us-east-1.amazonaws.com/clementtailleur.com/img/map`), not the local dev server — so newly added photos won't render in local dev until they've been synced to S3 (`npm run deploy` also syncs `public/img/map/`, or use the CI's dedicated map-image sync step). Locally, photo files still need to exist under `public/img/map/<year>/<slug>/photoN.png` matching the relative path used in `PersonalData.json`'s `photos` arrays, since that's what gets synced. All carousel/single images share a common inline style (`PHOTO_STYLE`: fixed `aspect-ratio` + `object-fit: cover`) so photos for the same location render at identical dimensions and don't cause layout shift when scrolling through the carousel.
- `YearMap.js` — a second Leaflet map that highlights which countries were visited in a given year, using `travelYearData.js` (`buildTravelYearIndex`) to index `PersonalData` by year.
- `JourneyStatsSection.js` / `MapStatsChart.js` — aggregate stats/charts derived from `PersonalData`.
- `JourneyPage.js` — composes `MainMap` + `JourneyStatsSection` + `YearMap` for the `/ctr-map` route.

### Home feature (`src/Components/Home/`)
Landing page composed of `HomeHero`, `HomeStatsStrip`, charts (`HomePieChart`, `HomeSectorTreemap`, `HomeDataCharts`), and `HomeCvMetricsTable`, driven by `homeData.js`, `workExperiences.json`, and derived aggregates in `workExperienceAggregates.js`.

### Static assets outside the React bundle
`public/css`, `public/js`, and `public/fonts` come from a Bootstrap-based template and are loaded directly by `public/index.html` (global `<script>`/`<link>` tags), not imported as ES modules — Bootstrap's JS (carousel, etc.) is available globally, not via an npm package/component library.
