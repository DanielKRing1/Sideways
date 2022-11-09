import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    border: {
      widthDivisors: {
        sm: number;
        md: number;
        lg: number;
      };
      radiusDivisors: {
        sm: number;
        md: number;
        lg: number;
      };
      color: {
        main: string;
        accent: string;
      };
    };
    backgroundColors: {
      main: string;
      accent: string;
    };
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
    fontSizeDivisors: {
      sm: number;
      md: number;
      lg: number;
    };
    iconSizeDivisors: {
      sm: number;
      md: number;
      lg: number;
    };
    paddingDivisors: {
      sm: number;
      md: number;
      lg: number;
    };
  }
}
