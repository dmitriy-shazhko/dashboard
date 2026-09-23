import express from 'express';
import cors from 'cors';
import customersRoute from './routes/customer.routes.js';
import ordersRoute from './routes/order.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
    }),
);

app.use(express.json());

app.use('/api/customers', customersRoute);
app.use('/api/orders', ordersRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
