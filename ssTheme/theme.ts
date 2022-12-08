import {DefaultTheme} from 'styled-components';

export const theme: DefaultTheme = {
  border: {
    widthDivisors: {
      xs: 180,
      sm: 150,
      md: 120,
      lg: 100,
    },
    radiusDivisors: {
      xs: 45,
      sm: 35,
      md: 25,
      lg: 15,
    },
    color: {
      main: 'lightgrey',
      accent: '#b19cd9',
    },
  },
  backgroundColors: {
    main: '#f5f2f3',
    accent: '#b19cd9',
  },
  colors: {
    disabled: '#cccccc',

    blackText: 'black',
    lightText: 'darkgray',

    whiteBg: '#f5f2f3',
    whiteFg: '#fcfcfc',
    grayBorder: 'lightgray',

    pastelPurple: '#b19cd9',
    darkRed: '#900',
  },
  fonts: {
    main: 'sans-serif',
    fallback: 'Roboto',
  },
  fontSizeDivisors: {
    xs: 52,
    sm: 42,
    md: 32,
    lg: 22,
  },
  iconSizeDivisors: {
    xs: 20,
    sm: 17,
    md: 15,
    lg: 12,
  },
  paddingDivisors: {
    xs: 70,
    sm: 35,
    md: 17,
    lg: 10,
  },
};
