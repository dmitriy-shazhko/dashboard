import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (error, _req, resp, _next) => {
    console.error(error);
    console.log(error instanceof ZodError);

    if (error instanceof ZodError) {
        resp.status(400).json({
            message: 'Validation failed',
            errors: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });

        return;
    }

    resp.status(500).json({
        message: 'Internal server error',
    });
};
