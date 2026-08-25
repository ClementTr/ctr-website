import workData from './workExperiences.json';

const PLATFORM_KEYS = ['aws', 'gcp', 'databricks', 'spark'];
const BI_KEYS = ['tableau', 'metabase'];

const SEGMENT_COLORS = {
  aws: '#FF9900',
  gcp: '#4285F4',
  databricks: '#FF3621',
  spark: '#F4A261',
  tableau: '#E8762D',
  metabase: '#509EE3',
};

function makeCompanySets (keys) {
  /** @type {Record<string, Set<string>>} */
  const o = {};
  keys.forEach((k) => {
    o[k] = new Set();
  });
  return o;
}

/** Une mission qui utilise un outil compte pour 1 sur ce segment (pas de pondération par durée). */
function buildMissionCountsAndCompanies () {
  /** @type {Record<string, number>} */
  const platform = {};
  /** @type {Record<string, number>} */
  const bi = {};
  const platformCos = makeCompanySets(PLATFORM_KEYS);
  const biCos = makeCompanySets(BI_KEYS);

  PLATFORM_KEYS.forEach((k) => {
    platform[k] = 0;
  });
  BI_KEYS.forEach((k) => {
    bi[k] = 0;
  });

  const stackMeta = workData.tooling.stackComponents;

  for (const exp of workData.experiences) {
    const companyName = exp.company.name;
    const comps = exp.skills.modernDataStack.components || [];
    for (const id of comps) {
      if (!(id in stackMeta)) continue;
      if (PLATFORM_KEYS.includes(id)) {
        platform[id] += 1;
        platformCos[id].add(companyName);
      }
      if (BI_KEYS.includes(id)) {
        bi[id] += 1;
        biCos[id].add(companyName);
      }
    }
  }

  return { platform, bi, platformCos, biCos };
}

/**
 * @param {Record<string, number>} counts
 * @param {string[]} keys
 * @param {Record<string, Set<string>>} companySets
 */
function toPieSegments (counts, keys, companySets) {
  const entries = keys
    .map((key) => ({ key, count: counts[key] || 0 }))
    .filter((e) => e.count > 0);

  const sum = entries.reduce((s, e) => s + e.count, 0);
  if (sum <= 0) return [];

  return entries.map((e) => {
    const pct = (e.count / sum) * 100;
    const companies = Array.from(companySets[e.key]).sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );
    return {
      key: e.key,
      label: workData.tooling.stackComponents[e.key].label,
      percent: Math.round(pct * 10) / 10,
      color: SEGMENT_COLORS[e.key] || '#6c757d',
      companies,
    };
  });
}

const cache = buildMissionCountsAndCompanies();

/** Nombre d’entreprises / missions listées dans le JSON. */
export const workCompanyCount = workData.experiences.length;

/** Segments pour le pie « cloud / lakehouse / processing » (nombre de missions par outil). */
export const workPlatformSegments = toPieSegments(
  cache.platform,
  PLATFORM_KEYS,
  cache.platformCos,
);

/** Segments pour le pie BI (Tableau, Metabase). */
export const workBiSegments = toPieSegments(cache.bi, BI_KEYS, cache.biCos);

const SECTOR_TREEMAP_COLORS = [
  '#0b98f1',
  '#14B8A6',
  '#E8762D',
  '#6366F1',
  '#EC4899',
  '#84CC16',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#F43F5E',
  '#64748B',
  '#22C55E',
];

/**
 * Une ligne = un type d’activité (`company.type`), valeur = temps cumulé (mois approx).
 * `type` null ou vide → « Not specified ».
 */
function buildSectorTreemapItems () {
  const RECURRING_MONTH_EQUIVALENT = 12;
  const FALLBACK_MONTHS = 1;

  /** @type {Map<string, { months: number, companies: Set<string> }>} */
  const bySector = new Map();
  for (const exp of workData.experiences) {
    const raw = exp.company.type;
    const label =
      raw == null || String(raw).trim() === '' ? 'Not specified' : String(raw).trim();
    const d = exp.engagement.duration;
    const months =
      d.monthsApprox != null && d.monthsApprox > 0
        ? d.monthsApprox
        : d.isRecurring
          ? RECURRING_MONTH_EQUIVALENT
          : FALLBACK_MONTHS;
    if (!bySector.has(label)) {
      bySector.set(label, { months: 0, companies: new Set() });
    }
    const bucket = bySector.get(label);
    bucket.months += months;
    bucket.companies.add(exp.company.name);
  }
  return Array.from(bySector.entries())
    .map(([label, payload], i) => ({
      key: `sector-${i}-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '') || 'x'}`,
      label,
      value: payload.months,
      companies: Array.from(payload.companies).sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' }),
      ),
      color: SECTOR_TREEMAP_COLORS[i % SECTOR_TREEMAP_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
}

export const workSectorTreemapItems = buildSectorTreemapItems();

function buildManagementOverview () {
  let managedTotal = 0;
  let departuresTotal = 0;

  for (const exp of workData.experiences) {
    const mgmt = exp.management;
    if (!mgmt || typeof mgmt !== 'object') continue;
    const managed = mgmt.managedCount;
    const departures = mgmt.departuresCount;
    if (managed == null || typeof managed !== 'number' || Number.isNaN(managed) || managed <= 0) {
      continue;
    }
    managedTotal += managed;
    if (departures != null && typeof departures === 'number' && !Number.isNaN(departures)) {
      departuresTotal += Math.max(0, departures);
    }
  }

  const departureRatePct =
    managedTotal > 0 ? Math.round((departuresTotal / managedTotal) * 1000) / 10 : null;
  return { managedTotal, departuresTotal, departureRatePct };
}

/** Management snapshot agrégé (taille d'équipe + départs observés). */
export const workManagementOverview = buildManagementOverview();

/**
 * `timeSavedHoursPerWeek`. Si une valeur « par semaine » dépasse 168 h,
 * on considère qu’il s’agit d’une erreur de clé (total annuel) et on affiche h/year.
 * @param {Record<string, unknown> | null | undefined} m cvMetrics
 */
function formatTimeSavedDisplay (m) {
  if (!m || typeof m !== 'object') return null;
  const hours = m.timeSavedHoursPerWeek;
  if (hours == null || typeof hours !== 'number' || Number.isNaN(hours)) return null;
  return `${Math.round(hours)}h/week`;
}

function buildCvImpactTableRows () {
  return [...workData.experiences]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((exp) => {
      const r = exp.cvMetrics?.roiPercent;
      return r != null && typeof r === 'number';
    })
    .map((exp) => {
      const m = exp.cvMetrics || {};
      const roiPercent =
        m.roiPercent != null && typeof m.roiPercent === 'number' ? m.roiPercent : null;
      const roiPrimary = roiPercent != null ? `+${roiPercent}%` : null;
      const desc = m.description && m.description !== 'Unknown' ? String(m.description).trim() : '';
      const descFr =
        m.descriptionFr && String(m.descriptionFr).trim() !== ''
          ? String(m.descriptionFr).trim()
          : '';
      const timeSaved = formatTimeSavedDisplay(m);

      return {
        id: exp.id,
        companyName: exp.company.name,
        companySubtitle: exp.company.type ? String(exp.company.type).trim() : '',
        roiPercent,
        roiPrimary,
        timeSavedHoursPerWeek:
          m.timeSavedHoursPerWeek != null &&
          typeof m.timeSavedHoursPerWeek === 'number' &&
          !Number.isNaN(m.timeSavedHoursPerWeek)
            ? m.timeSavedHoursPerWeek
            : null,
        description: desc || null,
        descriptionFr: descFr || null,
        timeSaved,
      };
    });
}

/** Lignes pour le tableau « measured impact » (cvMetrics du JSON). */
export const workCvImpactTableRows = buildCvImpactTableRows();
