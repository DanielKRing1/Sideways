import {HexColor} from '../global';

const letters = '0123456789ABCDEF';
export function genRandomColor() {
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Hashes a given string to a hex color, not including '#000000'
 * Instead, '#000000' is replaced with '#ffffff'
 *
 * @param str
 * @returns
 */
export const hashToColor = function (str: string = ''): HexColor {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color: HexColor = '#';
  for (var i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color === '#000000' ? '#ffffff' : color;
};
