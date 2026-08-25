import MainMap from './MainMap';
import JourneyStatsSection from './JourneyStatsSection';
import YearMap from './YearMap';
import React from 'react';

/**
 * Page carte / parcours : carte macro, statistiques, carte chronologique.
 */
export default function JourneyPage () {
  return (
    <div className="journey-page">
      <MainMap />
      <JourneyStatsSection />
      <YearMap />
    </div>
  );
}
