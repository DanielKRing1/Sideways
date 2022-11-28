import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

export const getId = (length: number = 5): string => nanoid(length);

export const getUniqueId = (length: number, existingIds: Set<string>) => {
  let id: string = getId(length);

  while (existingIds.has(id)) id = getId(length);

  return id;
};
