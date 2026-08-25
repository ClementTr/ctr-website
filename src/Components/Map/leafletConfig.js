/** Options communes aux cartes Journey — Carto Voyager (sans libellés) */
export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png';

export const TILE_SUBDOMAINS = 'abcd';

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const WORLD_BOUNDS = [
  [-60, -180],
  [89, 180],
];

export const DEFAULT_VIEW = { center: [40, -7], zoom: 2.5 };
