import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@registry/button/button';
import {
  bindTextInput,
  ControlledFormField,
  createFormSubmitHandler,
  FormRootError,
  useAppForm,
  useFormRootError,
} from '@registry/form-adapter/form-adapter';
import {
  emailSchema,
  otpCodeSchema,
  passwordSchema,
  signInSchema,
} from '@registry/auth-schemas/auth-schemas';
import { Input } from '@registry/input/input';
import { Text } from '@registry/text/text';
import { z } from 'zod';

import { DocIntro, DocSection } from '../shell/DocSection';

const liveDemoSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export function FormAdapterDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useAppForm({
    schema: liveDemoSchema,
    defaultValues: { email: '', password: '' },
  });
  const formRootError = useFormRootError(form);

  const handleSubmit = createFormSubmitHandler(
    form,
    async (values) => {
      setSubmitted(`${values.email} · password length ${values.password.length}`);
    },
    {
      onPendingChange: setPending,
      fieldOrder: ['email', 'password'],
    },
  );

  const simulateServerError = createFormSubmitHandler(
    form,
    async () => {
      throw new Error('Invalid credentials (demo)');
    },
    {
      onPendingChange: setPending,
      fieldOrder: ['email', 'password'],
    },
  );

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Form adapter"
        description="React Hook Form + Zod bridge for registry controls. Use ControlledFormField, bindTextInput, createFormSubmitHandler, and useFormRootError. Primitives stay library-agnostic."
      />

      <DocSection
        title="Live validation"
        description="Submit empty or invalid values for field errors. Valid submit shows parsed values. Second button demos root/async errors."
      >
        <FormRootError message={formRootError} />
        <ControlledFormField control={form.control} name="email" label="Email" required>
          {(field) => {
            const { ref: inputRef, ...inputProps } = bindTextInput(field);
            return (
              <Input
                ref={inputRef}
                label=""
                {...inputProps}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email"
                placeholder="you@example.com"
              />
            );
          }}
        </ControlledFormField>
        <ControlledFormField
          control={form.control}
          name="password"
          label="Password"
          hint="Minimum 8 characters"
          required
        >
          {(field) => {
            const { ref: inputRef, ...inputProps } = bindTextInput(field);
            return (
              <Input
                ref={inputRef}
                label=""
                {...inputProps}
                secureTextEntry
                accessibilityLabel="Password"
                placeholder="••••••••"
              />
            );
          }}
        </ControlledFormField>
        <Button loading={pending} onPress={handleSubmit}>
          Validate &amp; submit
        </Button>
        <Button loading={pending} variant="secondary" onPress={simulateServerError}>
          Simulate server error
        </Button>
        {submitted ? (
          <Text size="sm" variant="muted">
            Parsed: {submitted}
          </Text>
        ) : null}
      </DocSection>
    </View>
  );
}

export function AuthSchemasDemo() {
  const samples: { label: string; ok: boolean; detail: string }[] = [
    {
      label: 'emailSchema',
      ok: emailSchema.safeParse('ada@example.com').success,
      detail: 'ada@example.com → valid',
    },
    {
      label: 'emailSchema (bad)',
      ok: emailSchema.safeParse('not-an-email').success,
      detail: 'not-an-email → invalid',
    },
    {
      label: 'passwordSchema',
      ok: passwordSchema.safeParse('secret12').success,
      detail: '8+ chars → valid',
    },
    {
      label: 'passwordSchema (short)',
      ok: passwordSchema.safeParse('short').success,
      detail: 'short → invalid',
    },
    {
      label: 'otpCodeSchema',
      ok: otpCodeSchema.safeParse('123456').success,
      detail: '123456 → valid',
    },
    {
      label: 'signInSchema',
      ok: signInSchema.safeParse({ email: 'a@b.co', password: 'x' }).success,
      detail: 'email + non-empty password → valid',
    },
  ];

  return (
    <View className="w-full gap-6">
      <DocIntro
        title="Auth schemas"
        description="Shared Zod field and screen schemas. Screens compose these; UI never validates with ad-hoc if/else."
      />

      <DocSection title="Parse samples" description="safeParse results for the shared building blocks.">
        <View className="gap-2">
          {samples.map((sample) => (
            <View
              key={sample.label + sample.detail}
              className="flex-row items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <View className="min-w-0 flex-1 gap-0.5">
                <Text size="sm" weight="medium">
                  {sample.label}
                </Text>
                <Text size="xs" variant="muted">
                  {sample.detail}
                </Text>
              </View>
              <Text size="xs" weight="medium" variant={sample.ok ? 'default' : 'destructive'}>
                {sample.ok ? 'pass' : 'fail'}
              </Text>
            </View>
          ))}
        </View>
      </DocSection>
    </View>
  );
}
