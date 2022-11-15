import React, {FC} from 'react';
import {View, useWindowDimensions} from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import Accordion from 'ssComponents/View/Collapsible/Accordion';

import RatingInputSelection from './components/Input/RatingInputSelection';
import RatingOutputOptions from './components/OutputOptions';
import RatingSlider from '../components/RatingSlider';
import RateButton from './components/RateButton';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  // HOOKS
  const {height: screenHeight} = useWindowDimensions();
  const {barHeight} = useTabBarHeight();

  return (
    <View
      style={{
        height: screenHeight,
        maxHeight: ((screenHeight - barHeight) * 90) / 100,
      }}>
      <Accordion
        headerProps={[{title: 'Inputs'}, {title: 'Outputs'}, {title: 'Rating'}]}
        Header={({title}: {title: string}) => <MyText>{title}</MyText>}
        initiallyOpen={0}
        duration={400}>
        {/* INPUTS */}
        <RatingInputSelection />

        {/* OUTPUTS */}
        <RatingOutputOptions />

        {/* RATING */}
        <RatingSlider />
      </Accordion>

      <RateButton />
    </View>
  );
};

export default RateHomeScreen;
