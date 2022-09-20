import React, { FC, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { RankedNode } from '@asianpersonn/realm-graph';

import { GrowingList } from '../../../../../components/Input/GrowingInputList';
import MyTextInput from '../../../../../components/ReactNative/MyTextInput';

// DB DRIVER
import { DbLoaderContext } from '../../../../../contexts/DbLoader/DbLoader';
import dbDriver from '../../../../../database/dbDriver';

// REDUX
import { RootState } from '../../../../../redux';
import { setRecommendationSliceOutput, setRecommendationInputs, addRecommendationInput, removeRecommendationInput, RecoInput } from '../../../../../redux/recommendationsSlice';
import GrowingRecoInputs from './components/GrowingRecoInputs';
import MyButton from '../../../../../components/ReactNative/MyButton';
import MyText from '../../../../../components/ReactNative/MyText';

type RecommendationScreenProps = {

};
const RecommendationScreen: FC<RecommendationScreenProps> = (props) => {
    
    // THEME
    const theme = useTheme();

    // REDUX
    const dispatch = useDispatch();
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const { recommendationSliceOutput, recommendationInputs, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.recommendationsSlice }));
    
    const [ recommendations, setRecommendations ] = useState<RankedNode[]>([]);
    const getRecommendations = async () => {
        const { isLoaded } = useContext(DbLoaderContext);
        const TARGET_INPUT_NODE_WEIGHT: number = 0.5;
        const EDGE_INFLATION_MAGNITUDE: number = 2;
        
        const newRecommendations = await useMemo(() => dbDriver.getRecommendations(activeSliceName, recommendationSliceOutput, recommendationInputs.map((input: RecoInput) => input.text), TARGET_INPUT_NODE_WEIGHT, EDGE_INFLATION_MAGNITUDE, 20, 0.85), [isLoaded, activeSliceName, recommendationSliceOutput, recommendationInputs]);
        // Type is { id: string, [any key]: any value }
        setRecommendations(newRecommendations as RankedNode[]);
    }

    return (
        <View>

            <GrowingRecoInputs/>
            
            <MyButton
                style={{
                    width: '80%',
                    borderWidth: 1,
                    borderColor: theme.colors.grayBorder,
                    padding: 10,
                }}
                onPress={getRecommendations}
            >
                <MyText>Create new slice!</MyText>
            </MyButton>

        </View>
    )
}
