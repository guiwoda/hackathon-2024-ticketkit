import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const CROSSMINT_API_URL = 'https://staging.crossmint.com/api';
const CROSSMINT_API_KEY = process.env.NEXT_PRIVATE_CROSSMINT_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${CROSSMINT_API_URL}/2022-06-09/collections`, {
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
        },
      });
      
      const collections = await response.json();
      const events = collections.results.filter(collection => !collection.id.startsWith('default')).map(async (collection) => {
        const royalties = await getRoyalties(collection.id);

        let date, location;
        try {
            const parsed = JSON.parse(collection.metadata.description);
            date = parsed.date;
            location = parsed.location;
        } catch (error) {
          console.error('Error parsing event metadata:', error);
          const date = 'unknown';
          const location = 'unknown';
        }

        return {
          id: collection.id,
          name: collection.metadata.name,
          date,
          location,
          image: collection.metadata.imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          capacity: collection.supplyLimit,
          paymentAmount: collection.payments.price,
          paymentCurrency: collection.payments.currency,
          recipientAddress: royalties.address,
          fee: royalties.basisPoints,
        };
      });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch collections from Crossmint', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { name, date, location, image, capacity, paymentAmount, paymentCurrency, recipientAddress, fee } = req.body;
    if (!name || !date || !location || !image || !capacity || !paymentAmount || !paymentCurrency || !recipientAddress || !fee) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newEvent = { name, date, location, image, capacity, paymentAmount, paymentCurrency, recipientAddress, fee };

    try {
      const response = await fetch(`${CROSSMINT_API_URL}/2022-06-09/collections`, {
        method: 'POST',
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: 'polygon-amoy',
          supplyLimit: Number(newEvent.capacity),
          payments: {
            currency: newEvent.paymentCurrency,
            price: Number(newEvent.paymentAmount),
            recipientAddress: newEvent.recipientAddress,
            fee: Number(newEvent.fee),
          },
          metadata: {
            name: newEvent.name,
            description: JSON.stringify({ date, location }),
            imageUrl: newEvent.image
        }
        }),
      });
      const collection = await response.json();
      res.status(201).json({ ...newEvent, collection });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Crossmint Collection', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getRoyalties(id: string): Promise<Royalties> {
    const royaltiesResponse = await fetch(`${CROSSMINT_API_URL}/v1-alpha1/minting/collections/${id}/royalties`, {
        method: 'GET',
        headers: {
            'X-API-KEY': CROSSMINT_API_KEY,
            'Content-Type': 'application/json',
        }
    });

    if (!royaltiesResponse.ok) {
        console.error(await royaltiesResponse.json());
        throw new Error('Failed to read royalties');
    }
    const royalties = await royaltiesResponse.json();
    return royalties as Royalties;
}

interface Royalties {
    address: string;
    basisPoints: number;
}
