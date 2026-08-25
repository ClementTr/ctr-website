import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/** Tableau des cvMetrics (ROI, temps gagné) aligné sur le treemap Business experiences. */
export default function HomeCvMetricsTable ({ rows }) {
  const { t, locale } = useLanguage();

  if (!rows.length) return null;

  return (
    <div className="home-cv-metrics">
      <h4 className="home-cv-metrics__title">{t('cvTable.title')}</h4>
      <div className="home-cv-metrics__scroll" role="region" aria-label={t('cvTable.ariaRegion')}>
        <table className="home-cv-metrics__table">
          <thead>
            <tr>
              <th scope="col">{t('cvTable.colCompany')}</th>
              <th scope="col">{t('cvTable.colRoi')}</th>
              <th scope="col">{t('cvTable.colTime')}</th>
              <th scope="col">{t('cvTable.colDesc')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const descriptionText =
                locale === 'fr' && row.descriptionFr ? row.descriptionFr : row.description;
              return (
              <tr key={row.id}>
                <td>
                  <div className="home-cv-metrics__company">
                    <span className="home-cv-metrics__company-name">{row.companyName}</span>
                    {row.companySubtitle ? (
                      <span className="home-cv-metrics__company-sub">{row.companySubtitle}</span>
                    ) : null}
                  </div>
                </td>
                <td className="home-cv-metrics__cell--roi">
                  {row.roiPrimary ? (
                    <span className="home-cv-metrics__roi-main">{row.roiPrimary}</span>
                  ) : (
                    <span className="home-cv-metrics__empty">—</span>
                  )}
                </td>
                <td className="home-cv-metrics__cell--time">
                  {row.timeSaved ? (
                    <span className="home-cv-metrics__time">{row.timeSaved}</span>
                  ) : (
                    <span className="home-cv-metrics__empty">—</span>
                  )}
                </td>
                <td className="home-cv-metrics__cell--description">
                  {descriptionText ? (
                    <span className="home-cv-metrics__description">{descriptionText}</span>
                  ) : (
                    <span className="home-cv-metrics__empty">—</span>
                  )}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      <p className="home-cv-metrics__legend">{t('cvTable.legend')}</p>
    </div>
  );
}
