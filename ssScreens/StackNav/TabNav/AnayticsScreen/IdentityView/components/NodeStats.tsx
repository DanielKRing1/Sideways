import React, {FC, memo, useMemo} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components/native';
import {ID_KEY, RankedNode} from '@asianpersonn/realm-graph';

import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import {FlexCol, FlexRow} from '../../../../../../ssComponents/Flex';
import {RootState} from 'ssRedux/index';
import {cIdToCD, inToLastCId} from 'ssDatabase/hardware/realm/userJson/utils';
import {GJ_CategoryDecoration} from 'ssDatabase/api/userJson/category/types';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import {DISPLAY_SIZE} from '../../../../../../global';
import IconButton from 'ssComponents/Button/IconButton';
import {getPadding} from 'ssTheme/utils';
import {NODE_ID, stripNodePostfix} from 'ssDatabase/api/types';

export type NodeStatsType = Omit<RankedNode, 'id'> & {id: NODE_ID};
type NodeStatsProps = {
  nodeStats: NodeStatsType;
};
const NodeStats: FC<NodeStatsProps> = props => {
  const {nodeStats} = props;
  console.log('nodeStats-------------------------');
  console.log(nodeStats);

  // THEME
  const theme: DefaultTheme = useTheme();

  // WINDOW
  const {width} = useWindowDimensions();

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );

  const iconName: string = useMemo(() => {
    // NOTE: If id becomes a uuid and is no longer the input name, then get the input name differently
    const inputName: string =
      nodeStats !== undefined ? stripNodePostfix(nodeStats.id).id : '';

    const cId: string = inToLastCId(inputName, fullUserJsonMap, 'nodestats');
    const cd: GJ_CategoryDecoration = cIdToCD(
      activeSliceName,
      cId,
      fullUserJsonMap,
    );

    return cd.icon;
  }, [fullUserJsonMap]);

  // console.log('NODESTATS RERENDERED');

  return (
    <View style={{}}>
      {nodeStats !== undefined ? (
        <MyBorder
          shadow
          paddingTop={DISPLAY_SIZE.sm}
          paddingBottom={DISPLAY_SIZE.sm}
          marginTop={DISPLAY_SIZE.sm}
          marginBottom={DISPLAY_SIZE.sm}
          style={{
            backgroundColor: theme.backgroundColors.main,
          }}>
          <FlexRow justifyContent="space-around">
            <FlexCol>
              <MyText>{stripNodePostfix(nodeStats.id).id}</MyText>

              <IconButton
                disabled
                iconName={iconName}
                displaySize={DISPLAY_SIZE.md}
                color={theme.colors.pastelPurple}
                marginBase={getPadding(DISPLAY_SIZE.xs, width, theme)}
              />
            </FlexCol>

            <MyBorder
              paddingTop={DISPLAY_SIZE.xs}
              paddingBottom={DISPLAY_SIZE.xs}
              marginTop={DISPLAY_SIZE.xs}
              marginBottom={DISPLAY_SIZE.xs}
              style={{
                backgroundColor: theme.backgroundColors.accent,
              }}>
              <FlexCol>
                {Object.keys(nodeStats)
                  .filter((key: string) => key !== ID_KEY)
                  .map((key: string) => (
                    <MyText key={key}>
                      {key}: {`${nodeStats[key]}`.slice(0, 6)}
                    </MyText>
                  ))}
              </FlexCol>
            </MyBorder>
          </FlexRow>
        </MyBorder>
      ) : (
        <MyText>Choose an input...</MyText>
      )}
    </View>
  );
};

export default memo(NodeStats);
