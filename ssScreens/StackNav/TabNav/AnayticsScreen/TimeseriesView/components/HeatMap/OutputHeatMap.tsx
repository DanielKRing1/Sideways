import React, {FC, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {RootState, AppDispatch} from 'ssRedux/index';
import MyText from 'ssComponents/ReactNative/MyText';
import HeatMapWSlider from 'ssComponents/Charts/HeatMap/HeatMapWSlider';
import {PartialHeatMapCell} from 'ssComponents/Charts/HeatMap/HeatMap';
import {getOutputDecorationList} from 'ssDatabase/hardware/realm/userJson/utils/outputFormatting';
import {setMonthIndex} from 'ssRedux/analytics/timeseriesStats';
import OutputHeatMapCell from './OutputHeatMapCell';
import {HeatMapDay} from 'ssDatabase/api/analytics/timeseries/types';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from 'ssUtils/date';

type OutputHeatMapProps = {};
const OutputHeatMap: FC<OutputHeatMapProps> = () => {
  // LOCAL STATE
  const [selectedIndex, setSelectedIndex] = useState<number>();

  // REDUX
  const {heatMapByMonth, monthIndex} = useSelector(
    (state: RootState) => state.analytics.timeseriesStats,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.fetched.userJson,
  );
  const dispatch: AppDispatch = useDispatch();

  // FORMAT DATA
  const heatMap: PartialHeatMapCell[] = useMemo(() => {
    console.log(heatMapByMonth);
    console.log(monthIndex);
    // 1. Get HeatMap month { day, outputs }
    // Handle case of no heatmap at monthIndex
    if (monthIndex >= heatMapByMonth.length) {
      return [];
    }
    const heatMapRaw: HeatMapDay[] = heatMapByMonth[monthIndex].heatMap;

    // 2. Convert raw map to heat map cells
    // [ { value: [...colors], onPress: (i) => setSelectedIndex(i) }, ... ]
    const heatMapCellsSubset: PartialHeatMapCell[] = heatMapRaw.map(
      (day: HeatMapDay) => ({
        value: getOutputDecorationList<string>(
          day.outputs,
          fullUserJsonMap,
          (i: number, v: OutputDecoration) => v.color,
        ),
        onPress: (index: number) => setSelectedIndex(index),
      }),
    );

    const heatMapCellsFullset: PartialHeatMapCell[] = [];

    // 3. Fill in missing days in heat map
    const NONEXISTANT_DAY_CELL: PartialHeatMapCell = {
      value: ['white'],
      onPress: () => {},
    };
    const UNRATED_DAY_CELL: PartialHeatMapCell = {
      value: ['grey'],
      onPress: () => {},
    };
    for (let i = heatMapCellsSubset.length - 1; i >= 0; i--) {
      const {date} = heatMapRaw[i];
      while (heatMapCellsFullset.length < date - 1) {
        heatMapCellsFullset.push(UNRATED_DAY_CELL);
      }

      heatMapCellsFullset.push(heatMapCellsSubset[i]);
    }

    // 4. Pad end of heat map cells
    const daysInMonth: number = getDaysInMonth(
      heatMapByMonth[monthIndex].timestamp,
    );
    while (heatMapCellsFullset.length < daysInMonth) {
      heatMapCellsFullset.push(UNRATED_DAY_CELL);
    }

    // 5. Shift empty heat map cell days onto first row
    const firstDayOfMonth: number = getFirstDayOfMonth(
      heatMapByMonth[monthIndex].timestamp,
    );
    for (let i = 0; i < firstDayOfMonth; i++) {
      heatMapCellsFullset.unshift(NONEXISTANT_DAY_CELL);
    }

    // 6. Push empty heat map cell days onto last row
    const lastDayOfMonth: number = getLastDayOfMonth(
      heatMapByMonth[monthIndex].timestamp,
    );
    console.log('LAST DAY OF MONTHHHH-------------------');
    console.log(lastDayOfMonth);
    console.log(new Date().getUTCDay());
    for (let i = 0; i < 7 - lastDayOfMonth - 1; i++) {
      heatMapCellsFullset.push(NONEXISTANT_DAY_CELL);
    }

    return heatMapCellsFullset;
  }, [heatMapByMonth, monthIndex, fullUserJsonMap]);

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
