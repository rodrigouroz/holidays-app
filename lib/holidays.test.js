import fetchAPI from '../utils/apiClient';
import { getHolidays, getHolidaysWorldwide } from './holidays';
import moment from 'moment';

jest.mock('../utils/apiClient');

const mockedHolidays = {
  'AR-1': {
    date: {
      iso: '2020-08-17',
    },
    name: 'General José de San Martín Memorial Day',
  },
  'AR-2': {
    date: {
      iso: '2020-10-12',
    },
    name: 'Day of Respect for Cultural Diversity',
  },
  'AR-3': {
    date: {
      iso: '2020-11-20',
    },
    name: 'National Sovereignty Day',
  },
  'AR-4': {
    date: {
      iso: '2021-01-12',
    },
    name: 'Day of Respect for Cultural Diversity',
  },
  'AR-5': {
    date: {
      iso: '2021-02-20',
    },
    name: 'National Sovereignty Day',
  },
  'AR-nager-1': {
    date: '2020-08-17',
    name: 'General José de San Martín Memorial Day',
    global: true,
  },
  'AR-nager-2': {
    date: '2020-10-12',
    name: 'Day of Respect for Cultural Diversity',
    global: true,
  },
  'AR-nager-3': {
    date: '2020-11-20',
    name: 'National Sovereignty Day',
    global: true,
  },
  'US-1': {
    date: {
      iso: '2020-09-07',
    },
    name: 'Labour Day',
  },
  'BO-1': {
    date: '2020-08-02',
    name: 'Agrarian Reform Day',
    global: true,
    countryCode: 'BO',
  },
  'AU-1': {
    date: '2020-08-03',
    name: 'Picnic Day',
    global: false,
    countryCode: 'AU',
  },
  'GD-1': {
    date: '2020-08-03',
    name: 'Emancipation Day',
    global: true,
    countryCode: 'GD',
  },
  'SV-1': {
    date: '2020-08-04',
    name: 'August Festivals',
    global: true,
    countryCode: 'SV',
  },
};

describe('getHolidays', () => {
  test('gets the next two holidays for a given country', async () => {
    const mockedResponse = [
      mockedHolidays['AR-1'],
      mockedHolidays['AR-2'],
      mockedHolidays['AR-3'],
    ];
    fetchAPI.mockResolvedValue({
      response: {
        holidays: mockedResponse,
      },
    });

    const today = moment('2020-10-01');
    const holidays = await getHolidays({
      countryCode: 'AR',
      startDate: today,
      count: 2,
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2020&type=national`
    );
    expect(holidays).toHaveLength(2);
    expect(holidays[0]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2020-10-12',
    });
    expect(holidays[1]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'National Sovereignty Day',
      date: '2020-11-20',
    });
  });

  test('gets the next holidays for a given country in a date interval', async () => {
    const mockedResponse = [
      mockedHolidays['AR-1'],
      mockedHolidays['AR-2'],
      mockedHolidays['AR-3'],
    ];
    fetchAPI.mockResolvedValue({
      response: {
        holidays: mockedResponse,
      },
    });

    const startDate = moment('2020-10-01');
    const endDate = moment('2020-11-01');
    const holidays = await getHolidays({
      countryCode: 'AR',
      startDate,
      endDate,
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2020&type=national`
    );
    expect(holidays).toHaveLength(1);
    expect(holidays[0]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2020-10-12',
    });
  });
  test('gets holidays asking for the next year if end date is in the next year', async () => {
    const mockedResponseFirstYear = [
      mockedHolidays['AR-1'],
      mockedHolidays['AR-2'],
      mockedHolidays['AR-3'],
    ];
    const mockedResponseSecondYear = [
      mockedHolidays['AR-4'],
      mockedHolidays['AR-5'],
    ];
    fetchAPI
      .mockResolvedValueOnce({
        response: {
          holidays: mockedResponseFirstYear,
        },
      })
      .mockResolvedValueOnce({
        response: {
          holidays: mockedResponseSecondYear,
        },
      });

    const startDate = moment('2020-10-01');
    const endDate = moment('2021-12-01');
    const holidays = await getHolidays({
      countryCode: 'AR',
      startDate,
      endDate,
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2020&type=national`
    );
    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2021&type=national`
    );
    expect(holidays).toHaveLength(4);
    expect(holidays[0]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2020-10-12',
    });
    expect(holidays[1]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'National Sovereignty Day',
      date: '2020-11-20',
    });
    expect(holidays[2]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2021-01-12',
    });
    expect(holidays[3]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'National Sovereignty Day',
      date: '2021-02-20',
    });
  });
  test('gets the next 10 holidays for a given country and fetches the next year', async () => {
    const mockedResponseFirstYear = [
      mockedHolidays['AR-1'],
      mockedHolidays['AR-2'],
      mockedHolidays['AR-3'],
    ];
    const mockedResponseSecondYear = [
      mockedHolidays['AR-4'],
      mockedHolidays['AR-5'],
    ];
    fetchAPI
      .mockResolvedValueOnce({
        response: {
          holidays: mockedResponseFirstYear,
        },
      })
      .mockResolvedValueOnce({
        response: {
          holidays: mockedResponseSecondYear,
        },
      });

    const startDate = moment('2020-10-01');
    const holidays = await getHolidays({
      countryCode: 'AR',
      startDate,
      count: 3,
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2020&type=national`
    );
    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2021&type=national`
    );
    expect(holidays).toHaveLength(3);
    expect(holidays[0]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2020-10-12',
    });
    expect(holidays[1]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'National Sovereignty Day',
      date: '2020-11-20',
    });
    expect(holidays[2]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2021-01-12',
    });
  });
  test('gets the next holidays for a given country and falls back to second provider due to an error with the principal', async () => {
    const mockedResponse = [
      mockedHolidays['AR-nager-1'],
      mockedHolidays['AR-nager-2'],
      mockedHolidays['AR-nager-3'],
    ];
    fetchAPI
      .mockRejectedValueOnce(new Error('Fetch API was not ok'))
      .mockResolvedValueOnce(mockedResponse);

    const startDate = moment('2020-10-01');
    const holidays = await getHolidays({
      countryCode: 'AR',
      startDate,
      count: 2,
    });

    expect(fetchAPI).toHaveBeenCalledWith(
      `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_TOKEN}&country=AR&year=2020&type=national`
    );
    expect(fetchAPI).toHaveBeenCalledWith(
      'https://date.nager.at/api/v2/publicholidays/2020/AR'
    );
    expect(holidays).toHaveLength(2);
    expect(holidays[0]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'Day of Respect for Cultural Diversity',
      date: '2020-10-12',
    });
    expect(holidays[1]).toEqual({
      country: {
        emoji: '🇦🇷',
        name: 'Argentina',
      },
      name: 'National Sovereignty Day',
      date: '2020-11-20',
    });
  });
});

describe('getHolidaysWorldwide', () => {
  test('gets the next holidays in the world for the first and second day', async () => {
    const mockedResponse = [
      mockedHolidays['BO-1'],
      mockedHolidays['AU-1'],
      mockedHolidays['GD-1'],
      mockedHolidays['SV-1'],
    ];
    fetchAPI.mockResolvedValue(mockedResponse);

    const holidays = await getHolidaysWorldwide();

    expect(fetchAPI).toHaveBeenCalledWith(
      'https://date.nager.at/api/v2/nextpublicholidaysworldwide'
    );
    expect(holidays).toHaveLength(2);
    expect(holidays[0].date).toEqual('2020-08-02');
    expect(holidays[0].holidays[0]).toEqual({
      name: 'Agrarian Reform Day',
      country: { emoji: '🇧🇴', name: 'Bolivia' },
    });
    expect(holidays[1].date).toEqual('2020-08-03');
    expect(holidays[1].holidays[0]).toEqual({
      name: 'Emancipation Day',
      country: { emoji: '🇬🇩', name: 'Grenada' },
    });
  });
});
