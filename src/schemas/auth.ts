import * as z from 'zod';

const passwordSchema = z
    .string()
    .min(8, { message: 'The password should have more than 8 characters' })
    .max(20, { message: 'The password should have less than 20 characters' })
    .refine((password) => /[A-Z]/.test(password), {
        message: 'The password should contain at least one uppercase letter',
    })
    .refine((password) => /[a-z]/.test(password), {
        message: 'The password should contain at least one lowercase letter',
    })
    .refine((password) => /[0-9]/.test(password), { message: 'The password should contain at least one digit' })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'The password should contain at least one special character',
    });

export const SignInSchema = z.object({
    email: z.email(),
    password: passwordSchema,
});

export const SignUpSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    name: z.string(),
    photoUrl: z.string().optional(),
});