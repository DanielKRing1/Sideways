import { useState } from 'react';
import { TrieTree } from '../utils';

export const useTrieTree = (words: string[] = []) => {
    const [trieTree, setTrieTree] = useState(new TrieTree(words));

    const add = (words: string[]) => {
        words.forEach((word) => trieTree.add(word));
    };

    const reset = (words: string[] = []) => {
        setTrieTree(new TrieTree(words));
    };

    return {
        trieTree,
        add,
        reset,
    };
};
