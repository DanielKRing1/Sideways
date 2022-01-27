import { useState } from 'react';

type Dict<T> = Record<string, T>;

export function useList<T>(startingList: T[] = []) {
    const [list, setList] = useState<T[]>(startingList);

    const push = (value: T) => {
        setList((prevState) => {
            const nextState: T[] = [...prevState];
            nextState.push(value);

            return nextState;
        });
    };
    const pop = () => {
        setList((prevState) => {
            const nextState: T[] = [...prevState];
            nextState.pop();

            return nextState;
        });
    };

    const replace = (index: number, value: T) => {
        setList((prevState) => {
            const nextState: T[] = [...prevState];
            nextState[index] = value;

            return nextState;
        });
    };
    const insert = (index: number, value: T) => {
        setList((prevState) => {
            const nextState: T[] = [...prevState];
            nextState.splice(index, 0, value);

            return nextState;
        });
    };
    const rm = (index: number) => {
        setList((prevState) => {
            const nextState: T[] = [...prevState];
            nextState.splice(index, 1);

            return nextState;
        });
    };

    const clear = () => {
        setList([]);
    };

    const reset = () => {
        setList([...startingList]);
    };

    return {
        list,
        setList,
        clear,
        reset,
        push,
        pop,
        replace,
        insert,
        rm,
    };
}
