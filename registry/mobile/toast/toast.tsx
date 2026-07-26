// UIXVISOR — https://uixvisor.dev/mobile/toast
//
// Default toasts are always a dark snackbar with light type — the same recipe
// Material and iOS use. Tying default to `primary` / `foreground` inverts in
// dark mode (those tokens flip to near-white), which is what made the pill
// look like a blank white flash. Success / destructive keep semantic colours.
//
// No NativeWind className on the bubble itself: css-interop has been observed
// to clobber explicit backgroundColor on the same node.
/** @jsxImportSource react */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@registry/icon/icon';
import { useThemeMode } from '@registry/theme/theme';

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

/** Fixed dark snackbar surface — readable on light and dark app chrome. */
const DEFAULT_BG = '#18181b';
const DEFAULT_FG = '#fafafa';

const SUCCESS_LIGHT = { background: '#16a34a', foreground: '#ffffff' } as const;
const SUCCESS_DARK = { background: '#166534', foreground: '#dcfce7' } as const;
const DESTRUCTIVE = { background: '#dc2626', foreground: '#fafafa' } as const;

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  default: 'info',
  success: 'success',
  destructive: 'error',
};

function toastColors(
  variant: ToastVariant,
  mode: 'light' | 'dark',
): { background: string; foreground: string; borderColor?: string } {
  if (variant === 'success') {
    return mode === 'dark' ? SUCCESS_DARK : SUCCESS_LIGHT;
  }
  if (variant === 'destructive') {
    return DESTRUCTIVE;
  }
  return {
    background: DEFAULT_BG,
    foreground: DEFAULT_FG,
    // Hairline only in dark mode so the pill separates from a near-black page.
    borderColor: mode === 'dark' ? '#3f3f46' : undefined,
  };
}

function ToastBubble({ message, variant }: { message: string; variant: ToastVariant }) {
  const mode = useThemeMode();
  const colors = toastColors(variant, mode);
  const iconName = VARIANT_ICON[variant];

  const containerStyle: ViewStyle = {
    width: '100%',
    maxWidth: 384,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderWidth: colors.borderColor ? 1 : 0,
    borderColor: colors.borderColor ?? 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  };

  const textStyle: TextStyle = {
    flex: 1,
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  };

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      style={containerStyle}
    >
      <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={iconName} size={18} color={colors.foreground} weight="bold" />
      </View>
      <Text style={textStyle}>{message}</Text>
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
      <View style={{ flex: 1 }}>
        {children}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: Math.max(insets.bottom, 12) + 24,
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 24,
          }}
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
