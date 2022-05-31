import moment from 'moment';
import fetchAPI from '../utils/apiClient';
import { getCountryAlpha2, getCountry } from './countries';
import phraseMatches from './strings';

const filterBySearch = (search) => (holiday) =>
  !search ? true : phraseMatches(search, holiday.name);

async function fetchHolidaysFromNager(countryCode, year, searchTerm) {
  const url = `https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`;

  const response = await fetchAPI(url);

  return response
    .filter((entry) => entry.global == true)
    .map((h) => ({ name: h.name, date: h.date }))
    .filter(filterBySearch(searchTerm));
}

async function fetchHolidays(countryCode, year, searchTerm) {
  const url = `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=${countryCode}&year=${year}&type=national`;

  try {
    const result = await fetchAPI(url);

    return result.response.holidays
      .map((h) => ({
        name: h.name,
        date: h.date.iso,
      }))
      .filter(filterBySearch(searchTerm));
  } catch (e) {
    return fetchHolidaysFromNager(countryCode, year, searchTerm);
  }
}

export async function getHolidays({
  countryCode,
  startDate,
  endDate,
  count,
  searchTerm,
}) {
  const results = [];

  const { name, emoji } = getCountry(countryCode);

  let holidays;
  let year = moment(startDate).year();

  // fetch from date.nager.at, only if the answer is 404 (no data for that country) use calendarific as backup
  // or fetch from calendarific, if response is free tier limit, fall back to date.nager.at?
  holidays = await fetchHolidays(countryCode, year, searchTerm);

  let extendedQuery = false;

  if (endDate) {
    let endYear = moment(endDate).year();
    if (endYear > year) {
      holidays.push(...(await fetchHolidays(countryCode, endYear, searchTerm)));
      extendedQuery = true;
    }
  }

  let keep = false;

  do {
    for (let holiday of holidays) {
      if (moment(holiday.date).isSameOrAfter(startDate, 'day')) {
        if (endDate && moment(holiday.date).isAfter(endDate, 'day')) {
          break;
        }

        results.push({
          date: holiday.date,
          name: holiday.name,
          country: { name, emoji },
        });

        if (count && --count == 0) {
          break;
        }
      }
    }

    // if I still need holidays and there was no end date in the request then I go to the next year to fullfil the count
    if (!extendedQuery && (count || results.length == 0)) {
      holidays = await fetchHolidays(countryCode, year + 1, searchTerm);
      extendedQuery = true;
      keep = true;
    } else {
      keep = false;
    }
  } while (keep);

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

export async function getHolidaysForCountry(country) {
  return getHolidays({
    countryCode: getCountryAlpha2(country),
    startDate: moment(),
    count: 5,
  });
}
