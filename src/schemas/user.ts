import * as z from 'zod';

export const UserCreateSchema = z.object({
    name: z.string()
});

export const UserUpdateSchema = z.object({
    name: z.string()
});

export type User = z.infer<typeof UserCreateSchema> & {
    id: number;
};

