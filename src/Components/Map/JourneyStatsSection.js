import { journeyStats } from './journeyModel';
import MapStatsChart from './MapStatsChart';
import React from 'react';

export default function JourneyStatsSection () {
  return (
    <div className="map-page-inner map-journey-stats-wrap">
      <MapStatsChart
        visited={journeyStats.allCountries.length}
        vacations={journeyStats.visit.length}
        studies={journeyStats.studies.length}
        work={journeyStats.work.length}
        halfMarathon={journeyStats.halfMarathon.length}
      />
    </div>
  );
}
