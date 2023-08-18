import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {DISPLAY_SIZE} from '../../../../../global';
import {FlexRow} from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {setSelectedView} from 'ssRedux/appState/selectedAnalytics';
import {AppDispatch, RootState} from 'ssRedux/index';
import {IdentityViewName, RecoViewName, TimeseriesViewName} from '../constants';
import {useTheme} from 'styled-components';
import VerticalSpace from 'ssComponents/Spacing/VerticalSpace';

type ViewSelectorProps = {};
const ViewSelector: FC<ViewSelectorProps> = props => {
  // REDUX
  const {selectedView} = useSelector(
    (state: RootState) => state.appState.selectedAnalytics,
  );
  const dispatch: AppDispatch = useDispatch();

  // THEME
  const theme = useTheme();

  return (
    <>
      <VerticalSpace
        spacing={20}
        style={{
          borderTopWidth: 2,
          borderTopColor: theme.backgroundColors.accent,
        }}
      />

      <FlexRow justifyContent="space-around">
        <MyButton onPress={() => dispatch(setSelectedView(IdentityViewName))}>
          <MyText
            size={DISPLAY_SIZE.lg}
            style={{
              fontWeight: 'bold',
              color:
                selectedView === IdentityViewName
                  ? theme.backgroundColors.accent
                  : theme.colors.lightText,
            }}>
            You
          </MyText>
        </MyButton>

        <MyButton onPress={() => dispatch(setSelectedView(RecoViewName))}>
          <MyText
            size={DISPLAY_SIZE.lg}
            style={{
              fontWeight: 'bold',
              color:
                selectedView === RecoViewName
                  ? theme.backgroundColors.accent
                  : theme.colors.lightText,
            }}>
            Recommend
          </MyText>
        </MyButton>

        <MyButton onPress={() => dispatch(setSelectedView(TimeseriesViewName))}>
          <MyText
            size={DISPLAY_SIZE.lg}
            style={{
              fontWeight: 'bold',
              color:
                selectedView === TimeseriesViewName
                  ? theme.backgroundColors.accent
                  : theme.colors.lightText,
            }}>
            Over Time
          </MyText>
        </MyButton>
      </FlexRow>

      <VerticalSpace
        spacing={20}
        style={{
          borderBottomWidth: 2,
          borderBottomColor: theme.backgroundColors.accent,
        }}
      />
      <VerticalSpace spacing={20} />
    </>
  );
};

export default ViewSelector;
