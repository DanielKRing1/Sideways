import {getEnumValues} from 'ssUtils/enum';

// ICON ENUM
export enum AvailableIcons {
  'circle' = 'circle',
  'glass' = 'glass',
  'music' = 'music',
  'heart' = 'heart',
  'star' = 'star',
  'home' = 'home',
  'book' = 'book',
  'list-alt' = 'list-alt',
  'camera' = 'camera',
  'video-camera' = 'video-camera',
  'pencil' = 'pencil',
  'gift' = 'gift',
  'leaf' = 'leaf',
  'plane' = 'plane',
  'calendar' = 'calendar',
  'comment' = 'comment',
  'shopping-cart' = 'shopping-cart',
  'gears' = 'gears',
  'trophy' = 'trophy',
  'credit-card' = 'credit-card',
  'bell' = 'bell',
  'globe' = 'globe',
  'wrench' = 'wrench',
  'briefcase' = 'briefcase',
  'flask' = 'flask',
  'coffee' = 'coffee',
  'laptop' = 'laptop',
  'mobile' = 'mobile',
  'gamepad' = 'gamepad',
  'keyboard-o' = 'keyboard-o',
  'puzzle-piece' = 'puzzle-piece',
  'microphone' = 'microphone',
  'fire-extinguisher' = 'fire-extinguisher',
  'rocket' = 'rocket',
  'dollar' = 'dollar',
  'sun-o' = 'sun-o',
  'moon-o' = 'moon-o',
  'archive' = 'archive',
  'bank' = 'bank',
  'child' = 'child',
  'paw' = 'paw',
  'spoon' = 'spoon',
  'car' = 'car',
  'tree' = 'tree',
  'wifi' = 'wifi',
  'trash' = 'trash',
  'paint-brush' = 'paint-brush',
  'birthday-cake' = 'birthday-cake',
  'bicycle' = 'bicycle',
  'bed' = 'bed',
  'subway' = 'subway',
  'shower' = 'shower',
  'question' = 'question',
}

export const DECORATION_ROW_DELIM: string = '_';

export const DEFAULT_COLOR: string = '#fff';
export const DEFAULT_ICON: AvailableIcons = AvailableIcons.circle;
export const CONFIRM_SELECTION_ICON: AvailableIcons = AvailableIcons.question;

export const getAvailableIcons = (): AvailableIcons[] =>
  getEnumValues(AvailableIcons);
