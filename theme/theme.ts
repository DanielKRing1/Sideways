import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
    colors: {
        blackText: 'black',
        lightText: 'darkgray',

        whiteBg: '#f5f2f3',
        whiteFg: '#fcfcfc',
        grayBorder: 'lightgray',

        pastelPurple: '#b19cd9',
        darkRed: '#900',
    },
    fonts: {
        main: "sans-serif",
        fallback: "Roboto",
    },
    fontSizes: {
      sm: 8,
      md: 12,
      lg: 16,
    },
    iconSizes: {
        sm: 20,
        md: 30,
        lg: 45,
    }
};
