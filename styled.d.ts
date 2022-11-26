import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    border: {
      widthDivisors: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
      };
      radiusDivisors: {
        xs: number;
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
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
    iconSizeDivisors: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
    paddingDivisors: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
  }
}
