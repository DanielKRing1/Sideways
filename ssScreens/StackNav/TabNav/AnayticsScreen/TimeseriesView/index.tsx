import React, {FC, useEffect, useMemo} from 'react';
import {ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';

// REDUX
import {AppDispatch, RootState} from '../../../../../ssRedux';
import MyButton from '../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../ssComponents/ReactNative/MyText';

// MY COMPONENTS
import OutputLineGraph from './components/LineGraph';
import OutputHistogram from './components/Histogram';
import InputVenn from './components/Venn';
import OutputHeatMap from './components/HeatMap';
import {
  CHART_TYPES,
  HEAT_MAP,
  HISTOGRAM,
  LINE_GRAPH,
  startAssureFreshness as startAssureTimeseriesFreshness,
  VENN_PLOT,
} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import FloatingSelectionButton from './components/Selection/FloatingSelectionButton';
import {abbrDateMs} from 'ssUtils/date';

type TimeseriesProps = {};
const Timeseries: FC<TimeseriesProps> = () => {
  // THEME
  const theme = useTheme();

  // REDUX
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {heatMapByMonth, monthIndex, selectedChart, graphsSignature} =
    useSelector(
      (state: RootState) => state.analyticsSlice.timeseriesStatsSlice,
    );
  const dispatch: AppDispatch = useDispatch();

  // Assure chart freshness:
  //  Update charts if activeSliceName is different from analyzedSliceName or if !isFresh
  //
  //  Check freshness when mounting this component.
  //  Freshness currently will not change while this component is mounted
  useEffect(() => {
    dispatch(startAssureTimeseriesFreshness());
  }, []);

  // SELECTED CHART COMPONENT
  const SelectedChart: FC<{}> = useMemo(() => {
    switch (selectedChart) {
      case CHART_TYPES[LINE_GRAPH]:
        return OutputLineGraph;
      case CHART_TYPES[HISTOGRAM]:
        return OutputHistogram;
      case CHART_TYPES[VENN_PLOT]:
        return InputVenn;
      case CHART_TYPES[HEAT_MAP]:
      default:
        return OutputHeatMap;
    }
  }, [selectedChart]);

  const date = new Date(2009, 10, 10); // 2009-11-10
  const month = date.toLocaleString('default', {month: 'long'});
  console.log(month);

  return (
    <ScrollView>
      {monthIndex > -1 && !!heatMapByMonth && !!heatMapByMonth[monthIndex] && (
        <>
          <MyText>Month:</MyText>
          <MyText>
            {JSON.stringify(abbrDateMs(heatMapByMonth[monthIndex].timestamp))}
          </MyText>
        </>
      )}

      <SelectedChart />

      <FloatingSelectionButton />

      <MyButton
        style={{
          width: '80%',
          borderWidth: 1,
          borderColor: theme.colors.grayBorder,
          padding: 10,
        }}
        onPress={() => {}}>
        <MyText>Get Graphs!</MyText>
      </MyButton>
    </ScrollView>
  );
};

export default Timeseries;
