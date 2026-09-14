import { Request, Response } from 'express';

export const notFound = (_req: Request, resp: Response) => {
    console.log(_req.url);
    resp.status(404).json({ message: 'Route not found' });
};
