import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';

// REDUX
import {DISPLAY_SIZE} from '../../../../../global';
import {AppDispatch, RootState} from '../../../../../ssRedux';
import {startGetRecommendations} from '../../../../../ssRedux/analyticsSlice/recoStatsSlice';
import GrowingRecoInputs from './components/GrowingRecoInputs';
import MyButton from '../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../ssComponents/ReactNative/MyText';
import RecommendationNodes from './components/RecommendationNodes';
import StickyScrollView from 'ssComponents/View/StickyScrollView';
import {GraphType} from 'ssDatabase/api/core/types';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import {FlexCol, FlexRow} from 'ssComponents/Flex';
import {View} from 'react-native';

type RecommendationScreenProps = {};
const RecommendationScreen: FC<RecommendationScreenProps> = () => {
  // THEME
  const theme = useTheme();

  // REDUX
  const dispatch: AppDispatch = useDispatch();
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {recommendationsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.recoStatsSlice,
  );

  return (
    <StickyScrollView
      keyboardShouldPersistTaps="handled"
      stickyHeaderIndices={[2]}
      contentContainerStyle={{alignItems: 'center'}}>
      <GrowingRecoInputs />
      <RecommendationNodes />

      <View
        style={{
          height: '10%',
        }}>
        <MyBorder
          shadow
          paddingBase={DISPLAY_SIZE.md}
          marginTop={DISPLAY_SIZE.sm}
          marginBottom={DISPLAY_SIZE.sm}
          style={{
            backgroundColor: theme.backgroundColors.main,
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              backgroundColor: theme.backgroundColors.main,
            }}>
            <MyButton
              style={{
                backgroundColor: theme.backgroundColors.main,
              }}
              onPress={() =>
                dispatch(startGetRecommendations({graphType: GraphType.Input}))
              }>
              <MyText>Get Recommendations!</MyText>
            </MyButton>
          </View>
        </MyBorder>
      </View>
    </StickyScrollView>
  );
};

export default RecommendationScreen;
