import { useState } from "react";

export const useUpdate = () => {
    const [shouldUpdate, setShouldUpdate] = useState({});

    const forceUpdate = () => setShouldUpdate({});

    const executeThenUpdate = (task: () => void) => {
        task();
        forceUpdate();
    };

    return {
        shouldUpdate,
        forceUpdate,
        executeThenUpdate,
    };
};
