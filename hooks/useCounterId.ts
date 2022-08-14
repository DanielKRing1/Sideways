import { useState } from "react";

export const useCounterId = (startingId: number = 0) => {
    const [ curId, setCurId ] = useState<number>(startingId);

    const popId = () => {
        const temp = curId;
        setCurId(curId+1);

        return temp;
    }

    const peekId = () => curId;

    const undoPop = (count: number = 1) => {
        setCurId(curId-count);
    }

    const setId = (value: number) => {
        setCurId(value);
    }

    const reset = () => setId(startingId);

    return {
        popId,
        peekId,
        undoPop,
        setId,
        reset,
    }
};
