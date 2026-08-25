import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import HomeCvMetricsTable from './HomeCvMetricsTable';
import HomePieChart from './HomePieChart';
import HomeSectorTreemap from './HomeSectorTreemap';
import {
  workBiSegments,
  workCvImpactTableRows,
  workManagementOverview,
  workPlatformSegments,
  workSectorTreemapItems,
} from './workExperienceAggregates';

export default function HomeDataCharts () {
  const { t } = useLanguage();

  const businessLogos = [
    { src: '/img/logo/qare.png', alt: 'Qare' },
    { src: '/img/logo/tudigo.png', alt: 'Tudigo' },
    { src: '/img/logo/content-square.png', alt: 'Contentsquare' },
    { src: '/img/logo/mooncard.png', alt: 'Mooncard' },
    { src: '/img/logo/octo.png', alt: 'Octo' },
    { src: '/img/logo/synchrone.png', alt: 'Synchrone' },
    { src: '/img/logo/jolimoi.png', alt: 'Jolimoi' },
    { src: '/img/logo/lunii.png', alt: 'Lunii' },
    { src: '/img/logo/united-heroes.png', alt: 'United Heroes' },
    { src: '/img/logo/rivaj.png', alt: 'Rivaj' },
    { src: '/img/logo/horse-republic.webp', alt: 'Horse Republic' },
    { src: '/img/logo/nelson.png', alt: 'Nelson' },
    { src: '/img/logo/stats.png', alt: 'Stats' },
  ];

  const roiAvg = workCvImpactTableRows.length
    ? workCvImpactTableRows.reduce((sum, row) => sum + row.roiPercent, 0) /
      workCvImpactTableRows.length
    : null;
  const timeRows = workCvImpactTableRows.filter((row) => row.timeSavedHoursPerWeek != null);
  const timeSavedAvg = timeRows.length
    ? timeRows.reduce((sum, row) => sum + row.timeSavedHoursPerWeek, 0) / timeRows.length
    : null;

  return (
    <section className="home-viz home-viz--data" aria-label={t('dataCharts.sectionAria')}>
      <div className="home-section">
        <h2 className="home-block-title">{t('dataCharts.title')}</h2>
        <p className="home-block-desc">
          {t('dataCharts.desc1')}
          <strong>{t('dataCharts.descStrong1')}</strong>
          {t('dataCharts.desc2')}
          <strong>{t('dataCharts.descStrong2a')}</strong>
          {t('dataCharts.desc3')}
          <strong>{t('dataCharts.descStrong2b')}</strong>
          {t('dataCharts.desc4')}
          <strong>{t('dataCharts.descStrong3')}</strong>
          {t('dataCharts.desc5')}
        </p>
        <div className="home-pie-charts">
          {workPlatformSegments.length > 0 ? (
            <HomePieChart
              title={t('dataCharts.piePlatform')}
              segments={workPlatformSegments}
            />
          ) : (
            <p className="home-pie-block home-pie-block--empty">{t('dataCharts.emptyPlatform')}</p>
          )}
          {workBiSegments.length > 0 ? (
            <HomePieChart title={t('dataCharts.pieBi')} segments={workBiSegments} />
          ) : (
            <p className="home-pie-block home-pie-block--empty">{t('dataCharts.emptyBi')}</p>
          )}
        </div>
        {workCvImpactTableRows.length > 0 ? (
          <div className="home-treemap-slot home-business-experience">
            <h3 className="home-pie-block__title home-business-experience__title">
              {t('dataCharts.businessImpact')}
            </h3>
            <div
              className={
                'home-business-experience__grid home-business-experience__grid--summary-table'
              }
            >
              <div className="home-business-experience__summary">
                <div className="home-macro-card">
                  <div className="home-macro-card__label">{t('dataCharts.macroTime')}</div>
                  <div className="home-macro-card__value home-macro-card__value--time">
                    {timeSavedAvg != null ? `${Math.round(timeSavedAvg)}h/week` : '—'}
                  </div>
                </div>
                <div className="home-macro-card">
                  <div className="home-macro-card__label">{t('dataCharts.macroRoi')}</div>
                  <div className="home-macro-card__value home-macro-card__value--roi">
                    {roiAvg != null ? `+${Math.round(roiAvg)}%` : '—'}
                  </div>
                </div>
                <div className="home-macro-card home-macro-card--management">
                  <div className="home-macro-card__label">{t('dataCharts.managedPeople')}</div>
                  <div className="home-macro-card__value home-macro-card__value--management">
                    {workManagementOverview.managedTotal || '—'}
                  </div>
                  <div className="home-macro-card__meta">
                    {workManagementOverview.departureRatePct != null
                      ? t('dataCharts.departures', {
                          pct: workManagementOverview.departureRatePct,
                        })
                      : t('dataCharts.noDeparturesData')}
                  </div>
                  {workManagementOverview.departureRatePct != null ? (
                    <div className="home-macro-card__bar" aria-hidden="true">
                      <span
                        className="home-macro-card__bar-loss"
                        style={{ width: `${workManagementOverview.departureRatePct}%` }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <HomeCvMetricsTable rows={workCvImpactTableRows} />
            </div>
          </div>
        ) : null}
        {workSectorTreemapItems.length > 0 ? (
          <div className="home-treemap-slot home-business-experience home-business-experience--treemap">
            <h3 className="home-pie-block__title home-business-experience__title">
              {t('dataCharts.businessExperiences')}
            </h3>
            <div className="home-business-experience__treemap-stack">
              <div className="home-business-experience__logos" aria-label={t('dataCharts.logosAria')}>
                <div className="home-business-experience__logos-mask">
                  <div className="home-business-experience__logos-track">
                    {businessLogos.concat(businessLogos).map((logo, idx) => (
                      <div className="home-business-experience__logo-card" key={`${logo.src}-${idx}`}>
                        <img src={logo.src} alt={logo.alt} className="home-business-experience__logo" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="home-business-experience__treemap-row">
                <div className="home-business-experience__treemap-col">
                  <HomeSectorTreemap items={workSectorTreemapItems} hideTitle />
                </div>
                <aside className="home-business-experience__narrative">
                  <p className="home-business-experience__narrative-intro">
                    {t('dataCharts.narIntro')}
                  </p>
                  <ul>
                    <li>
                      🎨 {t('dataCharts.narCs')}
                      <strong>{t('dataCharts.narCsStrong1')}</strong>
                      {t('dataCharts.narCsMid')}
                      <strong>{t('dataCharts.narCsStrong2')}</strong>
                      {t('dataCharts.narCsEnd')}
                    </li>
                    <li>
                      📈 {t('dataCharts.narQare')}
                      <strong>{t('dataCharts.narQareStrong1')}</strong>
                      {t('dataCharts.narQareMid')}
                      <strong>{t('dataCharts.narQareStrong2')}</strong>
                      {t('dataCharts.narQareEnd')}
                    </li>
                    <li>
                      📣 {t('dataCharts.narTudigo1')}
                      <strong>{t('dataCharts.narTudigoStrong1')}</strong>
                      {t('dataCharts.narTudigo2')}
                      <strong>{t('dataCharts.narTudigoStrong2')}</strong>
                      {t('dataCharts.narTudigo3')}
                    </li>
                  </ul>
                  <p className="home-business-experience__narrative-outro">{t('dataCharts.narOutro')}</p>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
