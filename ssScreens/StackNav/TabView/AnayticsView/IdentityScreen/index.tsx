import React, { FC, useEffect } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import StickyScrollView from '../../../../../ssComponents/View/StickyScrollView';
import { BoxShadow } from '../../../../../ssComponents/Shadow/BoxShadow';
import IdentityNodes from './components/IdentityNodes';
import NodeInput from './components/NodeInput';
import InputNodeStats from './components/InputNodeStats';
import CollectivelyTandemNodes from './components/CollectivelyTandemNodes';
import SinglyTandemNodes from './components/SinglyTandemNodes';
import HighlyRatedTandemNodes from './components/HighlyRatedNodes';
import { AppDispatch } from 'ssRedux/index';
import { useDispatch } from 'react-redux';
import { startAssureFreshness as startAssureIdentityFreshness } from 'ssRedux/analyticsSlice/identityStatsSlice';
import { View } from 'react-native';
import { TabNavHeader } from 'ssComponents/Navigation/NavHeader';

type StatsScreenProps = {

};
const StatsScreen: FC<StatsScreenProps> = (props) => {

    const theme: DefaultTheme = useTheme();
    const dispatch: AppDispatch = useDispatch();

    // Assure chart freshness:
    //  Update charts if activeSliceName is different from analyzedSliceName or if !isFresh
    // 
    //  Check freshness when mounting this component.
    //  Freshness currently will not change while this component is mounted
    useEffect(() => {
        dispatch(startAssureIdentityFreshness());
    }, []);

    return (
        <View
            style={{
                // height: '100%',
            }}
        >
            <TabNavHeader/>
            
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

        </View>
    );
}

export default StatsScreen;
