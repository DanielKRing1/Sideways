import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components/native';

// REDUX
import { AppDispatch, RootState } from '../../../../../ssRedux';
import MyButton from '../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../ssComponents/ReactNative/MyText';

type GraphScreenProps = {

};
const GraphScreen: FC<GraphScreenProps> = (props) => {
    
    // THEME
    const theme = useTheme();

    // REDUX
    const dispatch: AppDispatch = useDispatch();
    const { readSSSignature, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.recommendationStatsSlice }));

    return (
        <View>

            {/* <GrowingGraphInputs/> */}
            
            <MyButton
                style={{
                    width: '80%',
                    borderWidth: 1,
                    borderColor: theme.colors.grayBorder,
                    padding: 10,
                }}
                onPress={() => {}}
            >
                <MyText>Get Graphs!</MyText>
            </MyButton>

        </View>
    )
}

export default GraphScreen;
