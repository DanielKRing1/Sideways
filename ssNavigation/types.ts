import type {StackScreenProps} from '@react-navigation/stack';
import {
  PROFILE_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
  TAB_NAV_NAME,
} from './constants';

export type RootStackParamList = {
  [TAB_NAV_NAME]: undefined;
  [PROFILE_SCREEN_NAME]: undefined; //{ userId: string };
  [SETTINGS_SCREEN_NAME]: undefined; //{ sort: 'latest' | 'top' } | undefined;
};

export type Props<ScreenName extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, ScreenName>;
