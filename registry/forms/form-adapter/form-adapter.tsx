// UIXVISOR — https://uixvisor.dev/forms/form-adapter
//
// Bridges React Hook Form + Zod to registry FormField / controls.
// Primitives stay library-agnostic: they only receive value, onChange, error.
import {
  type ReactNode,
  type RefCallback,
} from 'react';
import {
  Controller,
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { FormField } from '@registry/form-field/form-field';

export type UseAppFormOptions<TSchema extends z.ZodTypeAny> = Omit<
  UseFormProps<z.infer<TSchema>>,
  'resolver'
> & {
  schema: TSchema;
};

/**
 * Thin `useForm` wrapper that wires `zodResolver` and sensible mobile defaults
 * (`mode: 'onBlur'`). Callers can still use plain `useForm` + `zodResolver`.
 */
export function useAppForm<TSchema extends z.ZodTypeAny>(
  options: UseAppFormOptions<TSchema>,
): UseFormReturn<z.infer<TSchema>> {
  const { schema, mode = 'onBlur', reValidateMode = 'onChange', ...formOptions } = options;

  return useForm<z.infer<TSchema>>({
    ...formOptions,
    mode,
    reValidateMode,
    // zodResolver typing is wider than z.infer; cast keeps screen forms strict.
    resolver: zodResolver(schema as z.ZodType<z.infer<TSchema>, z.ZodTypeDef, z.infer<TSchema>>),
  });
}

/** Render-prop field state for text-like controls (Input, Textarea, OTPInput). */
export interface ControlledFieldRenderProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  ref: RefCallback<unknown>;
  name: string;
}

export interface ControlledFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  hint?: string;
  /** Visual required mark only — schema still owns validation. */
  required?: boolean;
  className?: string;
  children: (field: ControlledFieldRenderProps) => ReactNode;
}

/**
 * FormField + RHF Controller. Error messages render once on FormField;
 * pass `label=""` / no `error` on the inner Input to avoid double chrome.
 */
export function ControlledFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  hint,
  required,
  className,
  children,
}: ControlledFormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          hint={hint}
          required={required}
          error={fieldState.error?.message}
          className={className}
        >
          {children({
            value: typeof field.value === 'string' ? field.value : String(field.value ?? ''),
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            name: field.name,
          })}
        </FormField>
      )}
    />
  );
}

/** Field-level error message helper (when not using ControlledFormField). */
export function fieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>,
): string | undefined {
  const error = form.formState.errors[name];
  if (!error || typeof error !== 'object') return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

/** Form-level / async root error (`form.setError('root', { message })`). */
export function rootError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): string | undefined {
  const error = form.formState.errors.root;
  if (!error || typeof error !== 'object') return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}
