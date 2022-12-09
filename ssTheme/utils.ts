import {DefaultTheme} from 'styled-components/native';

import {DisplaySizeOptions, DISPLAY_SIZE} from '../global';

const getDisplaySizeStyle = (
  size: DISPLAY_SIZE,
  maxValue: number,
  divisorOptions: DisplaySizeOptions,
) => {
  let fontSizeDivisor: number;

  switch (size) {
    case DISPLAY_SIZE.xs:
      fontSizeDivisor = divisorOptions.xs;
      break;
    case DISPLAY_SIZE.sm:
      fontSizeDivisor = divisorOptions.sm;
      break;
    case DISPLAY_SIZE.md:
      fontSizeDivisor = divisorOptions.md;
      break;
    default:
    case DISPLAY_SIZE.lg:
      fontSizeDivisor = divisorOptions.lg;
      break;
  }

  return maxValue / fontSizeDivisor;
};

export const getFontSize = (
  size: DISPLAY_SIZE,
  screenWidth: number,
  theme: DefaultTheme,
) => getDisplaySizeStyle(size, screenWidth, theme.fontSizeDivisors);

export const getPadding = (
  size: DISPLAY_SIZE,
  screenWidth: number,
  theme: DefaultTheme,
) => getDisplaySizeStyle(size, screenWidth, theme.paddingDivisors);

export const getIconSize = (
  size: DISPLAY_SIZE,
  screenWidth: number,
  theme: DefaultTheme,
) => getDisplaySizeStyle(size, 1.2 * screenWidth, theme.iconSizeDivisors);
