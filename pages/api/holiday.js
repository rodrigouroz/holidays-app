// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Wit, log } from 'node-wit'
import questionResolver from '../../lib/questions'

const client = new Wit({
  accessToken: process.env.WIT_TOKEN,
  logger: new log.Logger(log.DEBUG) // optional
});

export default async (req, res) => {
  
  try {

    if (!req.query.q) {
      throw new Error('Missing query');
    }

    const data = await client.message(req.query.q)
    const response = await questionResolver(data.intents, data.entities)

    res.status(200).json(response);  
    
  } catch (e) {
    console.error(e);
    res.status(400).end()
  }

}
