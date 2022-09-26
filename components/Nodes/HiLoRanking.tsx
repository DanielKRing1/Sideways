import { RankedNode } from "@asianpersonn/realm-graph";
import React, { FC } from "react";
import { HiLoRanking } from "../../database/types"
import NodeStats from "../../screens/StackNav/TabView/AnayticsView/StatsScreen/components/NodeStats";
import { FlexCol } from "../Flex";
import MyText from "../ReactNative/MyText";

type HiLoRankingDisplayProps = {
    hiLoRanking: HiLoRanking;
}
const HiLoRankingDisplay: FC<HiLoRankingDisplayProps> = (props) => {
    const { hiLoRanking } = props;

    return (
        <FlexCol>
            <MyText>(These items score highly and you do them often for its given output)</MyText>
            {
                hiLoRanking.highestRanked.map((node: RankedNode) => (
                    <NodeStats
                        nodeStats={node}
                    />
                ))
            }

            <MyText>(These items score low and you do them often for its given output)</MyText>
            {
                hiLoRanking.lowestRanked.map((node: RankedNode) => (
                    <NodeStats
                        nodeStats={node}
                    />
                ))
            }
        </FlexCol>
    )
}

export default HiLoRankingDisplay;