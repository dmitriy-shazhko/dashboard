import { Request } from 'express';

export const parseId = (value: string): number => {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Customer id must be a positive integer');
    }

    return id;
};

export const getIdFromParams = (req: Request) => {
    const rawId = req.params.id;

    if (Array.isArray(rawId)) {
        throw new Error('Customer id must be a single value');
    }

    return parseId(rawId);
};
