import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/errors.js';

export const errorHandler: ErrorRequestHandler = (error, _req, resp, _next) => {
    console.error(error);
    console.log(error instanceof ZodError);

    if (error instanceof ZodError) {
        return resp.status(400).json({
            message: 'Ошибка валидации данных',
            errors: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    if (error instanceof HttpError) {
        return resp.status(error.statusCode).json({ message: error.message });
    }

    return resp.status(500).json({
        message: 'Внутренняя ошибка сервера',
    });
};
