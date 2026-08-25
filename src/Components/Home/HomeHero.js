import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function HomeHero () {
  const { t } = useLanguage();

  return (
    <header className="home-hero">
      <div className="home-hero__inner">
        <div>
          <span className="home-hero__eyebrow">{t('hero.eyebrow')}</span>
          <h1 className="home-hero__title">Clément Tailleur</h1>
          <p className="home-hero__lead">
            {t('hero.lead1a')}
            <strong>{t('hero.lead1strong')}</strong>
            {t('hero.lead1b')}
            <span className="home-hero__underline">{t('hero.lead1underline')}</span>
            {t('hero.lead1end')}
          </p>
          <p className="home-hero__lead home-hero__lead--personal">{t('hero.lead2')}</p>
          <div className="home-hero__actions">
            <Link className="home-btn home-btn--primary" to="/ctr-map">
              {t('hero.travelMap')}
            </Link>
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-tailleur/"
              target="_blank"
              rel="noreferrer"
              aria-label={t('hero.linkedinAria')}
            >
              <span className="fa fa-linkedin" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="home-hero__photo-wrap">
          <span className="home-hero__photo-accent" aria-hidden="true" />
          <img
            className="home-hero__photo"
            src="/img/main/01.jpg"
            alt={t('hero.photoAlt')}
          />
        </div>
      </div>
    </header>
  );
}
