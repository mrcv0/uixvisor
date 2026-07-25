// UIXVISOR — https://uixvisor.dev/mobile/search-bar
import { forwardRef, type ComponentRef } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Icon } from '@registry/icon/icon';
import { useThemeColor } from '@registry/theme/theme';

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
    const mutedColor = useThemeColor('muted-foreground');

    return (
      <View
        className={cn(
          'h-12 flex-row items-center gap-2 rounded-md border border-input bg-background px-4',
          className,
        )}
      >
        <Icon name="search" size={18} color={mutedColor} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          returnKeyType="search"
          accessibilityRole="search"
          className="h-full flex-1 font-sans text-base text-foreground"
          {...props}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            // Kept flush with the field rather than using IconButton, whose 48px
            // target would force the bar taller than a single control.
            hitSlop={8}
          >
            <Icon name="close" size={18} color={mutedColor} />
          </Pressable>
        ) : null}
      </View>
    );
  },
);

SearchBar.displayName = 'SearchBar';
