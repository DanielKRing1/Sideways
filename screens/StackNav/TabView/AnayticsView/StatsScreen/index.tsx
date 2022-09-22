import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

import dbDriver from '../../../../../database/dbDriver';
import { RootState } from '../../../../../redux';
import { setStatsInput, setStatsOutput } from '../../../../../redux/statsSlice';
import MyTextInput from '../../../../../components/ReactNative/MyTextInput';
import { CGNode } from '@asianpersonn/realm-graph';

type StatsScreenProps = {

};
const StatsScreen: FC<StatsScreenProps> = (props) => {

    const { activeSliceName, statsInput, statsOutput, readSSSignature, statsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.statsSlice }));
    const dispatch = useDispatch();

    let node: CGNode;
    let commonlyDoneWith: CGNode[];
    let commonlyDoneByOutput: CGNode[];
    let highlyRatedByOutput: CGNode[];

    return (
        <View>
            <MyTextInput
                placeholder='Choose a past input'
                value={statsInput}
                onChangeText={(newText: string) => dispatch(setStatsInput(newText))}
            />

            <MyTextInput
                placeholder='Choose an output'
                value={statsOutput}
                onChangeText={(newText: string) => dispatch(setStatsOutput(newText))}
            />

            
        </View>
    );
}

export default StatsScreen;
