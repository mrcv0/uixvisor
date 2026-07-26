// UIXVISOR — https://uixvisor.dev/forms/auth-schemas
//
// Shared Zod field and screen schemas for auth flows. UI never validates
// with if/else — screens compose these schemas through the form adapter.
import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

/** Sign-up / password creation: require a minimum length. */
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

/** Sign-in: only require non-empty (server owns strength rules for existing accounts). */
export const signInPasswordSchema = z.string().min(1, 'Password is required');

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters');

export const otpCodeSchema = z.string().regex(/^\d{6}$/, 'Enter the 6-digit code');

/**
 * E.164-ish phone: optional leading +, 8–15 digits after stripping spaces/dashes.
 * Host may replace with a region-specific schema.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .transform((value) => value.replace(/[\s()-]/g, ''))
  .refine((value) => /^\+?\d{8,15}$/.test(value), {
    message: 'Enter a valid phone number',
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const otpVerifySchema = z.object({
  code: otpCodeSchema,
});

export const phoneLoginSchema = z.object({
  phone: phoneSchema,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type OtpVerifyValues = z.infer<typeof otpVerifySchema>;
export type PhoneLoginValues = z.infer<typeof phoneLoginSchema>;
