export class HttpError extends Error {
    constructor(
        public statusCode: number,
        message: string,
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Ресурс не найден') {
        super(404, message);
        this.name = 'NotFoundError';
    }
}
