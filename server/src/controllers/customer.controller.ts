import { NextFunction, Request, Response } from 'express';
import { CustomerModel } from '../models/customer.model.js';
import {
    customerCreateSchema,
    customerUpdateSchema,
} from '../schemas/customer.schema.js';
import { getIdFromParams } from '../utils/workWithId.js';

export const CustomerController = {
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
                CustomerModel.findAll(limitValue, offsetValue),
                CustomerModel.count(),
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
            const customer = await CustomerModel.findById(id);

            if (!customer) {
                resp.status(404).json({
                    message: 'Customer not found',
                });

                return;
            }

            resp.status(200).json(customer);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, resp: Response, next: NextFunction) {
        try {
            const data = customerCreateSchema.parse(req.body);
            const customer = await CustomerModel.create(data);

            resp.status(201).json(customer);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            const id = getIdFromParams(req);
            const res = await CustomerModel.delete(id);

            resp.status(200).json(res);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, resp: Response, next: NextFunction) {
        try {
            const id = getIdFromParams(req);
            const data = customerUpdateSchema.parse(req.body);
            const customer = await CustomerModel.update(id, data);

            resp.status(200).json(customer);
        } catch (error) {
            next(error);
        }
    },

    async getOptions(_req: Request, resp: Response, next: NextFunction) {
        try {
            const customers = await CustomerModel.findOptions();

            resp.status(200).json(customers);
        } catch (error) {
            next(error);
        }
    },
};
