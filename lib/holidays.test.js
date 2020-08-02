import fetchAPI from '../utils/apiClient';
import { getHolidays, getHolidaysWorldwide } from './holidays';
import moment from 'moment';

jest.mock('../utils/apiClient');

const mockedHolidays = {
  'AR-1': {
    date: '2020-08-17',
    localName: 'Paso a la Inmortalidad del General José de San Martín',
    name: 'General José de San Martín Memorial Day',
    countryCode: 'AR',
    fixed: false,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
  'AR-2': {
    date: '2020-10-12',
    localName: 'Día del Respeto a la Diversidad Cultural',
    name: 'Day of Respect for Cultural Diversity',
    countryCode: 'AR',
    fixed: false,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
  'US-1': {
    date: '2020-09-07',
    localName: 'Labor Day',
    name: 'Labour Day',
    countryCode: 'US',
    fixed: false,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
  'BO-1': {
    date: '2020-08-02',
    localName: 'Día de la Revolución Agraria',
    name: 'Agrarian Reform Day',
    countryCode: 'BO',
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
  'AU-1': {
    date: '2020-08-03',
    localName: 'Picnic Day',
    name: 'Picnic Day',
    countryCode: 'AU',
    fixed: false,
    global: false,
    counties: ['AUS-NT'],
    launchYear: null,
    type: 'Public',
  },
  'GD-1': {
    date: '2020-08-03',
    localName: 'Emancipation Day',
    name: 'Emancipation Day',
    countryCode: 'GD',
    fixed: false,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
  'SV-1': {
    date: '2020-08-04',
    localName: 'Fiestas de agosto',
    name: 'August Festivals',
    countryCode: 'SV',
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
    type: 'Public',
  },
};

describe('getHolidays', () => {
  test('gets the next holiday for a given country', async () => {
    const mockedResponse = [mockedHolidays['AR-1'], mockedHolidays['AR-2']];
    fetchAPI.mockResolvedValue(mockedResponse);

    const today = moment('2020-08-01');
    const holidays = await getHolidays('AR', today);

    expect(fetchAPI).toHaveBeenCalledWith(
      'https://date.nager.at/api/v2/nextpublicholidays/AR'
    );
    expect(holidays).toHaveLength(1);
    expect(holidays[0]).toEqual(mockedHolidays['AR-1']);
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
