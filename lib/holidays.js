import moment from 'moment';
import fetchAPI from '../utils/apiClient';
import { getCountry } from './countries';

export async function getHolidays(countryCode, startDate, endDate, count) {
  const url = `https://date.nager.at/api/v2/nextpublicholidays/${countryCode}`;

  const response = await fetchAPI(url);

  const results = [];

  if (Array.isArray(response)) {
    const holidays = response.filter((entry) => entry.global == true);

    for (let i = 0; i < holidays.length; i++) {
      if (moment(holidays[i].date).isAfter(startDate)) {
        if (endDate && moment(holidays[i].date).isAfter(endDate)) {
          break;
        }
        results.push(holidays[i]);
        if (count && --count == 0) {
          break;
        }
      }
    }
  }

  return results;
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
