import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutputRow from '../../../../../../ssComponents/Nodes/HiLoRankingByOutputRow';

type RecommendationNodesProps = {};
const RecommendationNodes: FC<RecommendationNodesProps> = () => {
  const {recommendations} = useSelector(
    (state: RootState) => state.analytics.recommendationsStats,
  );

  console.log('RECOMMENDATIONS------------------');
  console.log(recommendations);

  return (
    <View>
      {Object.keys(recommendations).length > 0 ? (
        <>
          <MyText>
            The following are your recommendations to pursue and avoid to
            achieve each outcome
          </MyText>

          <HiLoRankingByOutputRow hiLoRankingByOutput={recommendations} />
        </>
      ) : (
        <MyText>Try entering some inputs!</MyText>
      )}
    </View>
  );
};

export default RecommendationNodes;
