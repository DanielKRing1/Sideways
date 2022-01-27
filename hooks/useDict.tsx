import { useState } from 'react';

type Dict<T> = Record<string, T>;

export const useDict = (startingDict: Dict<any> = {}) => {
    const [dict, setDict] = useState<Dict<any>>(startingDict);

    const add = (key: string, value: any) => {
        setDict((prevState) => {
            const nextState: Dict<any> = { ...prevState };
            nextState[key] = value;

            return nextState;
        });
    };
    const rm = (key: string) => {
        setDict((prevState) => {
            const nextState: Dict<any> = { ...prevState };
            delete nextState[key];

            return nextState;
        });
    };
    const replace = (key: string, value: any) => {
        setDict((prevState) => {
            const nextState: Dict<any> = { ...prevState };
            nextState[key] = { ...value };

            return nextState;
        });
    };

    const reset = () => {
        setDict({ ...startingDict });
    };

    const clear = () => {
        setDict({});
    };

    return {
        dict,
        add,
        rm,
        reset,
        clear,
    };
};
