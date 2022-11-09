import React, {FC} from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from 'ssRedux/index';

import RatingInputList from './components/InputList';

import Accordion from 'ssComponents/View/Collapsible/Accordion';
import NoInputsDisplay from './components/NoInputsDisplay';
import RatingInput from '../components/RatingSlider';
import RatingOutputOptions from './components/OutputOptions';
import RateButton from './components/RateButton';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  // REDUX
  const {inputs, outputs, rating, ratedSignature} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );

  // HOOKS
  const {width, height} = useWindowDimensions();

  return (
    <View
      style={{
        height,
        maxHeight: (height * 90) / 100,
      }}>
      <Accordion
        headerProps={new Array(3).fill(undefined).map((v, i) => {
          index: i;
        })}
        Header={({index}: {index: number}) => <Text>Header {index}</Text>}
        initiallyOpen={0}
        duration={400}>
        {/* INPUTS */}
        {inputs.length > 0 ? <RatingInputList /> : <NoInputsDisplay />}

        {/* OUTPUTS */}
        <RatingOutputOptions />

        {/* RATING */}
        <RatingInput />
      </Accordion>

      <RateButton />
    </View>
  );
};

export default RateHomeScreen;
