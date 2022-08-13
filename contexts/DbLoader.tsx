import React, { createContext, FC, useEffect, useState } from "react";
import dbDriver from "../database/dbDriver";

// CONTEXT
type DbLoaderContextValueType = {
    isLoaded: boolean;
    load: () => Promise<void>;
};
const DEFAULT_CONTEXT_VALUE: DbLoaderContextValueType = {
    isLoaded: false,
    load: async () => {},
};
const DbLoaderContext: React.Context<DbLoaderContextValueType> = createContext(DEFAULT_CONTEXT_VALUE);

// PROVIDER
type DbLoaderProviderType = {
    children: React.ReactNode;
};
const DbLoaderProvider: FC<DbLoaderProviderType> = (props) => {
    const { children } = props;
    
    const [ isLoaded, setIsLoaded ] = useState(dbDriver.isLoaded);

    const load = async (): Promise<void> => {
        if(dbDriver.isLoaded) return;
        await dbDriver.load();

        console.log('about to set load');
        setIsLoaded(true);
        console.log('set load');
    };
    useEffect(() => { load(); }, []);

    return (
        <DbLoaderContext.Provider style={{flex: 1}} value={{ isLoaded, load }}>
            {children}
        </DbLoaderContext.Provider>
    );
};

export { DbLoaderContext, DbLoaderProvider };