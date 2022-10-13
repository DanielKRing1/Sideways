import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import VennStackWSlider from 'ssComponents/Charts/Venn/VennStackWSlider';
import { AppDispatch, RootState } from 'ssRedux/index';
import { setMonthIndex, VennInput } from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import GrowingVennInputList from './GrowingVennInputList';
import { getStringMapSubsetList, getStringMapValue, ID_TYPES } from 'ssDatabase/hardware/realm/userJson/utils';
import { ChartBar } from 'ssDatabase/hardware/realm/analytics/timeseriesStatsDriver';

type InputVennProps = {};
const InputVenn: FC<InputVennProps> = (props) => {

    const { activeSliceName, vennByMonth, vennNodeInputs, monthIndex, fullColorMap } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.analyticsSlice.timeseriesStatsSlice, ...state.userJsonSlice.colorSlice, ...state.userJsonSlice.iconSlice }));
    const dispatch: AppDispatch = useDispatch();
    
    // HANDLER METHODS
    const handleSelectMonth = (newMonthIndex: number) => dispatch(setMonthIndex(newMonthIndex));

    const colorScale: string[] = useMemo(() => {        
        // 1. Get nodeIds
        const vennNodeIds: string[] = vennNodeInputs.map((nodeInput: VennInput) => nodeInput.text);

        // 2. Convert nodeIds to colors
        return getStringMapSubsetList<string>(vennNodeIds, fullColorMap, ID_TYPES.INPUT, (i: number, value: string) => value);
    }, [vennNodeInputs, fullColorMap]);

    return (
        <View>

            <MyText>Input Venn</MyText>
            
            <GrowingVennInputList/>

            <VennStackWSlider
                colorScale={colorScale}
                data={vennByMonth[monthIndex].venn}
                xValues={vennByMonth[monthIndex].venn[0].map((day: ChartBar) => day.x as Date)}
                xLabels={vennByMonth[monthIndex].outputs}
                xLabelFill={({ text }) => getStringMapValue(text[0], fullColorMap, ID_TYPES.OUTPUT)}
                yValues={vennNodeInputs.map((nodeInput: VennInput) => nodeInput.text)}
                
                value={monthIndex}
                setValue={handleSelectMonth}
                min={0}
                max={vennByMonth.length-1}
                leftColor={'yellow'}
                rightColor={'red'}
            />

        </View>
    );
}

export default InputVenn;
