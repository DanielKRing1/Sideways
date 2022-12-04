import {useState, useEffect} from 'react';
import createTrie, {TrieTree} from '@asianpersonn/trie';

export function useTrie<T>(getKey: (value: T) => string) {
  const [trie] = useState<TrieTree<T>>(createTrie());
  const [autoComplete, setAutoComplete] = useState<T[]>([]);

  /**
   * Set Trie values and update autocomplete values
   *
   * @param targetStr
   * @param values
   */
  const setValues = (targetStr: string, values: T[]): void => {
    // 1. Convert input values into Trie format
    const trieValues: {key: string; value: T}[] = values.map((value: T) => ({
      key: getKey(value),
      value,
    }));

    // 2. Clear and refill Trie
    trie.clear();
    trie.addAll(trieValues);

    // 3. Redo search
    search(targetStr);
  };

  /**
   * Search Trie for autocomplete values
   *
   * @param targetStr
   * @param values
   */
  const search = (targetStr: string): void => {
    // Show all if no search input
    // Else show autocomplete list based on search input
    setAutoComplete(trie.search(targetStr));
  };

  return {
    setValues,
    search,
    autoComplete,
  };
}
