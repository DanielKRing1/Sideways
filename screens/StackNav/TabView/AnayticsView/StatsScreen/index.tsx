import React, { FC, useMemo } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import StickyScrollView from '../../../../../components/View/StickyScrollView';
import { BoxShadow } from '../../../../../components/Shadow/BoxShadow';
import IdentityNodes from './components/IdentityNodes';
import NodeInput from './components/NodeInput';
import InputNodeStats from './components/InputNodeStats';
import CollectivelyTandemNodes from './components/CollectivelyTandemNodes';
import SinglyTandemNodes from './components/SinglyTandemNodes';
import HighlyRatedTandemNodes from './components/HighlyRatedNodes';

type StatsScreenProps = {

};
const StatsScreen: FC<StatsScreenProps> = (props) => {

    const theme: DefaultTheme = useTheme();

    return (
        <StickyScrollView
            stickyHeaderIndices={[1]}
        >
            {/* Index 0 PageRank Stats */}
            <BoxShadow>
                <IdentityNodes/>
            </BoxShadow>

            {/* Index 1 Choose Input */}
            <NodeInput/>

            {/* Index 2 Node Stats */}
            <BoxShadow>
                <InputNodeStats/>
            </BoxShadow>
            
            {/* Index 3 Collectively Tandem Nodes */}
            <BoxShadow>
                <CollectivelyTandemNodes/>
            </BoxShadow>
            
            {/* Index 4 Singly Tandem Node */}
            <BoxShadow>
                <SinglyTandemNodes/>
            </BoxShadow>

            {/* Index 5 Highly Rated Tandem Nodes */}
            <BoxShadow>
                <HighlyRatedTandemNodes/>
            </BoxShadow>

            
        </StickyScrollView>
    );
}

export default StatsScreen;
