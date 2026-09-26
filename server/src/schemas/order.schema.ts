import z from 'zod';

export const orderSchema = z.object({
    id: z.number().nonnegative(),
    customerId: z.number().nonnegative(),
    customerName: z.string().trim().nonempty(),
    productName: z.string().trim().nonempty(),
    price: z.coerce.number().nonnegative(),
    orderDate: z.iso.date(),
    quantity: z.coerce.number().positive(),
});

export const createOrderSchema = orderSchema.omit({
    id: true,
    orderDate: true,
    customerName: true,
});

export const updateOrderSchema = orderSchema.omit({
    id: true,
    customerName: true,
});

export type Order = z.infer<typeof orderSchema>;
export type OrderCreateDTO = z.infer<typeof createOrderSchema>;
export type OrderUpdateDTO = z.infer<typeof updateOrderSchema>;
