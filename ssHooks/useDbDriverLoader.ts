import { useState } from "react";
import dbDriver from "../ssDatabase/api/dbDriver";

export const useDbDriverLoader = () => {
    const [ isLoaded, setIsLoaded ] = useState<boolean>(dbDriver.isLoaded);

    const load = async (): Promise<void> => {
        if(dbDriver.isLoaded) return;
        await dbDriver.load();

        setIsLoaded(true);
    };
    if(!dbDriver.isLoaded) load();

    return {
        isLoaded,
        load,
    }
};
