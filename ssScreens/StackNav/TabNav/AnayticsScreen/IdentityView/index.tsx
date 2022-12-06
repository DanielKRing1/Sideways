import React, {FC, useEffect, memo} from 'react';

import StickyScrollView from '../../../../../ssComponents/View/StickyScrollView';
import {BoxShadow} from '../../../../../ssComponents/Shadow/BoxShadow';
import IdentityNodes from './components/IdentityNodes';
import NodeInput from './components/NodeInput';
import InputNodeStats from './components/InputNodeStats';
import CollectivelyTandemNodes from './components/CollectivelyTandemNodes';
import SinglyTandemNodes from './components/SinglyTandemNodes';
import HighlyRatedTandemNodes from './components/HighlyRatedNodes';
import {AppDispatch} from 'ssRedux/index';
import {useDispatch} from 'react-redux';
import {startAssureFreshness as startAssureIdentityFreshness} from 'ssRedux/analyticsSlice/identityStatsSlice';
import MyText from 'ssComponents/ReactNative/MyText';
import DismissKeyboardView from 'ssComponents/View/DismissKeyboardView';

type StatsScreenProps = {};
const StatsScreen: FC<StatsScreenProps> = () => {
  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // Assure chart freshness:
  //  Update charts if activeSliceName is different from analyzedSliceName or if !isFresh
  //
  //  Check freshness when mounting this component.
  //  Freshness currently will not change while this component is mounted
  useEffect(() => {
    dispatch(startAssureIdentityFreshness());
  }, []);

  console.log('IDENTITYVIEW RERENDERING');

  return (
    <DismissKeyboardView
      style={{
        backgroundColor: 'yellow',
        flex: 1,
      }}>
      {/* <StickyScrollView stickyHeaderIndices={[1]}> */}
      <StickyScrollView
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[1]}>
        {/* Index 0 PageRank Stats */}
        <BoxShadow>
          <IdentityNodes />
        </BoxShadow>

        {/* Index 1 Choose Input */}
        <NodeInput />

        {/* Index 2 Node Stats */}
        <BoxShadow>
          <InputNodeStats />
        </BoxShadow>

        {/* Index 3 Collectively Tandem Nodes */}
        <BoxShadow>
          <CollectivelyTandemNodes />
        </BoxShadow>

        {/* Index 4 Singly Tandem Node */}
        <BoxShadow>
          <SinglyTandemNodes />
        </BoxShadow>

        {/* Index 5 Highly Rated Tandem Nodes */}
        <BoxShadow>
          <HighlyRatedTandemNodes />
        </BoxShadow>
      </StickyScrollView>
    </DismissKeyboardView>
  );
};

export default memo(StatsScreen);
