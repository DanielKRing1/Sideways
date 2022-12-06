import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';

// REDUX
import {AppDispatch, RootState} from '../../../../../ssRedux';
import {startGetRecommendations} from '../../../../../ssRedux/analyticsSlice/recoStatsSlice';
import GrowingRecoInputs from './components/GrowingRecoInputs';
import MyButton from '../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../ssComponents/ReactNative/MyText';
import RecommendationNodes from './components/RecommendationNodes';
import {TabNavHeader} from 'ssComponents/Navigation/NavHeader';
import StickyScrollView from 'ssComponents/View/StickyScrollView';

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
      keyboardShouldPersistTaps="always"
      stickyHeaderIndices={[1]}>
      <GrowingRecoInputs />

      <MyButton
        style={{
          width: '80%',
          borderWidth: 1,
          borderColor: theme.colors.grayBorder,
          padding: 10,
        }}
        onPress={() => dispatch(startGetRecommendations({}))}>
        <MyText>Get Recommendations!</MyText>
      </MyButton>

      <RecommendationNodes />
    </StickyScrollView>
  );
};

export default RecommendationScreen;
