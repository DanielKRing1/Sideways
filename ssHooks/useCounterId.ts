import {useEffect, useState} from 'react';

export type IdGenerator<T> = {
  popId: () => T;
  peekId: () => T;
  setId: (id: T) => void;
  reset: () => void;
};

export const useCounterId = (
  startingId: number = 0,
): IdGenerator<number> & {undoPop: () => void} => {
  const [curId, setCurId] = useState<number>(startingId);

  const popId = () => {
    const temp = curId;
    setCurId(prevId => {
      console.log('in');
      console.log(prevId);
      return prevId + 1;
    });
    console.log('out');
    console.log(curId);
    console.log(temp);

    console.log('POP COUNTER ID-----------------');
    console.log('popId');
    console.log(curId);

    return temp;
  };

  useEffect(() => {
    console.log('POP COUNTER ID-----------------');
    console.log('useEffect');
    console.log(curId);
  }, [curId]);

  const peekId = () => curId;

  const undoPop = (count: number = 1) => {
    setCurId(curId - count);
  };

  const setId = (value: number) => {
    setCurId(value);
  };

  const reset = () => setId(startingId);

  return {
    popId,
    peekId,
    undoPop,
    setId,
    reset,
  };
};
