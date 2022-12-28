import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

export const getId = (length: number = 5): string => nanoid(length);

export const getUniqueId = (length: number, existingIds: Set<string>) => {
  let id: string = getId(length);

  while (existingIds.has(id)) id = getId(length);

  return id;
};

export const getStartingId = (
  data: any[],
  idExtractor: (a: any) => number,
): number => {
  return data.reduce(
    (maxId: number, d: any) => Math.max(maxId, idExtractor(d) + 1),
    0,
  );
};
