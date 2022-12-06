import React, {FC} from 'react';
import {useDispatch} from 'react-redux';

import {FlexRow} from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {setSelectedView} from 'ssRedux/analyticsSlice';
import {AppDispatch} from 'ssRedux/index';
import {IdentityViewName, RecoViewName, TimeseriesViewName} from '../constants';

type ViewSelectorProps = {};
const ViewSelector: FC<ViewSelectorProps> = props => {
  // REDUX
  const dispatch: AppDispatch = useDispatch();

  return (
    <FlexRow>
      <MyButton onPress={() => dispatch(setSelectedView(IdentityViewName))}>
        <MyText>Identity</MyText>
      </MyButton>
      <MyButton onPress={() => dispatch(setSelectedView(RecoViewName))}>
        <MyText>Recommendations</MyText>
      </MyButton>
      <MyButton onPress={() => dispatch(setSelectedView(TimeseriesViewName))}>
        <MyText>Timeseries</MyText>
      </MyButton>
    </FlexRow>
  );
};

export default ViewSelector;
