// UIXVISOR — https://uixvisor.dev/mobile/search-bar
import { forwardRef, type ComponentRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { IconButton } from '@registry/icon-button/icon-button';
import { Text } from '@registry/text/text';

export interface SearchBarProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  className?: string;
}

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export const SearchBar = forwardRef<ComponentRef<typeof TextInput>, SearchBarProps>(
  ({ value, onChangeText, className, placeholder = 'Search', ...props }, ref) => {
    return (
      <View
        className={cn(
          'h-11 flex-row items-center gap-2 rounded-full border border-input bg-background px-4',
          className,
        )}
      >
        <Text variant="muted">⌕</Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          returnKeyType="search"
          accessibilityRole="search"
          className="flex-1 text-base text-foreground"
          {...props}
        />
        {value.length > 0 ? (
          <IconButton
            variant="ghost"
            accessibilityLabel="Clear search"
            icon={
              <Text variant="muted" size="sm">
                ×
              </Text>
            }
            onPress={() => onChangeText('')}
          />
        ) : null}
      </View>
    );
  },
);

SearchBar.displayName = 'SearchBar';
