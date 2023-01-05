import React, {FC} from 'react';
import {View} from 'react-native';
import {AddCategorySetNavHeader} from 'ssComponents/Navigation/NavHeader';
import MyText from 'ssComponents/ReactNative/MyText';
import VerticalSpace from 'ssComponents/Spacing/VerticalSpace';

// NAVIGATION
import {ADD_CATEGORY_SET_SCREEN_NAME} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';

const AddCategorySetScreen: FC<
  StackNavigatorProps<typeof ADD_CATEGORY_SET_SCREEN_NAME>
> = props => {
  return (
    <View>
      <AddCategorySetNavHeader />

      <VerticalSpace />

      <MyText>Add possible categories...</MyText>
    </View>
  );
};

export default AddCategorySetScreen;
