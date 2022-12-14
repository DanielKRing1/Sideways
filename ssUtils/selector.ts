export type SelectPair<K, V> = [K, V];
/**
 * Selects a key-value pair, given a key and a list of key-value pairs
 * Returns the first key-value pair if not found
 *
 * @param key
 * @param kvPairs
 * @returns
 */
export function select<K, V>(key: K, ...kvPairs: SelectPair<K, V>[]): [K, V] {
  const kv = kvPairs.find(([k, v]) => key === k) || kvPairs[0];

  return kv;
}
