import { mapColors } from './mapColors';
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

function MapStatsChart ({ visited, vacations, studies, work, halfMarathon = 0 }) {
  const { t } = useLanguage();

  const breakdown = [
    { key: 'vac', label: t('map.vacationCountries'), value: vacations, color: mapColors.visit },
    { key: 'stu', label: t('map.studiesCountries'), value: studies, color: mapColors.studies },
    { key: 'wrk', label: t('map.workCountries'), value: work, color: mapColors.work },
    { key: 'hm', label: t('map.halfMarathonCountries'), value: halfMarathon, color: mapColors.halfMarathon },
  ];

  return (
    <div className="map-stats-chart" aria-label={t('map.statsAria')}>
      <div
        className="map-stats-block map-stats-block--wide"
        style={{ borderTopColor: mapColors.total }}
      >
        <span className="map-stats-block-value">{visited}</span>
        <span className="map-stats-block-label">{t('map.visited')}</span>
      </div>
      <div className="map-stats-grid map-stats-grid--four">
        {breakdown.map((item) => (
          <div
            key={item.key}
            className="map-stats-block"
            style={{ borderTopColor: item.color }}
          >
            <span className="map-stats-block-value">{item.value}</span>
            <span className="map-stats-block-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapStatsChart;
