import React, {FC} from 'react';
import {View, useWindowDimensions} from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import Accordion from 'ssComponents/View/Collapsible/Accordion';

import RatingInputSelection from './components/Input/RatingInputSelection';
import RatingOutputOptions from './components/OutputOptions';
import RatingSlider from '../components/RatingSlider';
import RateButton from './components/RateButton';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';
import Header from './components/Header';
import DismissKeyboardView from 'ssComponents/View/DismissKeyboardView';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  // HOOKS
  const {remainingHeight} = useTabBarHeight();

  return (
    <DismissKeyboardView
      style={{
        height: '100%',
      }}>
      <Accordion
        headerProps={[
          {id: 'Inputs', title: 'Inputs'},
          {id: 'Outputs', title: 'Outputs'},
          {id: 'Rating', title: 'Rating'},
        ]}
        Header={({title}: {title: string}) => <Header title={title} />}
        initiallyOpen={0}
        duration={400}>
        {/* INPUTS */}
        <RatingInputSelection />

        {/* OUTPUTS */}
        <RatingOutputOptions />

        {/* RATING */}
        <RatingSlider />
      </Accordion>
    </DismissKeyboardView>
  );
};

export default RateHomeScreen;
