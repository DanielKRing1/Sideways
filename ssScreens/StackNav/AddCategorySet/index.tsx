import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AddCategorySetNavHeader} from 'ssComponents/Navigation/NavHeader';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import VerticalSpace from 'ssComponents/Spacing/VerticalSpace';
import {startCreateCS} from 'ssRedux/createCategorySetSlice';
import {AppDispatch} from 'ssRedux/index';

// NAVIGATION
import {
  ADD_CATEGORY_SET_SCREEN_NAME,
  ADD_SLICE_SCREEN_NAME,
} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';
import GrowingCategorySet from './components/GrowingCategorySet';

const AddCategorySetScreen: FC<
  StackNavigatorProps<typeof ADD_CATEGORY_SET_SCREEN_NAME>
> = props => {
  const {navigation, route} = props;

  const dispatch: AppDispatch = useDispatch();

  const handleCreateCS = () => {
    // 1. Dispatch to Redux and reset setPossibleOutputs
    dispatch(startCreateCS());

    // 2. Nav to Rate Screen
    navigation.navigate(ADD_SLICE_SCREEN_NAME, {inputSliceName: ''});
  };

  return (
    <>
      <AddCategorySetNavHeader />

      <VerticalSpace />

      <MyText>Add possible categories...</MyText>

      <GrowingCategorySet />

      <VerticalSpace />

      <MyButton onPress={handleCreateCS}>
        <MyText>Create new category set!</MyText>
      </MyButton>
    </>
  );
};

export default AddCategorySetScreen;
