import { getHolidays } from './holidays';
import { getCountryAlpha2 } from './countries';
import moment from 'moment';

/**
 * This function parses the output from the Wit.ai structured result
 * QUESTIONS ALREADY IMPLEMENTED?
 * - What's the next holiday in Argentina?
 * PENDING QUESTIONS:
 * - What are the holidays in USA in the next two weeks?
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

  // TODO: extract to a function
  if (entities['wit$datetime:datetime']) {
    const dateEntity = entities['wit$datetime:datetime'][0];
    if (dateEntity.type == 'interval') {
      startDate = moment(dateEntity.from.value);
      endDate = moment(dateEntity.to.value);
    } else if (dateEntity.type == 'value') {
      if (dateEntity.grain == 'month') {
        startDate = moment(dateEntity.value);
        endDate = startDate.add(1, 'month');
      }
    }
  } else {
    startDate = moment();
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

  if (holidays.length == 0) {
    answer_title = 'There are no holidays';
  } else if (holidays.length == 1) {
    answer_title = 'The holiday is';
  } else {
    answer_title = 'The holidays are';
  }

  return { status: 'success', answer_title, holidays };
}
