import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const CROSSMINT_API_URL = 'https://staging.crossmint.com/api';
const CROSSMINT_API_KEY = process.env.NEXT_PRIVATE_CROSSMINT_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid event ID' });
    }

    if (req.method === 'POST') {
        const { name, date, location, image, capacity, royalties } = req.body;
        if (!name || !date || !location || !image || !capacity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const response = await fetch(`${CROSSMINT_API_URL}/2022-06-09/collections/${id}`, {
                method: 'PATCH',
                headers: {
                    'X-API-KEY': CROSSMINT_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supplyLimit: Number(capacity)
                }),
            });

            if (!response.ok) {
                console.error(await response.json());
                throw new Error('Failed to update event');
            }

            if (royalties) {
                const royaltiesResponse = await fetch(`${CROSSMINT_API_URL}/v1-alpha1/minting/collections/${id}/royalties`, {
                    method: 'PUT',
                    headers: {
                        'X-API-KEY': CROSSMINT_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipients: [{
                            address: royalties.address,
                            basisPoints: Number(royalties.basisPoints)
                        }]
                    }),
                });

                if (!royaltiesResponse.ok) {
                    console.error(await royaltiesResponse.json());
                    throw new Error('Failed to update royalties');
                }
            } else {
                const royaltiesResponse = await fetch(`${CROSSMINT_API_URL}/v1-alpha1/minting/collections/${id}/royalties`, {
                    method: 'DELETE',
                    headers: {
                        'X-API-KEY': CROSSMINT_API_KEY,
                        'Content-Type': 'application/json',
                    }
                });

                if (!royaltiesResponse.ok) {
                    console.error(await royaltiesResponse.json());
                    throw new Error('Failed to delete royalties');
                }
            }

            const updatedEvent = await response.json();
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update event', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}