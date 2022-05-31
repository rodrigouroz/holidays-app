// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getHolidaysForCountry } from '../../lib/holidays';

export default async (req, res) => {
  try {
    if (!req.query.country) {
      throw new Error('Missing country code');
    }

    const data = await getHolidaysForCountry(req.query.country);

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
