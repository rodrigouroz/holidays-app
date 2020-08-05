import { getHolidays } from './holidays';
import moment from 'moment';
import questionResolver from './questions';

jest.mock('./holidays');
jest.mock('moment');

const next_question_in_argentina = {
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

describe('questionResolver', () => {
  test('gets the next holiday for a given country', async () => {
    const holidays = {};
    const today = moment();

    getHolidays.mockResolvedValue(holidays);
    moment.mockReturndValue = today;

    const response = await questionResolver(
      next_question_in_argentina.intents,
      next_question_in_argentina.entities
    );

    expect(getHolidays).toHaveBeenCalledWith('AR', today, undefined, 1);
    expect(response).toEqual({
      status: 'success',
      answer_title: 'The next holiday is',
      holidays,
    });
  });
});
