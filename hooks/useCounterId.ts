import { useState } from "react";

export const useCounterId = (startingId: number = 0) => {
    const [ curId, setCurId ] = useState<number>(startingId);

    const popId = () => {
        const temp = curId;
        setCurId(curId+1);

        return temp;
    }

    const peekId = () => curId;

    const undoPop = () => {
        setCurId(curId-1);
    }

    const reset = () => setCurId(startingId);

    return {
        popId,
        peekId,
        undoPop,
        reset,
    }
};
