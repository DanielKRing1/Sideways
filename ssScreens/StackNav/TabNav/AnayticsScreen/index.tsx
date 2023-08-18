import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';

import {RootState} from '../../../../ssRedux';
import ViewSelector from './components/ViewSelector';
import {IdentityViewName, RecoViewName, TimeseriesViewName} from './constants';
import StatsScreen from './IdentityView';
import RecommendationScreen from './RecoView';
import Timeseries from './TimeseriesView';

// Possible outputs

type GraphViewScreenProps = {};
const GraphViewScreen: FC<GraphViewScreenProps> = props => {
  const {} = props;

  // WINDOW DIMENSIONS
  const {remainingHeight} = useTabBarHeight();

  // REDUX
  const {selectedView} = useSelector(
    (state: RootState) => state.appState.selectedAnalytics,
  );

  const renderSwitch = useMemo(() => {
    switch (selectedView) {
      case IdentityViewName:
        return <StatsScreen />;
      case RecoViewName:
        return <RecommendationScreen />;
      case TimeseriesViewName:
        return <Timeseries />;
    }
  }, [selectedView]);

  console.log('ANALYTICSSCREEN RERENDERING');

  return (
    <View
      style={{
        height: '100%',
      }}>
      <TabNavHeader />
      <ViewSelector />

      {renderSwitch}
    </View>
  );
};

export default GraphViewScreen;
