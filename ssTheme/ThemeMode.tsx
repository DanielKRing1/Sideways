import React, { FC, createContext, useState } from "react";
import { DefaultTheme } from "styled-components";

// CONSTANTS
export const LIGHT = 'light';
export const DARK = 'dark';

// CONTEXT TYPES/VALUES
type ThemeMode = (typeof LIGHT) | (typeof DARK);
type ThemeModeContextValueType = {
    mode: ThemeMode;
    setMode: (newMode: ThemeMode) => void;
};
const DEFAULT_CONTEXT_VALUE: ThemeModeContextValueType = {
    mode: 'light',
    setMode: (newMode: ThemeMode) => {},
};

// CONTEXT
const ThemeModeContext: React.Context<ThemeModeContextValueType> = createContext(DEFAULT_CONTEXT_VALUE);

// PROVIDER
type ThemeModeProviderType = {
    children: React.ReactNode;
};
const ThemeModeProvider: FC<ThemeModeProviderType> = (props) => {
    const { children } = props;

    const [ mode, setMode ] = useState<ThemeMode>(LIGHT);
    
    return (
        <ThemeModeContext.Provider value={{ mode, setMode }}>
            { children }
        </ThemeModeContext.Provider>
    );
};

export type ModeThemes = Record<ThemeMode, DefaultTheme>;
const getModeTheme = (possibleThemes: ModeThemes, mode: ThemeMode): DefaultTheme => possibleThemes[mode];

export { ThemeModeContext, ThemeModeProvider, getModeTheme };
