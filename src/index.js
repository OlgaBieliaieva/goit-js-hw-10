import './css/styles.css';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch-countries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  searchList: document.querySelector('.country-list'),
  searchResult: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener('input', Debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  refs.searchList.innerHTML = '';
  refs.searchResult.innerHTML = '';

  let searchValue = event.target.value.trim().toLowerCase();

  if (searchValue.length === 0) {
    return;
  }
  fetchCountries(searchValue).then(showResult).catch(showError);
}

function showResult(result) {
  if (result.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (result.length >= 2 && result.length <= 10) {
    showCountriesList(result);
  } else {
    showCountryInfo(result);
  }
}

function showError(error) {
  console.log(error);
}

function showCountriesList(countries) {
  const createListMarkup = countries
    .map(
      country =>
        `<li class="country-list__item">
      <img src="${country.flags.svg}" alt="${country.name}" width="40"/>
      <span>${country.name}</span>
    </li>`
    )
    .join('');

  refs.searchList.insertAdjacentHTML('beforeend', createListMarkup);
}

function showCountryInfo(countries) {
  const createCountryInfoMarkup = countries
    .map(
      country =>
        `<div>
        <img src=${country.flags.svg} alt="${country.name}" width="60"/>
        <span>${country.name}</span>
        <p><span>Capital:</span>${country.capital}</p>
        <p><span>Population:</span>${country.population}</p>
        <p><span>Languages:</span>${country.languages
          .map(language => language.name)
          .join(', ')}</p>
      </div>`
    )
    .join('');
  refs.searchResult.insertAdjacentHTML('beforeend', createCountryInfoMarkup);
  console.log(createCountryInfoMarkup);
}
