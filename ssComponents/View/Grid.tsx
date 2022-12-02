import React, {FC, useMemo} from 'react';
import {View, ViewStyle} from 'react-native';

type GridProps = {
  cols: number[];
  children: React.ReactNode[];
  style?: ViewStyle;
};

const Grid: FC<GridProps> = props => {
  const {cols, children, style} = props;

  const childrenRows: React.ReactNode[] = useMemo(() => {
    let rows: React.ReactNode[] = [];

    let counter: number = 0;
    while (counter < children!.length) {
      // 1. Alternate column count
      const colCountIndex: number = rows.length % cols.length;
      const curColCount: number = cols[colCountIndex];

      // 2. Push row
      rows.push(children!.slice(counter, counter + curColCount));

      // 3. Increment counter
      counter += curColCount;
    }

    return rows;
  }, [children, cols]);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        ...style,
      }}>
      {childrenRows.map((row: React.ReactNode, i: number) => (
        <FlexRow key={i}>{row}</FlexRow>
      ))}
    </View>
  );
};

export default Grid;

type FlexRowProps = {
  children?: React.ReactNode;
};
const FlexRow: FC<FlexRowProps> = props => {
  const {children} = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {children}
    </View>
  );
};
