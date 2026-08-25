import { NavLink } from 'react-router-dom';
import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function HeaderComponent (){
  const { locale, setLocale, t } = useLanguage();

  return (
    <div id="header-navbar" className="header header-simple">
      <div id="pc" className="header-inner">
        <nav className="site-nav" aria-label={t('nav.ariaNav')}>
          <NavLink exact to="/" className="site-nav-link" activeClassName="site-nav-link--active">
            {t('nav.home')}
          </NavLink>
          <span className="site-nav-sep" aria-hidden="true">/</span>
          <NavLink to="/ctr-map" className="site-nav-link" activeClassName="site-nav-link--active">
            {t('nav.map')}
          </NavLink>
        </nav>
        <div className="site-lang" role="group" aria-label={t('nav.langSwitch')}>
          <button
            type="button"
            className={`site-lang-btn${locale === 'en' ? ' site-lang-btn--active' : ''}`}
            onClick={() => setLocale('en')}
            aria-pressed={locale === 'en'}
          >
            {t('nav.en')}
          </button>
          <button
            type="button"
            className={`site-lang-btn${locale === 'fr' ? ' site-lang-btn--active' : ''}`}
            onClick={() => setLocale('fr')}
            aria-pressed={locale === 'fr'}
          >
            {t('nav.fr')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderComponent;
