import React, {FC, memo, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components/native';
import {ID_KEY, RankedNode} from '@asianpersonn/realm-graph';

import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import IconInput from '../../../../../../ssComponents/IconInput/IconInput';
import {FlexCol} from '../../../../../../ssComponents/Flex';
import {RootState} from 'ssRedux/index';
import {cIdToCD, inToLastCId} from 'ssDatabase/hardware/realm/userJson/utils';
import {GJ_CategoryDecoration} from 'ssDatabase/api/userJson/category/types';

type NodeStatsProps = {
  nodeStats: RankedNode | undefined;
};
const NodeStats: FC<NodeStatsProps> = props => {
  const {nodeStats} = props;

  // THEME
  const theme: DefaultTheme = useTheme();

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );

  const iconName: string = useMemo(() => {
    // NOTE: If id becomes a uuid and is no longer the input name, then get the input name differently
    const inputName: string = nodeStats !== undefined ? nodeStats.id : '';

    const cId: string = inToLastCId(inputName, fullUserJsonMap, 'nodestats');
    const cd: GJ_CategoryDecoration = cIdToCD(
      activeSliceName,
      cId,
      fullUserJsonMap,
    );

    return cd.icon;
  }, [fullUserJsonMap]);

  console.log('NODESTATS RERENDERED');

  return (
    <View>
      {nodeStats !== undefined ? (
        <IconInput
          name={nodeStats.id}
          iconName={iconName}
          isSelected={true}
          selectedColor={theme.colors.pastelPurple}>
          <FlexCol>
            {Object.keys(nodeStats)
              .filter((key: string) => key !== ID_KEY)
              .map((key: string) => (
                <MyText key={key}>
                  {key}: {nodeStats[key]}
                </MyText>
              ))}
          </FlexCol>
        </IconInput>
      ) : (
        <MyText>Choose an input...</MyText>
      )}
    </View>
  );
};

export default memo(NodeStats);
