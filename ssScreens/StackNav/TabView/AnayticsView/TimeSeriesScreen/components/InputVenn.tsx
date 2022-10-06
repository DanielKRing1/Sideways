import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import VennStackWSlider from 'ssComponents/Charts/Venn/VennStackWSlider';
import { AppDispatch, RootState } from 'ssRedux/index';
import { setMonthIndex } from 'ssRedux/timeSeriesStatsSlice';
import GrowingVennInputList from './GrowingVennInputList';

type InputVennProps = {

};
const InputVenn: FC<InputVennProps> = (props) => {

    const { activeSliceName, vennByMonth, vennNodeInputs, monthIndex } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.timeSeriesStatsSlice }));
    const dispatch: AppDispatch = useDispatch();
    
    // HANDLER METHODS
    const handleSelectMonth = (newMonthIndex: number) => dispatch(setMonthIndex(newMonthIndex));

    return (
        <View>

            <MyText>Input Venn</MyText>
            
            <GrowingVennInputList/>

            <VennStackWSlider

            />

        </View>
    );
}

export default InputVenn;
