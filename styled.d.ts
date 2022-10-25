import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      blackText: string;
      lightText: string;

      whiteBg: string;
      whiteFg: string;
      grayBorder: string;

      pastelPurple: string;
      darkRed: string;
    };
    fonts: {
      main: string;
      fallback: string;
    };
    fontSizes: {
      sm: number;
      md: number;
      lg: number;
    };
    iconSizes: {
      sm: number;
      md: number;
      lg: number;
    };
  }
}
