import type {StackScreenProps} from '@react-navigation/stack';
import {
  PROFILE_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
  TABS_SCREEN_NAME,
} from './constants';

export type RootStackParamList = {
  [TABS_SCREEN_NAME]: undefined;
  [PROFILE_SCREEN_NAME]: undefined; //{ userId: string };
  [SETTINGS_SCREEN_NAME]: undefined; //{ sort: 'latest' | 'top' } | undefined;
};

export type Props<ScreenName extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, ScreenName>;
