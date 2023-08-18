// https://snack.expo.dev/@asianpersonn/floatingactionbutton

import React, {FC} from 'react';
import {Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useDispatch} from 'react-redux';

import FloatingActionButton from 'ssComponents/Button/FloatingAction';
import {AppDispatch} from 'ssRedux/index';
import {
  CHART_TYPES,
  HEAT_MAP,
  HISTOGRAM,
  LINE_GRAPH,
  setChartSelection,
  VENN_PLOT,
} from 'ssRedux/analytics/timeseriesStats';

const SelectLineGraph = (dispatch: AppDispatch) => (
  <TouchableOpacity
    onPress={() => dispatch(setChartSelection(CHART_TYPES[LINE_GRAPH]))}>
    <Text>Line Graph</Text>
  </TouchableOpacity>
);
const SelectHistogram = (dispatch: AppDispatch) => (
  <TouchableOpacity
    onPress={() => dispatch(setChartSelection(CHART_TYPES[HISTOGRAM]))}>
    <Text>Histogram</Text>
  </TouchableOpacity>
);
const SelectVenn = (dispatch: AppDispatch) => (
  <TouchableOpacity
    onPress={() => dispatch(setChartSelection(CHART_TYPES[VENN_PLOT]))}>
    <Text>Venn</Text>
  </TouchableOpacity>
);
const SelectHeatMap = (dispatch: AppDispatch) => (
  <TouchableOpacity
    onPress={() => dispatch(setChartSelection(CHART_TYPES[HEAT_MAP]))}>
    <Text>Heat Map</Text>
  </TouchableOpacity>
);

type FloatingSelectionButtonProps = {};
const FloatingSelectionButton: FC<FloatingSelectionButtonProps> = () => {
  // WINDOW DIMENSIONS
  const {width} = useWindowDimensions();

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  return (
    <FloatingActionButton
      position={{x: width / 5, y: width / 5}}
      radius={width / 16}
      Components={[
        () => SelectLineGraph(dispatch),
        () => SelectHistogram(dispatch),
        () => SelectVenn(dispatch),
        () => SelectHeatMap(dispatch),
      ]}
    />
  );
};

export default FloatingSelectionButton;
