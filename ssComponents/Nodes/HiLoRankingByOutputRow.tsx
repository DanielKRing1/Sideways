import React, {FC} from 'react';
import {ScrollView, View} from 'react-native';
import {HiLoRankingByOutput} from 'ssDatabase/api/types';
import {FlexCol, FlexRow} from '../Flex';
import MyText from '../ReactNative/MyText';
import HiLoRankingDisplayRow from './HiLoRankingRow';

type HiLoRankingByOutputRowProps = {
  hiLoRankingByOutput: HiLoRankingByOutput;
};
const HiLoRankingByOutputRowDisplay: FC<
  HiLoRankingByOutputRowProps
> = props => {
  const {hiLoRankingByOutput} = props;

  // console.log('HiLoRankingByOutputRowDisplay RERENDERED');

  return (
    <>
      {Object.keys(hiLoRankingByOutput).map(output => (
        <FlexCol key={output}>
          <MyText>{output}</MyText>

          <HiLoRankingDisplayRow hiLoRanking={hiLoRankingByOutput[output]} />
        </FlexCol>
      ))}
    </>
  );
};

export default HiLoRankingByOutputRowDisplay;
