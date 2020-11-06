const COUNTRIES_URL =
  "https://restcountries.eu/rest/v2/all?fields=callingCodes;name";

export default async function getCountries() {
  const res = await fetch(COUNTRIES_URL);
  return await res.json();
}
