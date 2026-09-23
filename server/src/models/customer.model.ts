import { db } from '../config/database.js';
import {
    Customer,
    CustomerCreateDTO,
    CustomerOption,
    customerSchema,
    CustomerUpdateDTO,
} from '../schemas/customer.schema.js';
import { CountRow } from '../types/base.js';

export const CustomerModel = {
    async findAll(limit: number, offset: number): Promise<Customer[]> {
        const rows = await db.any<Customer>(
            `
                SELECT
                    id,
                    name,
                    balance,
                    birth_date::text AS "birthDate"
                FROM customers
                ORDER BY id
                LIMIT $1
                OFFSET $2
            `,
            [limit, offset],
        );

        return customerSchema.array().parse(rows);
    },

    async count(): Promise<number> {
        const result = await db.one<CountRow>(
            `
            SELECT COUNT(*)::integer AS count
            FROM customers
        `,
        );

        return result.count;
    },

    async findById(id: number): Promise<Customer | null> {
        const row = await db.oneOrNone<Customer | null>(
            `
            SELECT
                id,
                name,
                balance,
                birth_date::text AS "birthDate"
            FROM customers
            WHERE id = $1
        `,
            [id],
        );

        if (!row) return null;

        return customerSchema.parse(row);
    },

    async create(data: CustomerCreateDTO): Promise<Customer> {
        const row = await db.one<Customer>(
            `
            INSERT INTO customers (
                name,
                balance, birth_date
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                balance,
                birth_date::text AS "birthDate"
        `,
            [data.name, 0, data.birthDate],
        );

        return customerSchema.parse(row);
    },

    async update(
        id: number,
        data: CustomerUpdateDTO,
    ): Promise<Customer | null> {
        const row = await db.oneOrNone<Customer>(
            `
            UPDATE customers
            SET
                name = $1,
                balance = $2,
                birth_date = $3
            WHERE id = $4
            RETURNING
                id,
                name,
                balance,
                birth_date::text AS "birthDate"
        `,
            [data.name, data.balance, data.birthDate, id],
        );

        if (!row) return null;

        return customerSchema.parse(row);
    },

    async delete(id: number): Promise<boolean> {
        const result = await db.result(
            `
            DELETE FROM customers
            WHERE id = $1
        `,
            [id],
        );

        return result.rowCount > 0;
    },

    async findOptions(): Promise<CustomerOption[]> {
        const rows = await db.any(
            `
            SELECT
                id,
                name
            FROM customers
            ORDER BY name
        `,
        );

        return rows;
    },
};
