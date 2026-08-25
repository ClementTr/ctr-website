import PersonalData from './PersonalData.json';
import { mapColors } from './mapColors';

function distinct (value, index, self) {
  return self.indexOf(value) === index;
}

function purposeFilter (data, purpose) {
  const arr = [];
  data.travels.forEach((travel) => {
    travel.journey.forEach((journey) => {
      if (journey.purpose === purpose) {
        arr.push({
          country: travel.country,
          year: journey.year,
          photos: journey.photos,
        });
      }
    });
  });
  return arr;
}

export function getPurposeCountries (data, purpose) {
  const list = purpose ? purposeFilter(data, purpose) : data.travels;
  return list.map((o) => o.country).filter(distinct);
}

/** Pays où au moins un segment de voyage a `half-marathon: true`. */
export function getHalfMarathonCountries (data) {
  const out = [];
  data.travels.forEach((travel) => {
    const hasHalf = travel.journey.some((j) => j['half-marathon'] === true);
    if (hasHalf) out.push(travel.country);
  });
  return out.filter(distinct);
}

export const journeyStats = {
  allCountries: getPurposeCountries(PersonalData),
  visit: getPurposeCountries(PersonalData, 'visit'),
  studies: getPurposeCountries(PersonalData, 'studies'),
  work: getPurposeCountries(PersonalData, 'work'),
  halfMarathon: getHalfMarathonCountries(PersonalData),
};

export function countryFillColor (countryName) {
  if (journeyStats.work.includes(countryName)) return mapColors.work;
  if (journeyStats.studies.includes(countryName)) return mapColors.studies;
  if (journeyStats.halfMarathon.includes(countryName)) return mapColors.halfMarathon;
  if (journeyStats.visit.includes(countryName)) return mapColors.visit;
  return mapColors.empty;
}

export { PersonalData };
