import { getHolidays } from './holidays';
import { getCountryAlpha2 } from './countries';
import moment from 'moment';

/**
 * This function parses the output from the Wit.ai structured result
 * QUESTIONS ALREADY IMPLEMENTED?
 * - What's the next holiday in Argentina?
 * PENDING QUESTIONS:
 * - What are the next holidays in USA in the next two months?
 * - How many holidays are in Spain between September and November?
 * - Are there any holidays in Ukraine in two weeks?
 * - List the holidays in USA and Ukraine between August 1st and October 31st
 * @param {Array} intents 
 * @param {Object} entities 
 */
export default async function questionResolver (intents, entities) {

    if (!entities['country:country']) {
        return { status: "missing_country" };
    }

    const country = getCountryAlpha2(entities['country:country'][0].value);

    console.debug(`Country ${country}`);

    let startDate = moment();
    let endDate;
    let count;

    switch(intents[0].name) {
        case 'list_holiday':
            count = 1;
            break;
        default:
            return { status: "unknown_question" };
    }

    const holidays = await getHolidays(country, startDate, endDate, count);

    const answer_title = 'The next holiday is';

    return { status: "success", answer_title, holidays };
}