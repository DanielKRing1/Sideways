import {useEffect, useState} from 'react';

export const useTimeout = () => {
  const [to, setTO] = useState<number>();

  // CLEAN UP
  useEffect(() => {
    // Clean up
    return () => clearTO();
  }, []);

  const createTO = (cb: () => void, timeout: number) => {
    // 1. Clear old timeout
    clearTO();

    // 2. Schedule and store new timeout
    const id: number = setTimeout(cb, timeout);
    setTO(id);
  };

  const clearTO = () => {
    if (to !== undefined) clearTimeout(to);
  };

  return {
    createTO,
    clearTO,
  };
};
