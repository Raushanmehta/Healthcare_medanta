// pages/api/patients/[id]/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { registerPatient } from '@/lib/actions/patient.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const result = await registerPatient(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in API route:", error);
            res.status(500).json({ error: 'Failed to register patient' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
