// UIXVISOR — https://uixvisor.dev/mobile/toast
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { View } from 'react-native';

import { Text } from '@registry/text/text';

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

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-foreground',
  success: 'bg-success',
  destructive: 'bg-destructive',
};

const DEFAULT_DURATION_MS = 3000;

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

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
        <View pointerEvents="none" className="absolute inset-x-0 bottom-10 items-center gap-2 px-6">
          {toasts.map((toast) => (
            <View
              key={toast.id}
              className={cn('w-full max-w-sm rounded-md px-4 py-3', variantStyles[toast.variant])}
            >
              <Text className="text-background">{toast.message}</Text>
            </View>
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
