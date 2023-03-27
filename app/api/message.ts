import type { NextApiRequest, NextApiResponse } from 'next'

export default function messageHandler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    res.status(200).json({ message: 'this is a message' })
}