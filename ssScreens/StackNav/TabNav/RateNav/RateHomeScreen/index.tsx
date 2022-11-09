import React, {FC} from 'react';
import {Text, View, useWindowDimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {AppDispatch, RootState} from 'ssRedux/index';
import {startRate} from 'ssRedux/rateSidewaysSlice';

import RatingInputList from './components/InputList';
import {FlexCol} from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';

import NoInputsDisplay from './components/NoInputsDisplay';
import Accordion from 'ssComponents/View/Collapsible/Accordion';
import RatingInput from '../components/RatingSlider';
import RatingOutputOptions from './components/OutputOptions';
import {DefaultTheme, useTheme} from 'styled-components/native';
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
