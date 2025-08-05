import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z
    .string()
    .min(6, 'Hasło musi mieć min. 6 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać jedną dużą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .regex(/[^A-Za-z0-9]/, 'Hasło musi zawierać znak specjalny'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła muszą być identyczne',
  path: ['confirmPassword'],
});
