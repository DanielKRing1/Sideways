import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            whiteBg: string;
            whiteFg: string;
            grayBorder: string,

            pastelPurple: string,
        };
        fonts: {
            main: string;
            fallback: string;
        };
        fontSizes: {
            sm: string;
            md: string;
            lg: string;
        };
    };
}
