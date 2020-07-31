import moment from 'moment';
import fetchAPI from '../utils/apiClient';
import { getCountry } from './countries';

export async function getHolidays(countryCode, startDate) {
  /*
  console.debug(
    `Fetching for ${countryCode}. Start Date ${startDate}. End Date ${endDate}. Count ${count}`
  );
  */

  const url = `https://date.nager.at/api/v2/nextpublicholidays/${countryCode}`;

  // console.debug(`Querying ${url}`);
  const response = await fetchAPI(url);

  const holidays = await response.filter((entry) => entry.global == true);

  for (let i = 0; i < holidays.length; i++) {
    if (moment(holidays[i].date).isAfter(startDate)) {
      return [holidays[i]];
    }
  }
}

/**
 * This function returns an array with holidays in the world for the first and second day
 * in the API
 */
export async function getHolidaysWorldwide() {
  const response = await fetchAPI(
    `https://date.nager.at/api/v2/nextpublicholidaysworldwide`
  );

  const holidaysWorldwide = await response.filter(
    (entry) => entry.global == true
  );

  let daysProcessed = 0;
  let lastDay = holidaysWorldwide.length > 0 ? holidaysWorldwide[0].date : null;
  let results = [];
  let holidays = [];

  for (let i = 0; i < holidaysWorldwide.length; i++) {
    if (!moment(holidaysWorldwide[i].date).isSame(lastDay, 'day')) {
      if (daysProcessed++ == 2) {
        break;
      }

      results.push({
        date: lastDay,
        holidays,
      });

      holidays = [];
      lastDay = holidaysWorldwide[i].date;
    }

    const { name, emoji } = getCountry(holidaysWorldwide[i].countryCode);
    holidays.push({
      name: holidaysWorldwide[i].name,
      country: { name, emoji },
    });
  }

  return results;
}
