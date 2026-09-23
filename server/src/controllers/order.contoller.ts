import { NextFunction, Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { getIdFromParams } from '../utils/workWithId.js';
import {
    createOrderSchema,
    updateOrderSchema,
} from '../schemas/order.schema.js';

export const OrderController = {
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            const limitValue = Number(req.query.limit ?? 10);
            const offsetValue = Number(req.query.offset ?? 0);

            if (
                !Number.isInteger(limitValue) ||
                limitValue < 1 ||
                limitValue > 100
            ) {
                resp.status(400).json({
                    message: 'Limit must be an integer from 1 to 100',
                });
                return;
            }

            if (!Number.isInteger(offsetValue) || offsetValue < 0) {
                resp.status(400).json({
                    message: 'Offset must be a non-negative integer',
                });
                return;
            }

            const [data, total] = await Promise.all([
                OrderModel.findAll(limitValue, offsetValue),
                OrderModel.count(),
            ]);

            resp.status(200).json({
                data,
                total,
                limit: limitValue,
                offset: offsetValue,
            });
        } catch (error) {
            next(error);
        }
    },
    async getById(req: Request, resp: Response, next: NextFunction) {
        try {
            const id = getIdFromParams(req);
            const order = await OrderModel.findById(id);

            if (!order) {
                resp.status(404).json({
                    message: 'Order not found',
                });

                return;
            }

            resp.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, resp: Response, next: NextFunction) {
        try {
            const data = createOrderSchema.parse(req.body);
            const order = await OrderModel.create(data);

            resp.status(201).json(order);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            const id = getIdFromParams(req);
            const res = await OrderModel.delete(id);

            resp.status(200).json(res);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, resp: Response, next: NextFunction) {
        try {
            const id = getIdFromParams(req);
            const data = updateOrderSchema.parse(req.body);
            const order = await OrderModel.update(id, data);

            resp.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },
};
