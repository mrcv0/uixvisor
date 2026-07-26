// UIXVISOR — https://uixvisor.dev/forms/form-adapter
//
// Bridges React Hook Form + Zod to registry FormField / controls.
// Primitives stay library-agnostic: they only receive value, onChange, error.
//
// Composition rules:
// 1. Prefer ControlledFormField for labeled fields (label/error on FormField once).
// 2. Inner Input/Textarea: label="" and no error prop — avoid double chrome.
// 3. Use bindTextInput(field) so ref/onBlur/onChangeText stay wired for setFocus.
// 4. Prefer useFormRootError(form) over rootError(form) so formState stays subscribed.
// 5. Use ControlledField when the control owns its own label (e.g. OTPInput).
import {
  type ReactNode,
  type RefCallback,
} from 'react';
import {
  Controller,
  useForm,
  useFormState,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type Path,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { FormField } from '@registry/form-field/form-field';
import { Text as UText } from '@registry/text/text';

export type UseAppFormOptions<TSchema extends z.ZodTypeAny> = Omit<
  UseFormProps<z.infer<TSchema>>,
  'resolver'
> & {
  schema: TSchema;
};

/**
 * Thin `useForm` wrapper that wires `zodResolver` and sensible mobile defaults
 * (`mode: 'onBlur'`, reValidate on change after first validation).
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
  /** Present when using ControlledField (not FormField wrapper). */
  error?: string;
}

/** Props spread onto Input / Textarea / OTPInput for RHF binding. */
export interface TextInputBindProps {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  ref: RefCallback<unknown>;
}

/**
 * Spreads RHF field state onto a text control. Always use this (or equivalent)
 * so `ref` is registered and `form.setFocus(name)` works after failed submit.
 */
export function bindTextInput(field: ControlledFieldRenderProps): TextInputBindProps {
  return {
    value: field.value,
    onChangeText: field.onChange,
    onBlur: field.onBlur,
    ref: field.ref,
  };
}

function toStringValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

export interface ControlledFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  children: (field: ControlledFieldRenderProps) => ReactNode;
}

/**
 * Low-level Controller bridge. Use when the control owns its own label/error
 * chrome (OTPInput, standalone Input). Prefer ControlledFormField otherwise.
 */
export function ControlledField<TFieldValues extends FieldValues>({
  control,
  name,
  children,
}: ControlledFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          {children({
            value: toStringValue(field.value),
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            name: field.name,
            error: fieldState.error?.message,
          })}
        </>
      )}
    />
  );
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
            value: toStringValue(field.value),
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
            name: field.name,
            error: fieldState.error?.message,
          })}
        </FormField>
      )}
    />
  );
}

/**
 * Subscribes to formState so root / async errors re-render reliably.
 * Prefer this over {@link rootError} inside React components.
 */
export function useFormRootError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): string | undefined {
  const { errors } = useFormState({ control: form.control });
  const message = errors.root?.message;
  return typeof message === 'string' ? message : undefined;
}

/**
 * Subscribes to a single field error. Prefer ControlledFormField when possible.
 */
export function useFieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: FieldPath<TFieldValues>,
): string | undefined {
  const { errors } = useFormState({ control: form.control, name });
  const error = errors[name];
  if (!error || typeof error !== 'object') return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

/**
 * Non-hook snapshot (e.g. event handlers). Inside render, use {@link useFormRootError}.
 */
export function rootError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): string | undefined {
  const error = form.formState.errors.root;
  if (!error || typeof error !== 'object') return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

/** Non-hook field error snapshot. Inside render, use {@link useFieldError}. */
export function fieldError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  name: Path<TFieldValues>,
): string | undefined {
  const error = form.formState.errors[name];
  if (!error || typeof error !== 'object') return undefined;
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

/** Inline banner for `form.setError('root', { message })` / network failures. */
export function FormRootError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <UText
      variant="destructive"
      size="sm"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      {message}
    </UText>
  );
}

/**
 * Focus the first invalid field in visual order. Call from handleSubmit's
 * onInvalid callback after field refs are registered via bindTextInput.
 */
export function focusFirstError<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  fieldOrder: FieldPath<TFieldValues>[],
  errors: FieldErrors<TFieldValues> = form.formState.errors,
): void {
  const first = fieldOrder.find((name) => Boolean(errors[name]));
  if (first) {
    form.setFocus(first);
  }
}

export type FormSubmitOptions<TFieldValues extends FieldValues> = {
  /** Called with true while the async submit body runs. */
  onPendingChange?: (pending: boolean) => void;
  /**
   * Visual field order for setFocus after validation fails.
   * Omit to skip auto-focus.
   */
  fieldOrder?: FieldPath<TFieldValues>[];
};

/**
 * handleSubmit + root error mapping + optional pending flag + focus-first-error.
 * Keeps screen components free of repeated try/catch boilerplate.
 */
export function createFormSubmitHandler<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  onSubmit: (values: TFieldValues) => Promise<void> | void,
  options: FormSubmitOptions<TFieldValues> = {},
): () => void {
  const { onPendingChange, fieldOrder } = options;

  return form.handleSubmit(
    async (values) => {
      try {
        onPendingChange?.(true);
        form.clearErrors('root');
        await onSubmit(values);
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Something went wrong. Please try again.';
        form.setError('root', { message });
      } finally {
        onPendingChange?.(false);
      }
    },
    (errors) => {
      if (fieldOrder?.length) {
        focusFirstError(form, fieldOrder, errors);
      }
    },
  );
}
