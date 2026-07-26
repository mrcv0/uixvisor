// UIXVISOR — https://uixvisor.dev/mobile/toast
//
// Colours go through useThemeColor rather than Tailwind class pairs.
// The previous `bg-foreground` + `text-background` recipe inverted correctly in
// light mode but in dark mode made a near-white pill; Text also injects
// `text-foreground` (also white in dark), so the message disappeared into the
// background. Explicit resolved colours keep contrast stable in both modes.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Text as RNText, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useElevation, useThemeColor, useThemeMode } from '@registry/theme/theme';

type ToastVariant = 'default' | 'success' | 'destructive';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 3000;

interface ToastPalette {
  background: string;
  foreground: string;
  border?: string;
}

function useToastPalette(variant: ToastVariant): ToastPalette {
  const mode = useThemeMode();
  const primary = useThemeColor('primary');
  const onPrimary = useThemeColor('primary-foreground');
  const elevated = useThemeColor('surface-elevated');
  const foreground = useThemeColor('foreground');
  const border = useThemeColor('border');
  const success = useThemeColor('success');
  const destructive = useThemeColor('destructive');
  const onDestructive = useThemeColor('destructive-foreground');

  return useMemo(() => {
    if (variant === 'success') {
      // Dark-mode success is a light green — dark label reads better than white.
      return {
        background: success,
        foreground: mode === 'dark' ? '#052e16' : '#ffffff',
      };
    }
    if (variant === 'destructive') {
      return {
        background: destructive,
        foreground: onDestructive,
      };
    }
    // Default: classic dark snackbar in light mode; raised surface (not pure
    // white) in dark mode so the toast still feels like chrome, not a flash.
    if (mode === 'light') {
      return { background: primary, foreground: onPrimary };
    }
    return {
      background: elevated,
      foreground,
      border,
    };
  }, [
    variant,
    mode,
    primary,
    onPrimary,
    elevated,
    foreground,
    border,
    success,
    destructive,
    onDestructive,
  ]);
}

function ToastBubble({ message, variant }: { message: string; variant: ToastVariant }) {
  const palette = useToastPalette(variant);
  const elevation = useElevation('overlay');

  const containerStyle: ViewStyle = {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderWidth: palette.border ? 1 : 0,
    ...elevation,
  };

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      className="w-full max-w-sm rounded-xl px-4 py-3"
      style={containerStyle}
    >
      <RNText
        className="font-medium text-sm"
        style={{ color: palette.foreground }}
      >
        {message}
      </RNText>
    </View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers.values()) {
        clearTimeout(timer);
      }
      activeTimers.clear();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, variant }]);
    const timer = setTimeout(() => {
      timers.current.delete(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, DEFAULT_DURATION_MS);
    timers.current.set(id, timer);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      <View className="flex-1">
        {children}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 items-center gap-2 px-6"
          style={{ bottom: Math.max(insets.bottom, 12) + 24 }}
        >
          {toasts.map((toast) => (
            <ToastBubble key={toast.id} message={toast.message} variant={toast.variant} />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
