import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';

import type { CatalogCategory } from './catalog';

export type Route =
  | { name: 'home' }
  | { name: 'category'; category: CatalogCategory }
  | { name: 'demo'; category: CatalogCategory; itemId: string };

export function useShowcaseNavigation() {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);

  const push = useCallback((route: Route) => {
    setStack((prev) => [...prev, route]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const resetHome = useCallback(() => {
    setStack([{ name: 'home' }]);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, pop]);

  return useMemo(() => {
    const current = stack[stack.length - 1] ?? ({ name: 'home' } as const);
    return {
      current,
      canGoBack: stack.length > 1,
      push,
      pop,
      resetHome,
      stack,
    };
  }, [stack, push, pop, resetHome]);
}

export type ShowcaseNavigation = ReturnType<typeof useShowcaseNavigation>;
