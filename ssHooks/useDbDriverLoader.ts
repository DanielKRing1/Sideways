import { useState } from "react";
import dbDriver from "../ssDatabase/api/core/dbDriver";
import decorationsDriver from "../ssDatabase/api/userJson/decoration";

export const useDbDriverLoader = () => {
    const [ isLoaded, setIsLoaded ] = useState<boolean>(dbDriver.isLoaded);

    const load = async (): Promise<void> => {
        const loadPromises: Promise<any>[] = [];
        
        // Core
        if(!dbDriver.isLoaded) loadPromises.push(dbDriver.load());

        // Decorations
        if(!decorationsDriver.isLoaded) loadPromises.push(decorationsDriver.load());

        // Parallel await
        await Promise.all(loadPromises);

        // Is now loaded
        setIsLoaded(true);
    };
    const closeAll = async (): Promise<void> => {
        const closePromises: Promise<any>[] = [];

        // Core
        closePromises.push(dbDriver.closeAll());

        // Decorations
        closePromises.push(decorationsDriver.closeAll());

        // Parallel await
        await Promise.all(closePromises);

        // Is now not loaded
        setIsLoaded(false);
    };
    // Initial load
    load();

    return {
        isLoaded,
        load,
        closeAll,
    }
};
