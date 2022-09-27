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
import { AppDispatch, RootState } from '../../../../../redux';
import { startGetRecommendations } from '../../../../../redux/recommendationsSlice';
import GrowingRecoInputs from './components/GrowingRecoInputs';
import MyButton from '../../../../../components/ReactNative/MyButton';
import MyText from '../../../../../components/ReactNative/MyText';
import RecommendationNodes from './components/RecommendationNodes';

type RecommendationScreenProps = {

};
const RecommendationScreen: FC<RecommendationScreenProps> = (props) => {
    
    // THEME
    const theme = useTheme();

    // REDUX
    const dispatch: AppDispatch = useDispatch();
    const { readSSSignature, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.recommendationsSlice }));

    return (
        <View>

            <RecommendationNodes/>

            <GrowingRecoInputs/>
            
            <MyButton
                style={{
                    width: '80%',
                    borderWidth: 1,
                    borderColor: theme.colors.grayBorder,
                    padding: 10,
                }}
                onPress={() => dispatch(startGetRecommendations({}))}
            >
                <MyText>Get Recommendations!</MyText>
            </MyButton>

        </View>
    )
}

export default RecommendationScreen;
