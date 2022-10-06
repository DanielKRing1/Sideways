import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import VennStackWSlider from 'ssComponents/Charts/Venn/VennStackWSlider';
import { AppDispatch, RootState } from 'ssRedux/index';

type InputVennProps = {

};
const InputVenn: FC<InputVennProps> = (props) => {

    const { vennNodeInputs, vennByMonth } = useSelector((state: RootState) => state.timeSeriesStatsSlice);
    const dispatch: AppDispatch = useDispatch();

    return (
        <View>

            <MyText>Input Venn</MyText>

            <VennStackWSlider

            />

        </View>
    );
}

export default InputVenn;
