const ROOT_KEY: string = '';

type TrieTreeChildren<T> = {
    [key: string]: TrieTree<T>;
};
type TrieTree<T> = {
    key: string;
    values: T[];
    children: TrieTreeChildren<T>;
};

type TrieWrapper<T> = {
    add: (key: string, value: T) => number;
    addAll: (all: { key: string, value: T }[]) => void;
    search: (key: string) => T[];
    searchExact: (key: string) => T[];
    clear: () => void;
}

function _createEmptyTrieTree<T>(key: string): TrieTree<T> {
    return {
        key,
        values: [],
        children: {},
    }
};

function createTrie<T>(key: string = ROOT_KEY): TrieWrapper<T> {
    let root: TrieTree<T> = _createEmptyTrieTree(key);

// PRIVATE API

    const _hasChild = (tree: TrieTree<T>, key: string): boolean => {
        return !!tree.children[key];
    };
    const _addMissingChild = (tree: TrieTree<T>, key: string): void => {
        if(!_hasChild(tree, key)) tree.children[key] = _createEmptyTrieTree(key);
    };
    const _addValue = (tree: TrieTree<T>, value: T): number => {
        return tree.values.push(value);
    };

    const _dig = (key: string) => {
        const keys: string[] = key.split('');
        return _digDeeper(root, keys);
    };
    const _digDeeper = (tree: TrieTree<T>, keys: string[], pointer: number = 0): TrieTree<T> => {
        // 0. Return current tree
        if(pointer >= keys.length) return tree;

        const nextKey: string = keys[pointer];

        // 1. Create empty child tree, if necessary
        _addMissingChild(tree, nextKey);

        // 2. Dig deeper
        const deeperTree: TrieTree<T> = tree.children[nextKey];
        return _digDeeper(deeperTree, keys, ++pointer);
    };
    const _getAllChildTrees = (root: TrieTree<T>) {
        let allChildTrees: TrieTree<T>[] = [ root ];

        let pointer = 0;
        while(pointer < allChildTrees.length) {
            const node: TrieTree<T> = allChildTrees[pointer];

            const childTrees: TrieTree<T>[] = Object.values(node.children);
            if(childTrees.length > 0) allChildTrees = allChildTrees.concat(childTrees);

            pointer++;
        }

        return allChildTrees;
    }

// PUBLIC API

    const add = (key: string, value: T): number => {
        const destinationTree: TrieTree<T> = _dig(key);
        return _addValue(destinationTree, value);
    };
    const addAll = (all: { key: string, value: T }[]) => {
        for(let i = 0; i < all.length; i++) {
            const { key, value } = all[i];
            add(key, value);
        }
    };
    const search = (key: string) => {
        const values: T[] = [];

        const destinationTree: TrieTree<T> = _dig(key);
        const allChildTrees: TrieTree<T>[] = _getAllChildTrees(destinationTree);

        for(let curTree of allChildTrees) values.push(...curTree.values);

        return values;      
    };
    const searchExact = (key: string) => {
        const destinationTree: TrieTree<T> = _dig(key);
        return destinationTree.values;
    };
    const clear = () => {
        root = _createEmptyTrieTree(ROOT_KEY);
    };

    return {
        add,
        addAll,
        search,
        searchExact,
        clear,
    };
};
