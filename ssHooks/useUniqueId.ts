import {useEffect, useState} from 'react';

import {getUniqueId} from 'ssUtils/id';
import {IdGenerator} from './useCounterId';

export const useUniqueId = (
  idLen: number,
  _existingIds: string[] = [],
): IdGenerator<string> => {
  const [existingIds, setExistingIds] = useState<Set<string>>(
    new Set(_existingIds),
  );
  const [curId, setCurId] = useState<string>(getUniqueId(idLen, existingIds));

  const popId = () => {
    const temp = curId;
    existingIds.add(temp);
    setCurId(prevId => {
      return getUniqueId(idLen, existingIds);
    });

    return temp;
  };

  useEffect(() => {
    console.log('POP UNIQUE ID-----------------');
    console.log('useEffect');
    console.log(curId);
  }, [curId]);

  const peekId = () => curId;

  const setId = (value: string) => {
    setCurId(value);
  };

  const reset = () => setExistingIds(new Set(_existingIds));

  return {
    popId,
    peekId,
    setId,
    reset,
  };
};
