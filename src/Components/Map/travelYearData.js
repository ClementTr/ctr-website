/**
 * Index des pays visités par année (toutes catégories),
 * à partir des entrées `journey.year` dans PersonalData.
 */
export function buildTravelYearIndex (data) {
  const yearToCountries = {};
  data.travels.forEach((travel) => {
    travel.journey.forEach((j) => {
      const y = j.year;
      if (!yearToCountries[y]) yearToCountries[y] = new Set();
      yearToCountries[y].add(travel.country);
    });
  });
  const years = Object.keys(yearToCountries)
    .map(Number)
    .sort((a, b) => a - b);
  return { yearToCountries, years };
}
