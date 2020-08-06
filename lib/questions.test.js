import { getHolidays } from './holidays';
import moment from 'moment';
import questionResolver from './questions';

jest.mock('./holidays');
jest.mock('moment');

const next_holiday_in_argentina = {
  text: "what's the next holiday in argentina",
  intents: [
    { id: '582923679259102', name: 'list_holiday', confidence: 0.9999 },
  ],
  entities: {
    'country:country': [
      {
        id: '693128311268219',
        name: 'country',
        role: 'country',
        start: 27,
        end: 36,
        body: 'argentina',
        confidence: 0.9959,
        entities: [],
        value: 'argentina',
        type: 'value',
      },
    ],
  },
  traits: {},
};

const holiday_usa_next_two_weeks = {
  text: 'What are the holidays in USA in the next two weeks?',
  intents: [
    { id: '2826295110810186', name: 'list_holidays', confidence: 0.9988 },
  ],
  entities: {
    'wit$datetime:datetime': [
      {
        id: '684072919121347',
        name: 'wit$datetime',
        role: 'datetime',
        start: 36,
        end: 50,
        body: 'next two weeks',
        confidence: 0.9801,
        entities: [],
        type: 'interval',
        from: { grain: 'week', value: '2020-08-10T00:00:00.000-07:00' },
        to: { grain: 'week', value: '2020-08-24T00:00:00.000-07:00' },
        values: [
          {
            type: 'interval',
            from: { grain: 'week', value: '2020-08-10T00:00:00.000-07:00' },
            to: { grain: 'week', value: '2020-08-24T00:00:00.000-07:00' },
          },
        ],
      },
    ],
    'country:country': [
      {
        id: '693128311268219',
        name: 'country',
        role: 'country',
        start: 25,
        end: 28,
        body: 'USA',
        confidence: 0.9778,
        entities: [],
        value: 'USA',
        type: 'value',
      },
    ],
  },
  traits: {},
};

const holidays_ukraine_september = {
  text: 'What are the holidays in ukraine in september?',
  intents: [
    { id: '2826295110810186', name: 'list_holidays', confidence: 0.9982 },
  ],
  entities: {
    'wit$datetime:datetime': [
      {
        id: '684072919121347',
        name: 'wit$datetime',
        role: 'datetime',
        start: 33,
        end: 45,
        body: 'in september',
        confidence: 0.8441,
        entities: [],
        type: 'value',
        grain: 'month',
        value: '2020-09-01T00:00:00.000-07:00',
        values: [
          {
            type: 'value',
            grain: 'month',
            value: '2020-09-01T00:00:00.000-07:00',
          },
          {
            type: 'value',
            grain: 'month',
            value: '2021-09-01T00:00:00.000-07:00',
          },
          {
            type: 'value',
            grain: 'month',
            value: '2022-09-01T00:00:00.000-07:00',
          },
        ],
      },
    ],
    'country:country': [
      {
        id: '693128311268219',
        name: 'country',
        role: 'country',
        start: 25,
        end: 32,
        body: 'ukraine',
        confidence: 0.9777,
        entities: [],
        value: 'ukraine',
        type: 'value',
      },
    ],
  },
  traits: {},
};

const next_holidays_argentina_usa = {
  text: 'what are the next holidays in argentina and usa?',
  intents: [
    { id: '2826295110810186', name: 'list_holidays', confidence: 0.9973 },
  ],
  entities: {
    'country:country': [
      {
        id: '693128311268219',
        name: 'country',
        role: 'country',
        start: 30,
        end: 39,
        body: 'argentina',
        confidence: 0.9962,
        entities: [],
        value: 'argentina',
        type: 'value',
      },
      {
        id: '693128311268219',
        name: 'country',
        role: 'country',
        start: 44,
        end: 47,
        body: 'usa',
        confidence: 0.9817,
        entities: [],
        value: 'USA',
        type: 'value',
      },
    ],
  },
  traits: {},
};

describe('questionResolver', () => {
  test('gets the next holiday for a given country', async () => {
    const holidays = [
      { date: '2020-08-17', name: 'a holiday', country: { name: 'Argentina' } },
    ];
    const today = '2020-08-05';

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturnValueOnce(today);

    const response = await questionResolver(
      next_holiday_in_argentina.intents,
      next_holiday_in_argentina.entities
    );
    expect(moment).toHaveBeenCalled();
    expect(getHolidays).toHaveBeenCalledWith('AR', today, undefined, 1);
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The holiday in Argentina is',
      holidays,
    });
  });

  test('gets the holidays for a given country in the next two weeks and returns more than one', async () => {
    const holidays = [
      {
        date: '2020-08-17',
        name: 'a holiday',
        country: { name: 'United States' },
      },
      {
        date: '2020-08-20',
        name: 'a second holiday',
        country: { name: 'United States' },
      },
    ];
    const startDate = jest.fn();
    const endDate = jest.fn();

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturnValueOnce(startDate).mockReturnValueOnce(endDate);

    const response = await questionResolver(
      holiday_usa_next_two_weeks.intents,
      holiday_usa_next_two_weeks.entities
    );

    expect(moment).toHaveBeenCalledWith('2020-08-10T00:00:00.000-07:00');
    expect(moment).toHaveBeenCalledWith('2020-08-24T00:00:00.000-07:00');
    expect(getHolidays).toHaveBeenCalledWith(
      'US',
      startDate,
      endDate,
      undefined
    );
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The holidays in United States are',
      holidays,
    });
  });

  test('gets the holidays for a given country in the next two weeks and returns just one', async () => {
    const holidays = [
      {
        date: '2020-08-17',
        name: 'a holiday',
        country: { name: 'United States' },
      },
    ];
    const startDate = jest.fn();
    const endDate = jest.fn();

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturnValueOnce(startDate).mockReturnValueOnce(endDate);

    const response = await questionResolver(
      holiday_usa_next_two_weeks.intents,
      holiday_usa_next_two_weeks.entities
    );

    expect(moment).toHaveBeenCalledWith('2020-08-10T00:00:00.000-07:00');
    expect(moment).toHaveBeenCalledWith('2020-08-24T00:00:00.000-07:00');
    expect(getHolidays).toHaveBeenCalledWith(
      'US',
      startDate,
      endDate,
      undefined
    );
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The holiday in United States is',
      holidays,
    });
  });

  test('gets the holidays for a given country in the next two weeks and returns an empty list', async () => {
    const holidays = [];
    const startDate = jest.fn();
    const endDate = jest.fn();

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturnValueOnce(startDate).mockReturnValueOnce(endDate);

    const response = await questionResolver(
      holiday_usa_next_two_weeks.intents,
      holiday_usa_next_two_weeks.entities
    );

    expect(moment).toHaveBeenCalledWith('2020-08-10T00:00:00.000-07:00');
    expect(moment).toHaveBeenCalledWith('2020-08-24T00:00:00.000-07:00');
    expect(getHolidays).toHaveBeenCalledWith(
      'US',
      startDate,
      endDate,
      undefined
    );
    expect(response).toEqual({
      status: 'success',
      answer_title: 'There are no holidays',
      holidays,
    });
  });

  test('gets the holidays for a given country for a given month', async () => {
    const holidays = [
      { date: '2020-08-17', name: 'a holiday', country: { name: 'Ukraine' } },
      {
        date: '2020-08-20',
        name: 'a second holiday',
        country: { name: 'Ukraine' },
      },
    ];
    const startDate = jest.fn();
    const endDate = jest.fn();
    const tmpDate = jest.fn();
    tmpDate.endOf = jest.fn(() => endDate);

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturnValueOnce(startDate).mockReturnValueOnce(tmpDate);

    const response = await questionResolver(
      holidays_ukraine_september.intents,
      holidays_ukraine_september.entities
    );

    expect(moment).toHaveBeenCalledWith('2020-09-01T00:00:00.000-07:00');
    expect(getHolidays).toHaveBeenCalledWith(
      'UA',
      startDate,
      endDate,
      undefined
    );
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The holidays in Ukraine are',
      holidays,
    });
  });

  test('gets the holidays for several countries and returns a list sorted by date', async () => {
    // TODO: check how to mock moment to test for this array being sorted
    const holidays_us = [
      {
        date: '2020-11-17',
        name: 'a holiday in us',
        country: { name: 'United States' },
      },
      {
        date: '2020-12-20',
        name: 'a second holiday in us',
        country: { name: 'United States' },
      },
    ];
    const holidays_ar = [
      {
        date: '2020-09-02',
        name: 'a holiday in ar',
        country: { name: 'Argentina' },
      },
      {
        date: '2020-10-01',
        name: 'a second holiday in ar',
        country: { name: 'Argentina' },
      },
    ];

    getHolidays
      .mockResolvedValueOnce(holidays_ar)
      .mockResolvedValueOnce(holidays_us);

    moment.mockImplementation(
      jest.fn(() => ({
        isAfter: () => true,
        isBefore: () => false,
      }))
    );

    const response = await questionResolver(
      next_holidays_argentina_usa.intents,
      next_holidays_argentina_usa.entities
    );

    expect(getHolidays).toHaveBeenCalledWith(
      'AR',
      expect.anything(),
      undefined,
      undefined
    );
    expect(getHolidays).toHaveBeenCalledWith(
      'US',
      expect.anything(),
      undefined,
      undefined
    );
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The holidays in Argentina, United States are',
      holidays: [
        {
          date: '2020-09-02',
          name: 'a holiday in ar',
          country: { name: 'Argentina' },
        },
        {
          date: '2020-10-01',
          name: 'a second holiday in ar',
          country: { name: 'Argentina' },
        },
        {
          date: '2020-11-17',
          name: 'a holiday in us',
          country: { name: 'United States' },
        },
        {
          date: '2020-12-20',
          name: 'a second holiday in us',
          country: { name: 'United States' },
        },
      ],
    });
  });
});
