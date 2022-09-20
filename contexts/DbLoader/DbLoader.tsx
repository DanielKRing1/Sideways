import React, { createContext, FC, useEffect, useState } from "react";

import { useDbDriverLoader } from "../../hooks/useDbDriverLoader";
import { LoadingComponent } from "./components/LoadingComponent";

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
    
    const { isLoaded, load } = useDbDriverLoader();

    return (
        <DbLoaderContext.Provider style={{flex: 1}} value={{ isLoaded, load }}>
        {
            !isLoaded ?
                <LoadingComponent/>
                :
                children
        }
        </DbLoaderContext.Provider>
    );
};

export { DbLoaderContext, DbLoaderProvider };