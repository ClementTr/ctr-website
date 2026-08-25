import HomeDataCharts from './HomeDataCharts';
import HomeHero from './HomeHero';
import HomeStatsStrip from './HomeStatsStrip';
import React from 'react';
import { BIRTH_DATE, getAgeYears } from './homeData';
import { PersonalData, journeyStats } from '../Map/journeyModel';
import { workCompanyCount } from './workExperienceAggregates';
import './home.css';

function HomeComponent (){
  const halfMarathons = PersonalData.travels.reduce(
    (sum, t) => sum + t.journey.filter((j) => j['half-marathon'] === true).length,
    0,
  );
  const age = getAgeYears(BIRTH_DATE);
  const countriesVisited = journeyStats.allCountries.length;

 return (
    <main className="home-page">
      <HomeHero />
      <HomeStatsStrip
        age={age}
        halfMarathons={halfMarathons}
        companies={workCompanyCount}
        countriesVisited={countriesVisited}
      />
      <HomeDataCharts />
    </main>
 )
}

export default HomeComponent;
