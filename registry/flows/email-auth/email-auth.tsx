// UIXVISOR — https://uixvisor.dev/flows/email-auth
//
// Multi-step email authentication skeleton. Host adapters perform real auth;
// this flow only owns step state and wires registry screens together.
import { forwardRef, useState, type ComponentRef } from 'react';
import { View, type ViewProps } from 'react-native';

import type { SignInValues, SignUpValues } from '@registry/auth-schemas/auth-schemas';
import { OtpVerifyScreen } from '@registry/otp-verify/otp-verify';
import { SignInScreen } from '@registry/sign-in/sign-in';
import { SignUpScreen } from '@registry/sign-up/sign-up';
import { cn } from '@registry/theme/cn';

export type EmailAuthStep = 'sign-in' | 'sign-up' | 'otp';

export type EmailAuthMode = 'sign-in' | 'sign-up';

/** Return value from host sign-in/sign-up adapters to request OTP step. */
export interface EmailAuthContinue {
  needsOtp?: boolean;
  destinationLabel?: string;
}

export interface EmailAuthFlowProps extends ViewProps {
  initialStep?: EmailAuthStep;
  /**
   * When true, successful sign-in always advances to OTP unless the adapter
   * returns `{ needsOtp: false }`.
   */
  requireOtpAfterSignIn?: boolean;
  /** Same for sign-up. Defaults to true (email verification common after register). */
  requireOtpAfterSignUp?: boolean;
  onSignIn: (input: SignInValues) => Promise<EmailAuthContinue | void>;
  onSignUp: (input: SignUpValues) => Promise<EmailAuthContinue | void>;
  onVerifyOtp: (code: string, context: { mode: EmailAuthMode; email?: string }) => Promise<void>;
  onResendOtp?: (context: { mode: EmailAuthMode; email?: string }) => Promise<void>;
  onComplete: (result: { mode: EmailAuthMode }) => void;
  onForgotPasswordPress?: () => void;
  className?: string;
}

export const EmailAuthFlow = forwardRef<ComponentRef<typeof View>, EmailAuthFlowProps>(
  (
    {
      initialStep = 'sign-in',
      requireOtpAfterSignIn = false,
      requireOtpAfterSignUp = true,
      onSignIn,
      onSignUp,
      onVerifyOtp,
      onResendOtp,
      onComplete,
      onForgotPasswordPress,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<EmailAuthStep>(initialStep);
    const [mode, setMode] = useState<EmailAuthMode>(
      initialStep === 'sign-up' ? 'sign-up' : 'sign-in',
    );
    const [email, setEmail] = useState<string | undefined>();
    const [destinationLabel, setDestinationLabel] = useState<string | undefined>();

    const finishOrOtp = async (
      nextMode: EmailAuthMode,
      nextEmail: string,
      result: EmailAuthContinue | void,
      requireDefault: boolean,
    ) => {
      const needsOtp = result?.needsOtp ?? requireDefault;
      setMode(nextMode);
      setEmail(nextEmail);
      if (result?.destinationLabel) {
        setDestinationLabel(result.destinationLabel);
      } else {
        setDestinationLabel(maskEmail(nextEmail));
      }
      if (needsOtp) {
        setStep('otp');
        return;
      }
      onComplete({ mode: nextMode });
    };

    return (
      <View
        ref={ref}
        accessibilityLabel="Email authentication"
        className={cn('flex-1 bg-background', className)}
        {...props}
      >
        {step === 'sign-in' ? (
          <SignInScreen
            className="flex-1"
            onForgotPasswordPress={onForgotPasswordPress}
            onSignUpPress={() => setStep('sign-up')}
            onSubmit={async (values) => {
              const result = await onSignIn(values);
              await finishOrOtp('sign-in', values.email, result, requireOtpAfterSignIn);
            }}
          />
        ) : null}

        {step === 'sign-up' ? (
          <SignUpScreen
            className="flex-1"
            onSignInPress={() => setStep('sign-in')}
            onSubmit={async (values) => {
              const result = await onSignUp(values);
              await finishOrOtp('sign-up', values.email, result, requireOtpAfterSignUp);
            }}
          />
        ) : null}

        {step === 'otp' ? (
          <OtpVerifyScreen
            className="flex-1"
            destinationLabel={destinationLabel}
            onBack={() => setStep(mode === 'sign-up' ? 'sign-up' : 'sign-in')}
            headerTitle="Verify email"
            onSubmit={async (code) => {
              await onVerifyOtp(code, { mode, email });
              onComplete({ mode });
            }}
            onResend={
              onResendOtp
                ? async () => {
                    await onResendOtp({ mode, email });
                  }
                : undefined
            }
          />
        ) : null}
      </View>
    );
  },
);
EmailAuthFlow.displayName = 'EmailAuthFlow';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}
