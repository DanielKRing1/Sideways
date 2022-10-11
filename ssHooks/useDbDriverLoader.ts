import { useState } from "react";
import dbDriver from "../ssDatabase/api/core/dbDriver";
import colorDriver from "../ssDatabase/api/user/color/colorDriver";
import iconDriver from "../ssDatabase/api/user/icon/iconDriver";

export const useDbDriverLoader = () => {
    const [ isLoaded, setIsLoaded ] = useState<boolean>(dbDriver.isLoaded);

    const load = async (): Promise<void> => {
        const loadPromises: Promise<any>[] = [];
        
        // Core
        if(!dbDriver.isLoaded) loadPromises.push(dbDriver.load());

        // Color + Icon
        if(!colorDriver.isLoaded) loadPromises.push(colorDriver.load());
        if(!iconDriver.isLoaded) loadPromises.push(iconDriver.load());

        // Parallel await
        await Promise.all(loadPromises);

        // Is now loaded
        setIsLoaded(true);
    };
    const closeAll = async (): Promise<void> => {
        const closePromises: Promise<any>[] = [];

        // Core
        closePromises.push(dbDriver.closeAll());

        // Color + Icon
        closePromises.push(colorDriver.closeAll());
        closePromises.push(iconDriver.closeAll());

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
