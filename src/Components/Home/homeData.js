/** Âge calculé à partir de la date de naissance (8 nov. 1994). */
export const BIRTH_DATE = new Date(1994, 10, 8);

export function getAgeYears (birth) {
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const md = now.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

