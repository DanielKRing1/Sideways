import {useEffect} from 'react';

import {useTrie} from './useTrie';

export function useAutoComplete<T>(
  searchInput: string,
  allSuggestions: T[],
  getKey: (value: T) => string,
) {
  // LOCAL STATE
  //   const [allSuggestions, setAllSuggestions] = useState<T[]>([]);

  // TRIE
  const {setValues: setTrieValues, search, autoComplete} = useTrie<T>(getKey);

  // EFFECTS
  //   // 1. Set allSuggestions
  //   useEffect(() => {
  //     setAllSuggestions(_allSuggestions);
  //   }, [_allSuggestions]);

  // 2. Set up Trie
  useEffect(() => {
    setTrieValues(searchInput, allSuggestions);
  }, [allSuggestions]);

  // 3. Get autoComplete list, based on searched inputValue
  useEffect(() => {
    search(searchInput);
  }, [searchInput]);

  return {
    autoComplete,
  };
}
