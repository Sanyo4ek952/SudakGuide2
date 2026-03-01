import { z } from 'zod';

export const userRoleSchema = z.enum(['USER', 'HOST', 'ADMIN']);

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  password: z.string().min(8).max(128)
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
