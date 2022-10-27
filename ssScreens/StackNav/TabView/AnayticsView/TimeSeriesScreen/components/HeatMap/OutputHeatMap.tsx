import React, {FC, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {RootState, AppDispatch} from 'ssRedux/index';
import MyText from 'ssComponents/ReactNative/MyText';
import HeatMapWSlider from 'ssComponents/Charts/HeatMap/HeatMapWSlider';
import {PartialHeatMapCell} from 'ssComponents/Charts/HeatMap/HeatMap';
import {getDecorationMapSubsetList} from 'ssDatabase/hardware/realm/userJson/utils';
import {setMonthIndex} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import OutputHeatMapCell from './OutputHeatMapCell';
import {HeatMapDay} from 'ssDatabase/api/analytics/timeseries/types';
import {
  DECORATION_ROW_TYPE,
  DECORATION_VALUE_KEY,
} from 'ssDatabase/api/userJson/decoration/types';

type OutputHeatMapProps = {};
const OutputHeatMap: FC<OutputHeatMapProps> = () => {
  // LOCAL STATE
  const [selectedIndex, setSelectedIndex] = useState<number>();

  // REDUX
  const {heatMapByMonth, monthIndex, fullDecorationMap} = useSelector(
    (state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.analyticsSlice.timeseriesStatsSlice,
      ...state.userJsonSlice.decorationSlice,
    }),
  );
  const dispatch: AppDispatch = useDispatch();

  // FORMAT DATA
  const heatMap: PartialHeatMapCell[] = useMemo(() => {
    const rawHeatMap: HeatMapDay[] = heatMapByMonth[monthIndex].heatMap;

    // [ { value: [...colors], onPress: (i) => setSelectedIndex(i) }, ... ]
    return rawHeatMap.map((day: HeatMapDay) => ({
      value: getDecorationMapSubsetList<string>(
        DECORATION_ROW_TYPE.OUTPUT,
        day.outputs,
        DECORATION_VALUE_KEY.COLOR,
        fullDecorationMap,
        (i: number, v: string) => v,
      ),
      onPress: (index: number) => setSelectedIndex(index),
    }));
  }, [heatMapByMonth, monthIndex, fullDecorationMap]);

  // HANDLER METHODS
  const handleSelectMonth = (newMonthIndex: number) =>
    dispatch(setMonthIndex(newMonthIndex));

  return (
    <View>
      <MyText>Output Heat Map</MyText>

      {selectedIndex !== undefined ? (
        <MyText>You've selected: {selectedIndex}</MyText>
      ) : (
        <MyText>No selected Index!</MyText>
      )}

      <HeatMapWSlider
        cols={7}
        data={heatMap}
        CellComponent={OutputHeatMapCell}
        value={monthIndex}
        setValue={handleSelectMonth}
        min={0}
        max={heatMapByMonth.length - 1}
        leftColor={'yellow'}
        rightColor={'red'}
      />
    </View>
  );
};

export default OutputHeatMap;
