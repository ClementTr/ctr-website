import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * @param {{ age: number, halfMarathons: number, companies: number, countriesVisited: number }} props
 */
export default function HomeStatsStrip ({ age, halfMarathons, companies, countriesVisited }) {
  const { t } = useLanguage();

  return (
    <section className="home-stats" aria-label={t('stats.aria')}>
      <div className="home-section">
        <h2 className="home-block-title home-stats__heading">{t('stats.title')}</h2>
        <p className="home-block-desc home-stats__intro">{t('stats.intro')}</p>
        <div className="home-stats__grid">
          <div className="home-stat-card">
            <span className="home-stat-card__value">{age}</span>
            <span className="home-stat-card__label">{t('stats.age')}</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-card__value">{halfMarathons}</span>
            <span className="home-stat-card__label">{t('stats.halfMarathons')}</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-card__value">1:34:34</span>
            <span className="home-stat-card__label">{t('stats.pbHalf')}</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-card__value">{companies}</span>
            <span className="home-stat-card__label">{t('stats.companies')}</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-card__value">{countriesVisited}</span>
            <span className="home-stat-card__label">{t('stats.countries')}</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-card__value">0</span>
            <span className="home-stat-card__label">{t('stats.trophies')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
