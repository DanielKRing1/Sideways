import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components/native';

// REDUX
import { AppDispatch, RootState } from '../../../../../ssRedux';
import MyButton from '../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../ssComponents/ReactNative/MyText';

// MY COMPONENTS
import OutputLineGraph from './components/LineGraph';
import OutputHistogram from './components/Histogram';
import InputVenn from './components/Venn';
import OutputHeatMap from './components/HeatMap';
import { GRAPH_TYPES, HEAT_MAP, HISTOGRAM, LINE_GRAPH, VENN_PLOT } from 'ssRedux/timeSeriesStatsSlice';

type GraphScreenProps = {

};
const GraphScreen: FC<GraphScreenProps> = (props) => {
    
    // THEME
    const theme = useTheme();

    // REDUX
    const { activeSliceName, selectedGraph, readSSSignature, graphsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.readSidewaysSlice.toplevelReadReducer, ...state.timeSeriesStatsSlice }));
    const dispatch: AppDispatch = useDispatch();

    // SELECTED CHART COMPONENT
    const SelectedChart: FC<{}> = useMemo(() => {
        switch(selectedGraph) {
            case GRAPH_TYPES[LINE_GRAPH]:
                return OutputLineGraph;
            case GRAPH_TYPES[HISTOGRAM]:
                return OutputHistogram;
            case GRAPH_TYPES[VENN_PLOT]:
                return InputVenn;
            case GRAPH_TYPES[HEAT_MAP]:
            default:
                return OutputHeatMap;
        }
    }, [selectedGraph]);

    return (
        <View>
            
            <SelectedChart/>
            
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
