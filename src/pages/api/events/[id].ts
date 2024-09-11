'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const CROSSMINT_API_URL = 'https://staging.crossmint.com/api';
const CROSSMINT_API_KEY = process.env.NEXT_PRIVATE_CROSSMINT_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const response = await fetch(`${CROSSMINT_API_URL}/2022-06-09/collections/${id}`, {
      headers: {
        'X-API-KEY': CROSSMINT_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    const collection = await response.json();
    const {date, location} = JSON.parse(collection.metadata.description);
    const event = {
      id: collection.id,
      name: collection.metadata.name,
      date: date,
      location: location,
      image: collection.metadata.imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/'),
      capacity: collection.metadata.supplyLimit,
    };

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event', details: error.message });
  }
}