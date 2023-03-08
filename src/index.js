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

  const searchValue = event.target.value.trim().toLowerCase();

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
  if (error.message === '404') {
    return Notify.failure('Oops, there is no country with that name');
  }
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
  showMarkup(createListMarkup);
}

function showCountryInfo(countries) {
  const createCountryInfoMarkup = countries
    .map(
      country =>
        `<div>
        <img src=${country.flags.svg} alt="${country.name}" width="60"/>
        <span>${country.name}</span>
        </div>
        <p><span>Capital:</span>${country.capital}</p>
        <p><span>Population:</span>${country.population}</p>
        <p><span>Languages:</span>${country.languages
          .map(language => language.name)
          .join(', ')}</p>`
    )
    .join('');
  showMarkup(createCountryInfoMarkup);
}

function showMarkup(markup) {
  if (markup.includes('Capital')) {
    refs.searchResult.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.searchList.insertAdjacentHTML('beforeend', markup);
  }
}
