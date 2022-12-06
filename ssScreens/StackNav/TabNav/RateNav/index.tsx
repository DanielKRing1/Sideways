import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';
import FlexCol from '../../../../ssComponents/Flex/FlexCol';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';
import MyText from '../../../../ssComponents/ReactNative/MyText';

// REDUX
import {AppDispatch, RootState} from '../../../../ssRedux';
import {
  startRate,
  forceSignatureRerender,
} from '../../../../ssRedux/rateSidewaysSlice';
import GrowingInputsList from './components/GrowingInputsList';
import GrowingOutputsList from './components/GrowingOutputsList';
import RatingSlider from './components/RatingSlider';
import MyButton from '../../../../ssComponents/ReactNative/MyButton';
import VerticalSpace from '../../../../ssComponents/Spacing/VerticalSpace';
import {StackNavigatorNavigationProp} from '../../../../ssNavigation/StackNavigator';
import {resetRealm} from '../../../../ssRealm/reset';
import RateHomeScreen from './RateHomeScreen';

type RateSliceScreenProps = {};
const RateSliceScreen: FC<RateSliceScreenProps> = props => {
  const {} = props;

  // THEME
  const theme = useTheme();

  // REDUX
  const {ratedSignature} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const {activeSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  const handleRate = async () => {
    dispatch(startRate());
  };

  return <RateHomeScreen />;
  // (
  //   <View>
  //     <FlexCol>
  //       <TabNavHeader />
  //       <GrowingInputsList />
  //       <VerticalSpace />
  //       <GrowingOutputsList />
  //       <RatingSlider />
  //       <FlexCol alignItems="center">
  //         <MyButton
  //           style={{
  //             borderWidth: 1,
  //             borderRadius: 8,
  //             padding: 10,
  //             width: '80%',
  //           }}
  //           onPress={handleRate}>
  //           <MyText>Rate .u.</MyText>
  //         </MyButton>
  //       </FlexCol>

  //       <FlexCol alignItems="center">
  //         <MyButton
  //           style={{
  //             borderWidth: 1,
  //             borderColor: theme.colors.grayBorder,
  //             padding: 10,
  //             width: '80%',
  //           }}
  //           onPress={resetRealm}>
  //           <MyText style={{color: theme.colors.darkRed}}>
  //             Delete entire Realm
  //           </MyText>
  //         </MyButton>
  //       </FlexCol>
  //     </FlexCol>
  //   </View>
  // );
};

export default RateSliceScreen;
