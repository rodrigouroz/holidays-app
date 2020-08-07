import { getHolidays } from './holidays';
import { getCountryAlpha2, getCountry } from './countries';
import moment from 'moment';

const sortHolidays = (a, b) => {
  if (moment(a.date).isBefore(b.date, 'day')) {
    return -1;
  }
  if (moment(a.date).isAfter(b.date, 'day')) {
    return 1;
  }
  return 0;
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
  let startDate;
  let endDate;
  let count;
  let answer_title;

  if (!entities['country:country']) {
    return { status: 'missing_country' };
  }

  // TODO: extract to a function
  if (entities['wit$datetime:datetime']) {
    const dateEntity = entities['wit$datetime:datetime'][0];
    if (dateEntity.type == 'interval') {
      if (dateEntity.from) {
        startDate = moment(dateEntity.from.value);
      } else {
        startDate = moment();
      }
      endDate = moment(dateEntity.to.value);
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
  } else {
    startDate = moment();
  }

  if (intents.length == 0) {
    return { status: 'unknown_question' };
  }

  switch (intents[0].name) {
    case 'list_holiday':
      count = 1;
      break;
    case 'list_holidays':
      break;
    default:
      return { status: 'unknown_question' };
  }

  const holidays = [];
  const countryNames = [];

  for (const countryEntry of entities['country:country']) {
    const country = getCountryAlpha2(countryEntry.value);
    if (country) {
      countryNames.push(getCountry(country).name);
      holidays.push(...(await getHolidays(country, startDate, endDate, count)));
    }
  }

  // if we couldn't recognize a country we return this error
  if (countryNames.length == 0) {
    return { status: 'unknown_country' };
  }

  // sort only if we have more than one country in the results
  if (countryNames.length > 1) {
    holidays.sort(sortHolidays);
  }

  if (holidays.length == 0) {
    answer_title = 'There are no holidays';
  } else if (holidays.length == 1) {
    answer_title = `The holiday in ${holidays[0].country.name} is`;
  } else {
    answer_title = `The holidays in ${countryNames.join(', ')} are`;
  }

  return { status: 'success', answer_title, holidays };
}
