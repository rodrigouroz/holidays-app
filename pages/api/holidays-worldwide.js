// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getHolidaysWorldwide } from '../../lib/holidays';

export default async (_, res) => {
  try {
    res.status(200).json(await getHolidaysWorldwide());
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
