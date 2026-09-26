import { db } from '../config/database.js';
import {
    Order,
    OrderCreateDTO,
    orderSchema,
    OrderUpdateDTO,
} from '../schemas/order.schema.js';
import { CountRow } from '../types/base.js';

export const OrderModel = {
    async findAll(limit: number, offset: number): Promise<Order[]> {
        const rows = await db.any<Order>(
            `
            SELECT 
                o.id,
                o.customer_id AS "customerId",
                c.name AS "customerName",
                o.product_name AS "productName",
                price,
                order_date::text AS "orderDate",
                quantity
            FROM orders o
            JOIN customers c
                ON c.id = o.customer_id
            ORDER BY o.id
            LIMIT $1
            OFFSET $2
        `,
            [limit, offset],
        );

        return orderSchema.array().parse(rows);
    },

    async count(): Promise<number> {
        const result = await db.one<CountRow>(
            `
                SELECT COUNT(*)::integer AS count
                FROM orders
            `,
        );

        return result.count;
    },

    async create(data: OrderCreateDTO): Promise<Order> {
        const order = await db.one<Order>(
            `
            WITH new_order as (
                INSERT INTO orders (
                    customer_id, 
                    product_name, 
                    price, 
                    order_date, 
                    quantity
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING
                    id,
                    customer_id,
                    product_name,
                    price,
                    order_date,
                    quantity
            )
            SELECT
                o.id,
                o.customer_id AS "customerId",
                c.name AS "customerName",
                o.product_name AS "productName",
                o.price,
                o.order_date::text AS "orderDate",
                o.quantity
            FROM new_order o
            JOIN customers c ON c.id = o.customer_id
        `,
            [
                data.customerId,
                data.productName,
                data.price,
                new Date(),
                data.quantity,
            ],
        );

        return orderSchema.parse(order);
    },

    async findById(id: number): Promise<Order | null> {
        const order = await db.oneOrNone<Order | null>(
            `
            SELECT
                o.id,
                o.customer_id AS "customerId",
                c.name AS "customerName",
                o.product_name AS "productName",
                o.price,
                o.order_date::text AS "orderDate",
                o.quantity
            FROM orders o
            JOIN customers c ON c.id = o.customer_id
            WHERE o.id = $1
        `,
            [id],
        );

        if (!order) return null;

        return orderSchema.parse(order);
    },

    async delete(id: number): Promise<boolean> {
        const result = await db.result(
            `
            DELETE FROM orders
            WHERE id = $1
        `,
            [id],
        );

        return result.rowCount > 0;
    },

    async update(id: number, data: OrderUpdateDTO): Promise<Order | null> {
        const order = await db.oneOrNone<Order | null>(
            `WITH updated_order as (
                UPDATE orders
                SET
                    customer_id = $1,
                    product_name = $2, 
                    price = $3, 
                    order_date = $4, 
                    quantity = $5
                WHERE id = $6
                RETURNING
                    id,
                    customer_id,
                    product_name,
                    price,
                    order_date,
                    quantity
            )
            SELECT
                o.id,
                o.customer_id AS "customerId",
                c.name AS "customerName",
                o.product_name AS "productName",
                o.price,
                o.order_date::text AS "orderDate",
                o.quantity
            FROM updated_order o
            JOIN customers c ON c.id = o.customer_id
            `,
            [
                data.customerId,
                data.productName,
                data.price,
                data.orderDate,
                data.quantity,
                id,
            ],
        );

        if (!order) return null;

        return orderSchema.parse(order);
    },
};
