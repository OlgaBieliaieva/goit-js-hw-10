const BASE_URL = 'https://restcountries.com/v2';
const requestOptions = 'name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/name/${name}?fields=${requestOptions}`).then(
    response => response.json()
  );
}
export { fetchCountries };
