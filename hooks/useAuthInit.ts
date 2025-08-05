import { useEffect } from 'react';

export const useAuthInit = (callback: () => Promise<void>) => {
  useEffect(() => {
    callback().catch((err) => {
      console.error('Auth initialization error:', err);
    });
  }, []);
};
