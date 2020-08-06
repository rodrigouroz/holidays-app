import { getHolidays } from './holidays';
import { getCountryAlpha2, getCountry } from './countries';
import moment from 'moment';

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

  const country = getCountryAlpha2(entities['country:country'][0].value);

  if (!country) {
    return { status: 'unknown_country' };
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
      if (dateEntity.grain == 'month') {
        endDate = moment(dateEntity.value).endOf('month');
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

  const holidays = await getHolidays(country, startDate, endDate, count);
  const { name: countryName } = getCountry(country);

  if (holidays.length == 0) {
    answer_title = 'There are no holidays';
  } else if (holidays.length == 1) {
    answer_title = `The holiday in ${countryName} is`;
  } else {
    answer_title = `The holidays in ${countryName} are`;
  }

  return { status: 'success', answer_title, holidays };
}
