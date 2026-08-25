import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const TIP_OFFSET = 12;

/** Affichage en années à partir du total mois (données agrégées). */
function formatYearsFromMonths (months) {
  const y = months / 12;
  const decimals = y >= 1 ? 1 : 2;
  const factor = 10 ** decimals;
  return Math.round(y * factor) / factor;
}

/**
 * Coordonnées viewport pour position:fixed — les events sur les rect SVG peuvent
 * renvoyer clientX/Y à 0 ; pageX/pageY servent de repli.
 * @param {React.MouseEvent | MouseEvent} e
 */
function getViewportXY (e) {
  let x = e.clientX;
  let y = e.clientY;
  if (typeof window !== 'undefined') {
    const sx = window.scrollX || window.pageXOffset || 0;
    const sy = window.scrollY || window.pageYOffset || 0;
    if (e.pageX != null && e.pageY != null) {
      const px = e.pageX - sx;
      const py = e.pageY - sy;
      if (x === 0 && y === 0 && (e.pageX !== 0 || e.pageY !== 0)) {
        x = px;
        y = py;
      }
    }
  }
  return { x, y };
}

/**
 * Layout treemap récursif (slice-and-dice), coordonnées 0–100 pour viewBox carré.
 * @param {{ key: string, label: string, value: number, color: string }[]} items triés par value décroissante
 */
function layoutTreemap (items, x, y, w, h, splitHorizontal) {
  if (items.length === 0) return [];
  if (items.length === 1) {
    const [it] = items;
    return [{ ...it, x, y, w, h }];
  }
  const total = items.reduce((s, i) => s + i.value, 0);
  const half = total / 2;
  let acc = 0;
  let splitAt = 1;
  for (let i = 0; i < items.length - 1; i++) {
    acc += items[i].value;
    splitAt = i + 1;
    if (acc >= half) break;
  }
  const left = items.slice(0, splitAt);
  const right = items.slice(splitAt);
  const leftSum = left.reduce((s, i) => s + i.value, 0);
  const ratio = leftSum / total;

  if (splitHorizontal) {
    const wLeft = w * ratio;
    return [
      ...layoutTreemap(left, x, y, wLeft, h, !splitHorizontal),
      ...layoutTreemap(right, x + wLeft, y, w - wLeft, h, !splitHorizontal),
    ];
  }
  const hTop = h * ratio;
  return [
    ...layoutTreemap(left, x, y, w, hTop, !splitHorizontal),
    ...layoutTreemap(right, x, y + hTop, w, h - hTop, !splitHorizontal),
  ];
}

/**
 * @param {{ items: { key: string, label: string, value: number, color: string, companies?: string[] }[] }} props
 */
export default function HomeSectorTreemap ({ items, hideTitle = false }) {
  const { t } = useLanguage();
  const [tip, setTip] = useState(
    /** @type {{ item: object, x: number, y: number } | null} */ (null),
  );

  const rects = useMemo(() => {
    if (!items.length) return [];
    const sorted = [...items].sort((a, b) => b.value - a.value);
    return layoutTreemap(sorted, 0, 0, 100, 100, true);
  }, [items]);

  const activeKey = tip?.item?.key ?? null;

  const syncPointerFromWindow = useCallback((e) => {
    setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null));
  }, []);

  useEffect(() => {
    if (!activeKey) return undefined;
    window.addEventListener('mousemove', syncPointerFromWindow, { passive: true });
    return () => window.removeEventListener('mousemove', syncPointerFromWindow);
  }, [activeKey, syncPointerFromWindow]);

  if (!rects.length) return null;

  const showTip = (item, e) => {
    const { x, y } = getViewportXY(e);
    setTip({ item, x, y });
  };

  const moveTip = (e) => {
    const { x, y } = getViewportXY(e);
    setTip((t) => (t ? { ...t, x, y } : null));
  };

  const hideTip = () => setTip(null);

  const tooltipEl = tip && tip.item.companies && tip.item.companies.length > 0
    ? createPortal(
      <div
        className="home-sector-treemap__tooltip"
        style={{ left: tip.x + TIP_OFFSET, top: tip.y + TIP_OFFSET }}
        role="tooltip"
      >
        <div className="home-sector-treemap__tooltip-title">{tip.item.label}</div>
        <div className="home-sector-treemap__tooltip-meta">
          {formatYearsFromMonths(tip.item.value)} {t('treemap.yrTotalPhrase')}
        </div>
        <ul className="home-sector-treemap__tooltip-list">
          {tip.item.companies.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>,
      document.body,
    )
    : null;

  return (
    <div
      className={`home-pie-block home-sector-treemap${hideTitle ? ' home-sector-treemap--embedded' : ''}`}
    >
      {!hideTitle ? (
        <h3 className="home-pie-block__title">{t('treemap.title')}</h3>
      ) : null}
      <div className="home-sector-treemap__frame">
        <svg
          className="home-sector-treemap__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={t('treemap.aria')}
        >
          {rects.map((r) => {
            const cx = r.x + r.w / 2;
            const cy = r.y + r.h / 2;
            const area = r.w * r.h;
            const showText = area > 120;
            const maxChars = r.w > 35 ? 48 : r.w > 22 ? 28 : 14;
            const shortLabel =
              r.label.length > maxChars ? `${r.label.slice(0, Math.max(0, maxChars - 1))}…` : r.label;
            const fontLabel = Math.min(3.1, r.w / 16);
            const fontNum = Math.min(5, r.h / 5);
            const yearsDisplay = formatYearsFromMonths(r.value);
            return (
              <g key={r.key}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill={r.color}
                  stroke="#fff"
                  strokeWidth={0.35}
                  className="home-sector-treemap__cell"
                  onMouseEnter={(e) => showTip(r, e)}
                  onMouseMove={moveTip}
                  onMouseLeave={hideTip}
                >
                  <title>
                    {`${r.label} — ${yearsDisplay} ${t('treemap.yrSuffix')}`}
                  </title>
                </rect>
                {showText ? (
                  <text
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                    className="home-sector-treemap__text"
                  >
                    <tspan x={cx} y={cy - fontNum * 0.35} fontSize={fontNum} fontWeight="700">
                      {yearsDisplay} {t('treemap.yrSuffix')}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + fontLabel * 1.05}
                      fontSize={fontLabel}
                      fontWeight="500"
                      opacity={0.95}
                    >
                      {shortLabel}
                    </tspan>
                  </text>
                ) : (
                  <text
                    x={cx}
                    y={cy}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(4.2, r.w / 3.5)}
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {yearsDisplay} {t('treemap.yrSuffix')}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {tooltipEl}
    </div>
  );
}
