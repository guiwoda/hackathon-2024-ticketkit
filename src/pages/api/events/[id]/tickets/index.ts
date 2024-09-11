import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const CROSSMINT_API_URL = 'https://staging.crossmint.com/api';
const CROSSMINT_API_KEY = process.env.NEXT_PRIVATE_CROSSMINT_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { name, supply, description, attributes, image } = req.body;

    try {
      const response = await fetch(`${CROSSMINT_API_URL}/2022-06-09/collections/${id}/nfts`, {
        method: 'POST',
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata: {
            name,
            description,
            image,
            attributes,
          },
          recipient: 'email:{{email}}',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const ticket = await response.json();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create ticket', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}