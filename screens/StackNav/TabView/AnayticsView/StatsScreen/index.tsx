import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import dbDriver from '../../../../../database/dbDriver';
import { RootState } from '../../../../../redux';
import MyTextInput from '../../../../../components/ReactNative/MyTextInput';
import { CGNode, RankedNode } from '@asianpersonn/realm-graph';
import StickyScrollView from '../../../../../components/View/StickyScrollView';
import { BoxShadow } from '../../../../../components/Shadow/BoxShadow';
import MyText from '../../../../../components/ReactNative/MyText';
import IconInput from '../../../../../components/IconInput/IconInput';
import { Dict } from '../../../../../global';
import { sortRankedNodesMapByAllOutputs, sortRankedNodesMapByOutput } from '../../../../../database/realm/utils';
import IconInputRow from '../../../../../components/IconInput/IconInputRow';
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
