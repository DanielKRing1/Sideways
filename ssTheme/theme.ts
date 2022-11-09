import {DefaultTheme} from 'styled-components';

export const theme: DefaultTheme = {
  border: {
    widthDivisors: {
      sm: 150,
      md: 120,
      lg: 100,
    },
    radiusDivisors: {
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
    sm: 45,
    md: 35,
    lg: 25,
  },
  iconSizeDivisors: {
    sm: 17,
    md: 15,
    lg: 12,
  },
  paddingDivisors: {
    sm: 35,
    md: 17,
    lg: 10,
  },
};
