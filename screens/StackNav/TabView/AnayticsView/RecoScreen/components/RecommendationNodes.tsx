import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../components/Nodes/HiLoRankingByOutput';

type RecommendationNodesProps = {

};
const RecommendationNodes: FC<RecommendationNodesProps> = (props) => {

    const { recommendations, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.recommendationStatsSlice }));

    return (
        <View>
        {
            Object.keys(recommendations).length > 0 ?
                <>
                    <MyText>The following are your recommendations to pursue and avoid to achieve each outcome</MyText>

                    <HiLoRankingByOutput
                    hiLoRankingByOutput={recommendations}
                    />
                </>
            :
                <MyText>Try entering some inputs!</MyText>
        }
        </View>
    );
}

export default RecommendationNodes;
