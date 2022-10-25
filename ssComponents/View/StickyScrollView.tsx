import React, {FC, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

export type ScrollAction = {
  minY: number;
  maxY: number;
  cb: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  resetCb: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};
type StickyScrollViewProps = {
  stickyHeaderIndices: number[];
  children: React.ReactNode;

  scrollActions?: ScrollAction[];
} & ScrollViewProps;

const StickyScrollView: FC<StickyScrollViewProps> = props => {
  const {stickyHeaderIndices, children, scrollActions = []} = props;

  const unfiredActions = new Set<ScrollAction>(scrollActions);
  const firedActions = new Set<ScrollAction>();

  const executeUnfiredActions = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    // 1. Get scroll y
    const y = event.nativeEvent.contentOffset.y;

    // 2. For each unfired action
    for (const unfiredAction of Array.from(unfiredActions)) {
      const {minY, maxY, cb} = unfiredAction;

      if (y >= minY && y < maxY) {
        // 3. Execute action
        cb(event);

        // 4. Mark as executed
        unfiredActions.delete(unfiredAction);
        firedActions.add(unfiredAction);
      }
    }
  };

  const unmarkFiredActions = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    // 1. Get scroll y
    const y = event.nativeEvent.contentOffset.y;

    // 2. For each unfired action
    for (const firedAction of Array.from(firedActions)) {
      const {minY, resetCb} = firedAction;

      if (y < minY) {
        // 3. Reset action
        resetCb(event);

        // 4. Unmark as executed
        firedActions.delete(firedAction);
        unfiredActions.add(firedAction);
      }
    }
  };

  return (
    <ScrollView
      stickyHeaderIndices={stickyHeaderIndices}
      showsVerticalScrollIndicator={false}
      onScroll={event => {
        // 1. Check which actions to fire
        executeUnfiredActions(event);

        // 2. Check which actions can refire
        unmarkFiredActions(event);
      }}>
      {children}
    </ScrollView>
  );
};

export default StickyScrollView;
