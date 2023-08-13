import {useEffect} from 'react';

export const useHydrateApp = () => {
  useEffect(() => {
    console.log('Hydrating app');
  }, []);
};
