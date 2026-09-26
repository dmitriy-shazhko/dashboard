import { z } from 'zod';

export const customerSchema = z.object({
    id: z.number().nonnegative(),
    name: z
        .string()
        .trim()
        .nonempty()
        .max(100, 'Имя должно быть не длиннее 100 символов'),
    balance: z.coerce.number().nonnegative(),
    birthDate: z.iso.date().nullable().optional(),
});

export const customerCreateSchema = customerSchema.omit({
    id: true,
    balance: true,
});

export const customerUpdateSchema = customerSchema.omit({
    id: true,
});

export const customerOptionSchema = customerSchema.omit({
    balance: true,
    birthDate: true,
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerOption = z.infer<typeof customerOptionSchema>;

export type CustomerCreateDTO = z.infer<typeof customerCreateSchema>;
export type CustomerUpdateDTO = z.infer<typeof customerUpdateSchema>;
