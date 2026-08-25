import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const VIEW = 200;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R = 90;
const TIP_OFFSET = 14;

/**
 * Coordonnées viewport pour position:fixed — les events sur les paths SVG peuvent
 * mal renseigner clientX/Y ; pageX/pageY servent de repli.
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
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {number} startRad
 * @param {number} endRad
 */
function pieSlicePath (cx, cy, r, startRad, endRad) {
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const delta = endRad - startRad;
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  return [
    'M', cx, cy,
    'L', x1, y1,
    'A', r, r, 0, largeArc, 1, x2, y2,
    'Z',
  ].join(' ');
}

/**
 * @param {{ title: string, segments: { key: string, label: string, percent: number, color: string, companies?: string[] }[], footnote?: string }} props
 */
export default function HomePieChart ({ title, segments, footnote }) {
  const [tip, setTip] = useState(
    /** @type {{ segment: typeof segments[0], x: number, y: number } | null} */ (null),
  );

  const pctSum = useMemo(
    () => segments.reduce((a, s) => a + s.percent, 0),
    [segments],
  );

  const slices = useMemo(() => {
    if (pctSum <= 0) return [];
    let angle = -Math.PI / 2;
    return segments.map((seg) => {
      const sweep = (seg.percent / pctSum) * 2 * Math.PI;
      const startRad = angle;
      const endRad = angle + sweep;
      angle = endRad;
      return {
        seg,
        d: pieSlicePath(CX, CY, R, startRad, endRad),
      };
    });
  }, [segments, pctSum]);

  const activeKey = tip?.segment?.key ?? null;

  const syncPointerFromWindow = useCallback((e) => {
    setTip((t) =>
      t ? { ...t, x: e.clientX, y: e.clientY } : null,
    );
  }, []);

  useEffect(() => {
    if (!activeKey) return undefined;
    window.addEventListener('mousemove', syncPointerFromWindow, { passive: true });
    return () => window.removeEventListener('mousemove', syncPointerFromWindow);
  }, [activeKey, syncPointerFromWindow]);

  const showTip = (segment, e) => {
    const { x, y } = getViewportXY(e);
    setTip({ segment, x, y });
  };

  const moveTip = (e) => {
    const { x, y } = getViewportXY(e);
    setTip((t) => (t ? { ...t, x, y } : null));
  };

  const hideTip = () => setTip(null);

  const tooltipEl =
    tip &&
    tip.segment.companies &&
    tip.segment.companies.length > 0 &&
    createPortal(
      <div
        className="home-pie-tooltip"
        style={{
          position: 'fixed',
          left: tip.x + TIP_OFFSET,
          top: tip.y + TIP_OFFSET,
          zIndex: 10000,
        }}
        role="tooltip"
      >
        <div className="home-pie-tooltip__title">{tip.segment.label}</div>
        <ul className="home-pie-tooltip__list">
          {tip.segment.companies.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>,
      document.body,
    );

  return (
    <div className="home-pie-block">
      <h3 className="home-pie-block__title">{title}</h3>
      <div className="home-pie-block__body">
        <div className="home-pie-svg-wrap">
          <svg
            className="home-pie-svg"
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            role="img"
            aria-label={title}
          >
            <title>{title}</title>
            {slices.map(({ seg, d }) => (
              <path
                key={seg.key}
                d={d}
                fill={seg.color}
                className="home-pie-slice"
                stroke="#fff"
                strokeWidth="1"
                strokeLinejoin="round"
                onMouseEnter={(e) => showTip(seg, e)}
                onMouseMove={moveTip}
                onMouseLeave={hideTip}
              />
            ))}
          </svg>
        </div>
        <ul className="home-pie-legend">
          {segments.map((item) => (
            <li
              key={item.key}
              className="home-pie-legend__item home-pie-legend__item--interactive"
              onMouseEnter={(e) => showTip(item, e)}
              onMouseMove={moveTip}
              onMouseLeave={hideTip}
            >
              <span className="home-pie-legend__swatch" style={{ background: item.color }} />
              <span>
                {item.label}
                <span className="home-pie-legend__pct"> {item.percent}%</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {footnote ? <p className="home-pie-block__note">{footnote}</p> : null}
      {tooltipEl}
    </div>
  );
}
