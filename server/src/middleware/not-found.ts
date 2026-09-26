import { Request, Response } from 'express';

export const notFound = (_req: Request, resp: Response) => {
    resp.status(404).json({ message: 'Route not found' });
};
