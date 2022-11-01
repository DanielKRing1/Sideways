import {RankedNode} from '@asianpersonn/realm-graph';
import React, {FC} from 'react';

import MyText from '../ReactNative/MyText';
import {FlexCol} from '../Flex';
import NodeStats from 'ssScreens/StackNav/TabNav/AnayticsScreen/IdentityView/components/NodeStats';
import {HiLoRanking} from 'ssDatabase/api/types';

type HiLoRankingDisplayProps = {
  hiLoRanking: HiLoRanking;
};
const HiLoRankingDisplay: FC<HiLoRankingDisplayProps> = props => {
  const {hiLoRanking} = props;

  return (
    <FlexCol>
      <MyText>
        (These items score highly and you do them often for its given output)
      </MyText>
      {hiLoRanking.highestRanked.map((node: RankedNode) => (
        <NodeStats nodeStats={node} />
      ))}

      <MyText>
        (These items score low and you do them often for its given output)
      </MyText>
      {hiLoRanking.lowestRanked.map((node: RankedNode) => (
        <NodeStats nodeStats={node} />
      ))}
    </FlexCol>
  );
};

export default HiLoRankingDisplay;
