import {
  emailSchema,
  otpCodeSchema,
  otpVerifySchema,
  passwordSchema,
  phoneLoginSchema,
  phoneSchema,
  signInSchema,
  signUpSchema,
} from '../../../registry/forms/auth-schemas/auth-schemas';

describe('auth-schemas', () => {
  test('emailSchema accepts valid email and rejects empty/invalid', () => {
    expect(emailSchema.safeParse('ada@example.com').success).toBe(true);
    expect(emailSchema.safeParse('').success).toBe(false);
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });

  test('passwordSchema requires 8 characters', () => {
    expect(passwordSchema.safeParse('secret12').success).toBe(true);
    expect(passwordSchema.safeParse('short').success).toBe(false);
    expect(passwordSchema.safeParse('').success).toBe(false);
  });

  test('signInSchema only requires non-empty password', () => {
    expect(signInSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true);
    expect(signInSchema.safeParse({ email: 'a@b.co', password: '' }).success).toBe(false);
  });

  test('signUpSchema requires name, email, and strong password', () => {
    expect(
      signUpSchema.safeParse({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'secret12',
      }).success,
    ).toBe(true);
    expect(
      signUpSchema.safeParse({
        name: 'A',
        email: 'ada@example.com',
        password: 'secret12',
      }).success,
    ).toBe(false);
  });

  test('otp schemas accept 6 digits only', () => {
    expect(otpCodeSchema.safeParse('123456').success).toBe(true);
    expect(otpCodeSchema.safeParse('12345').success).toBe(false);
    expect(otpCodeSchema.safeParse('abcdef').success).toBe(false);
    expect(otpVerifySchema.safeParse({ code: '123456' }).success).toBe(true);
  });

  test('phoneSchema accepts E.164-ish numbers', () => {
    expect(phoneSchema.safeParse('+1 555 0100').success).toBe(true);
    expect(phoneSchema.safeParse('15550100123').success).toBe(true);
    expect(phoneSchema.safeParse('').success).toBe(false);
    expect(phoneSchema.safeParse('12').success).toBe(false);
    expect(phoneLoginSchema.safeParse({ phone: '+15550100' }).success).toBe(true);
  });
});
