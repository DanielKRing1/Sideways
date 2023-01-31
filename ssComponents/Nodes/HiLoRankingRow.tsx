import {RankedNode} from '@asianpersonn/realm-graph';
import React, {FC} from 'react';

import MyText from '../ReactNative/MyText';
import {FlexCol, FlexRow} from '../Flex';
import NodeStats from 'ssScreens/StackNav/TabNav/AnayticsScreen/IdentityView/components/NodeStats';
import {HiLoRanking} from 'ssDatabase/api/types';
import {ScrollView, View} from 'react-native';
import IgnoreTouchable from 'ssComponents/View/IgnoreTouchable';

type HiLoRankingRowDisplayProps = {
  hiLoRanking: HiLoRanking;
};
const HiLoRankingRowDisplay: FC<HiLoRankingRowDisplayProps> = props => {
  const {hiLoRanking} = props;

  // console.log('HiLoRankingDisplay RERENDERED');

  return (
    <FlexCol>
      <MyText>
        (These items score highly and you do them often for its given output)
      </MyText>
      <ScrollView horizontal={true} keyboardShouldPersistTaps="always">
        <IgnoreTouchable>
          <FlexRow>
            {hiLoRanking.highestRanked.map((node: RankedNode) => (
              <NodeStats key={node.id} nodeStats={node} />
            ))}
          </FlexRow>
        </IgnoreTouchable>
      </ScrollView>

      <MyText>
        (These items score low and you do them often for its given output)
      </MyText>
      <ScrollView horizontal={true} keyboardShouldPersistTaps="always">
        <IgnoreTouchable>
          <FlexRow>
            {hiLoRanking.lowestRanked.map((node: RankedNode) => (
              <NodeStats key={node.id} nodeStats={node} />
            ))}
          </FlexRow>
        </IgnoreTouchable>
      </ScrollView>
    </FlexCol>
  );
};

export default HiLoRankingRowDisplay;
