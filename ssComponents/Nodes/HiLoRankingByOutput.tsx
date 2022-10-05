import { RankedNode } from "@asianpersonn/realm-graph";
import React, { FC } from "react";
import { HiLoRankingByOutput } from "../../ssDatabase/types"
import NodeStats from "../../ssScreens/StackNav/TabView/AnayticsView/IdentityScreen/components/NodeStats";
import { FlexCol, FlexRow } from "../Flex";
import MyText from "../ReactNative/MyText";
import HiLoRankingDisplay from "./HiLoRanking";

type HiLoRankingByOutputProps = {
    hiLoRankingByOutput: HiLoRankingByOutput;
}
const HiLoRankingByOutputDisplay: FC<HiLoRankingByOutputProps> = (props) => {
    const { hiLoRankingByOutput } = props;

    return (
        <FlexCol>
            {
                Object.keys(hiLoRankingByOutput).map((output) => (
                    <FlexRow>
                        <MyText>{output}</MyText>

                        <HiLoRankingDisplay
                            hiLoRanking={hiLoRankingByOutput[output]}
                        />
                    </FlexRow>
                ))
            }
        </FlexCol>
    )
}

export default HiLoRankingByOutputDisplay;
