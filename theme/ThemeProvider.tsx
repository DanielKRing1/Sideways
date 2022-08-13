import React, { FC, useContext } from 'react';
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { theme } from './theme';

import { ThemeModeContext, ThemeModeProvider, LIGHT, DARK, ModeThemes, getModeTheme } from './ThemeMode';

const POSSIBLE_THEMES: ModeThemes = {
    [LIGHT]: theme,
    [DARK]: theme,
};

type MyThemeProviderProps = {
    children: React.ReactNode;
};
const MyThemeProvider: FC<MyThemeProviderProps> = (props) => {
    const { children } = props;

    const { mode } = useContext(ThemeModeContext);

    return (
        <ThemeModeProvider>
            <SCThemeProvider theme={getModeTheme(POSSIBLE_THEMES, mode)}>{children}</SCThemeProvider>
        </ThemeModeProvider>
    );
}
export default MyThemeProvider;
