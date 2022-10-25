import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled, {DefaultTheme, useTheme} from 'styled-components/native';

// REDUX
import {AppDispatch, RootState} from '../../../ssRedux';
import {
  setNewSliceName,
  startCreateSlice,
} from '../../../ssRedux/createSidewaysSlice';

// NAVIGATION
import {ADD_SLICE_SCREEN_NAME} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';

// COMPONENTS

// NAV
import {AddSliceNavHeader} from '../../../ssComponents/Navigation/NavHeader';
import MyTextInput from '../../../ssComponents/ReactNative/MyTextInput';
import MyButton from '../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../ssComponents/ReactNative/MyText';
import {FlexCol} from '../../../ssComponents/Flex';
import VerticalSpace from '../../../ssComponents/Spacing/VerticalSpace';
import GrowingPossibleOutputs from './components/GrowingPossibleOutputs';

// Possible outputs

const StyledTextInput = styled(MyTextInput)`
  borderwidth: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;

const AddSliceScreen: FC<
  StackNavigatorProps<typeof ADD_SLICE_SCREEN_NAME>
> = props => {
  const {navigation, route} = props;
  const {inputSliceName} = route.params;

  // THEME
  const theme = useTheme();

  // REDUX
  const {searchedSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {createdSignature} = useSelector(
    (state: RootState) => state.createSidewaysSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // UPDATE REDUX STATE
  useEffect(() => {
    dispatch(setNewSliceName(searchedSliceName));
  }, []);

  return (
    <View>
      <AddSliceNavHeader />

      <GrowingPossibleOutputs />

      <VerticalSpace />

      <FlexCol alignItems="center">
        <MyButton
          style={{
            width: '80%',
            borderWidth: 1,
            borderColor: theme.colors.grayBorder,
            padding: 10,
          }}
          onPress={() => dispatch(startCreateSlice())}>
          <MyText>Create new slice!</MyText>
        </MyButton>
      </FlexCol>
    </View>
  );
};

export default AddSliceScreen;
