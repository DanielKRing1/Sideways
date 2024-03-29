import React, {FC} from 'react';
import {HiLoRankingByOutput} from 'ssDatabase/api/types';
import {FlexCol, FlexRow} from '../Flex';
import MyText from '../ReactNative/MyText';
import HiLoRankingDisplay from './HiLoRankingRow';

type HiLoRankingByOutputProps = {
  hiLoRankingByOutput: HiLoRankingByOutput;
};
const HiLoRankingByOutputDisplay: FC<HiLoRankingByOutputProps> = props => {
  const {hiLoRankingByOutput} = props;

  // console.log('HiLoRankingByOutputDisplay RERENDERED');

  return (
    <FlexCol>
      {Object.keys(hiLoRankingByOutput).map(output => (
        <FlexCol key={output}>
          <MyText>{output}</MyText>

          <HiLoRankingDisplay hiLoRanking={hiLoRankingByOutput[output]} />
        </FlexCol>
      ))}
    </FlexCol>
  );
};

export default HiLoRankingByOutputDisplay;
