import React, {FC} from 'react';
import {ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {AppDispatch, RootState} from 'ssRedux/index';
import {startRate} from 'ssRedux/rateSidewaysSlice';
import RatingInputList from './components/InputList';
import NoInputsDisplay from './components/NoInputsDisplay';
import {FlexCol} from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import RatingInput from '../components/RatingSlider';
import RatingOutputOptions from './components/OutputOptions';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  // NAVIGATION
  const navigator = useNavigation();

  // REDUX
  const {inputs, outputs, rating, ratedSignature} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleRate = async () => {
    dispatch(startRate());
  };

  return (
    <ScrollView>
      {/* INPUTS */}
      {inputs.length > 0 ? <RatingInputList /> : <NoInputsDisplay />}

      {/* OUTPUTS */}
      <RatingOutputOptions />

      {/* RATING */}
      <RatingInput />
      <FlexCol alignItems="center">
        <MyButton
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            width: '80%',
          }}
          onPress={handleRate}>
          <MyText>Rate .u.</MyText>
        </MyButton>
      </FlexCol>
    </ScrollView>
  );
};

export default RateHomeScreen;
