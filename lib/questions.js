import { getHolidays } from './holidays';
import { getCountryAlpha2, getCountry } from './countries';
import moment from 'moment';
import phraseMatches from './strings';

const sortHolidays = (a, b) => {
  if (moment(a.date).isBefore(b.date, 'day')) {
    return -1;
  }
  if (moment(a.date).isAfter(b.date, 'day')) {
    return 1;
  }
  return 0;
};

const filterBySearch = (holidays, search) => {
  return holidays.filter((holiday) => phraseMatches(search, holiday.name));
};

const getCountries = (entities) => {
  const countries = [];

  for (const countryEntry of entities['country:country']) {
    const country = getCountryAlpha2(countryEntry.value);
    if (country) {
      countries.push(country);
    }
  }

  return countries;
};

const getDateRanges = (entities) => {
  const dateRanges = [];

  if (entities['wit$datetime:datetime']) {
    for (const dateEntity of entities['wit$datetime:datetime']) {
      // holidayBeta is a feature in Wit.ai that recognizes names of common holidays and parses that as a date.
      // we don't care about those since we have our own way of searching by holiday name.
      if (dateEntity.holidayBeta) {
        continue;
      }
      let startDate, endDate;
      if (dateEntity.type == 'interval') {
        if (dateEntity.from) {
          startDate = moment(dateEntity.from.value);
        } else {
          startDate = moment();
        }
        if (dateEntity.to) {
          endDate = moment(dateEntity.to.value);
        }
      } else if (dateEntity.type == 'value') {
        startDate = moment(dateEntity.value);
        if (dateEntity.grain == 'year') {
          endDate = moment(dateEntity.value).endOf('year');
        } else if (dateEntity.grain == 'month') {
          endDate = moment(dateEntity.value).endOf('month');
        } else if (dateEntity.grain == 'week') {
          endDate = moment(dateEntity.value).endOf('week');
        } else if (dateEntity.grain == 'day') {
          endDate = startDate;
        }
      }
      dateRanges.push({ startDate, endDate });
    }
  }

  if (dateRanges.length == 0) {
    dateRanges.push({ startDate: moment() });
  }

  return dateRanges;
};

const getSearchTerm = (entities) => {
  let searchTerm;

  if (entities['wit$search_query:search_query']) {
    searchTerm = entities['wit$search_query:search_query'][0].value.replace(
      /holiday/i,
      ''
    );
  } else if (entities['wit$datetime:datetime']) {
    for (const dateEntry of entities['wit$datetime:datetime']) {
      if (dateEntry.holidayBeta) {
        searchTerm = dateEntry.body;
        break;
      }
    }
  }

  return searchTerm;
};

const getIntent = (intents, entities) => {
  let intent,
    data = { count: null };

  switch (intents[0].name) {
    case 'list_holiday':
      intent = 'list';
      data.count = 1;
      break;
    case 'list_holidays':
      intent = 'list';
      data.count = getQuantity(entities);
      break;
    case 'search_holiday':
      intent = 'search';
      data.searchTerm = getSearchTerm(entities);
      break;
  }

  return { intent, data };
};

const getQuantity = (entities) => {
  if (entities['wit$number:number']) {
    return entities['wit$number:number'][0].value;
  }

  return null;
};

/**
 * This function parses the output from the Wit.ai structured result
 * QUESTIONS ALREADY IMPLEMENTED?
 * - What's the next holiday in Argentina?
 * - What are the holidays in USA in the next two weeks?
 * PENDING QUESTIONS:
 * - How many holidays are in Spain between September and November?
 * - Are there any holidays in Ukraine in two weeks?
 * - List the holidays in USA and Ukraine between August 1st and October 31st
 * @param {Array} intents
 * @param {Object} entities
 */
export default async function questionResolver(intents, entities) {
  if (intents.length == 0) {
    return { status: 'unknown_question' };
  }

  const { intent, data } = getIntent(intents, entities);

  if (!intent) {
    return { status: 'unknown_question' };
  }

  if (!entities['country:country']) {
    return { status: 'missing_country' };
  }

  const countries = getCountries(entities);

  // if we couldn't recognize a country we return this error
  if (countries.length == 0) {
    return { status: 'unknown_country' };
  }

  const dateRanges = getDateRanges(entities);

  let holidays = [];
  const countryNames = [];

  for (const countryEntry of countries) {
    countryNames.push(getCountry(countryEntry).name);
    for (const dateEntry of dateRanges) {
      holidays.push(
        ...(await getHolidays(
          countryEntry,
          dateEntry.startDate,
          dateEntry.endDate,
          data.count
        ))
      );
    }
  }

  // sort only if we have more than one country in the results
  if (countries.length > 1) {
    holidays.sort(sortHolidays);
  }

  if (intent == 'search') {
    if (!data.searchTerm) {
      return { status: 'search_term_not_recognized' };
    }
    holidays = filterBySearch(holidays, data.searchTerm);
  }

  let answer_title;

  if (holidays.length == 0) {
    answer_title = 'There are no holidays';
  } else if (holidays.length == 1) {
    answer_title = `The holiday in ${holidays[0].country.name} is`;
  } else {
    answer_title = `The holidays in ${countryNames.join(', ')} are`;
  }

  return { status: 'success', answer_title, holidays };
}
