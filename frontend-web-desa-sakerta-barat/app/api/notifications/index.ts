import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Here you would typically fetch notifications from your backend
    // For now, we'll return mock data
    res.status(200).json([
      {
        id: 1,
        content: 'Your letter request has been approved',
        isRead: false,
      },
      {
        id: 2,
        content: 'New announcement from the village head',
        isRead: true,
      },
    ]);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
