import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCartCount, getCurrentUser } from '../services/transflowerApi.js';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [cartCount, setCartCount] = useState(0);

  const refreshUser = useCallback(() => setUser(getCurrentUser()), []);

  const refreshCartCount = useCallback(async () => {
    try {
      setCartCount(await getCartCount());
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    refreshCartCount().catch(() => {});
    const onCart = () => {
      refreshCartCount().catch(() => {});
    };
    const onUserOrRemote = () => {
      refreshUser();
      refreshCartCount().catch(() => {});
    };
    window.addEventListener('storage', onUserOrRemote);
    window.addEventListener('tf_user_changed', onUserOrRemote);
    window.addEventListener('tf_cart_changed', onCart);
    return () => {
      window.removeEventListener('storage', onUserOrRemote);
      window.removeEventListener('tf_user_changed', onUserOrRemote);
      window.removeEventListener('tf_cart_changed', onCart);
    };
  }, [refreshUser, refreshCartCount]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshUser,
      cartCount,
      refreshCartCount
    }),
    [user, refreshUser, cartCount, refreshCartCount]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
