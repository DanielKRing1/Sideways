import React, {FC} from 'react';
import {View} from 'react-native';

import {RATE_INPUT_SCREEN_NAME} from 'ssNavigation/constants';
import {RateNavigatorProps} from 'ssNavigation/RateNavigator';

const RateInputScreen: FC<
  RateNavigatorProps<typeof RATE_INPUT_SCREEN_NAME>
> = props => {
  const {navigation, route} = props;
  const {input} = route.params;

  return <View></View>;
};

export default RateInputScreen;
