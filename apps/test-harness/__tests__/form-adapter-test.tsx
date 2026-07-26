import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { Ref } from 'react';
import { Button, TextInput, View } from 'react-native';
import { z } from 'zod';

import {
  bindTextInput,
  ControlledFormField,
  createFormSubmitHandler,
  FormRootError,
  useAppForm,
  useFormRootError,
} from '../../../registry/forms/form-adapter/form-adapter';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
});

function AdapterHarness({
  onSubmit,
}: {
  onSubmit: (values: { email: string }) => Promise<void> | void;
}) {
  const form = useAppForm({
    schema,
    defaultValues: { email: '' },
  });
  const root = useFormRootError(form);
  const handleSubmit = createFormSubmitHandler(form, onSubmit, {
    fieldOrder: ['email'],
  });

  return (
    <View>
      <FormRootError message={root} />
      <ControlledFormField control={form.control} name="email" label="Email" required>
        {(field) => {
          const { ref, ...props } = bindTextInput(field);
          return (
            <TextInput
              ref={ref as Ref<TextInput>}
              accessibilityLabel="Email"
              {...props}
            />
          );
        }}
      </ControlledFormField>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

describe('form-adapter', () => {
  test('ControlledFormField shows schema error on submit', async () => {
    const onSubmit = jest.fn();
    const screen = await render(<AdapterHarness onSubmit={onSubmit} />);

    await fireEvent.press(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('createFormSubmitHandler maps thrown errors to FormRootError', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Network down'));
    const screen = await render(<AdapterHarness onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), 'ada@example.com');
    await fireEvent.press(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Network down')).toBeTruthy();
    });
  });

  test('bindTextInput + valid submit delivers trimmed values', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<AdapterHarness onSubmit={onSubmit} />);

    await fireEvent.changeText(screen.getByLabelText('Email'), '  ada@example.com ');
    await fireEvent.press(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com' });
    });
  });
});
