import { useEffect } from 'react';
import { genUID } from '../utils/uid';
import { useList } from './useList';

export const useUID = (idCount: number = 1, uidLength: number = 5) => {
    const { list, push } = useList<string>();

    // Init all uid's
    useEffect(() => {
        // Add n uid's
        for (let i = 0; i < idCount; i++) {
            addUID();
        }
    }, []);

    // Add 1 uid
    const addUID = () => {
        push(genUID(uidLength));
    };

    return {
        list,
        addUID,
    };
};
