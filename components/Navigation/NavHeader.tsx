import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// REDUX
import { RootState } from '../../redux';

// NAVIGATION
import { StackNavigatorNavigationProp } from '../../navigation/StackNavigator';
import { TABS_SCREEN_NAME } from '../../navigation/constants';

// COMPONENTS
import FlexRow from '../Flex/FlexRow';
import NavComponentCreator, { ACTIVE_SLICE_BUTTON, ACTIVE_SLICE_INPUT, ADD_SLICE_BUTTON, ADD_SLICE_INPUT, GO_BACK_BUTTON, PROFILE_BUTTON, SETTINGS_BUTTON } from './NavHeaderComponents';

type NavHeaderType = {
  children: React.ReactNode;
  justifyContent?: "space-around" | "flex-start" | "flex-end" | "center" | "space-between" | "space-evenly";
};
const NavHeader: FC<NavHeaderType> = (props) => {
  const { children, justifyContent='space-around' } = props;

  // NAVIGATION
  const navigation = useNavigation<StackNavigatorNavigationProp<typeof TABS_SCREEN_NAME>>();

  // REDUX ACTIVE SLICE
  const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
  
  return (
    <FlexRow
      justifyContent={justifyContent}
    >
      {children}
    </FlexRow>
  );
}

type TabNavHeaderProps = {};
export const TabNavHeader: FC<TabNavHeaderProps> = (props) => {
  const navigation = useNavigation<StackNavigatorNavigationProp<typeof TABS_SCREEN_NAME>>();
  
  return (
    <NavHeader>
      {
        [
          <NavComponentCreator.PROFILE_BUTTON key={PROFILE_BUTTON} navigation={navigation}/>,
          <NavComponentCreator.ACTIVE_SLICE_BUTTON key={ACTIVE_SLICE_BUTTON} navigation={navigation}/>,
          <NavComponentCreator.SETTINGS_BUTTON key={SETTINGS_BUTTON} navigation={navigation}/>,
        ]
      }
    </NavHeader>
  );
};

type ActiveSliceHeaderProps = {};
export const ActiveSliceNavHeader: FC<ActiveSliceHeaderProps> = (props) => {
  const navigation = useNavigation<StackNavigatorNavigationProp<typeof TABS_SCREEN_NAME>>();
  
  return (
    <NavHeader>
      {
        [
          <NavComponentCreator.GO_BACK_BUTTON key={GO_BACK_BUTTON} navigation={navigation}/>,
          <NavComponentCreator.ACTIVE_SLICE_INPUT key={ACTIVE_SLICE_INPUT} navigation={navigation}/>,
          <NavComponentCreator.ADD_SLICE_BUTTON key={ADD_SLICE_BUTTON} navigation={navigation}/>,
        ]
      }
    </NavHeader>
  );
};

type AddSliceHeaderProps = {
  justifyContent?: "space-around" | "flex-start" | "flex-end" | "center" | "space-between" | "space-evenly";
};
export const AddSliceNavHeader: FC<AddSliceHeaderProps> = (props) => {
  const { justifyContent='space-around' } = props;

  const navigation = useNavigation<StackNavigatorNavigationProp<typeof TABS_SCREEN_NAME>>();
  
  return (
    <NavHeader justifyContent={justifyContent}>
      {
        [
          <NavComponentCreator.GO_BACK_BUTTON key={GO_BACK_BUTTON} navigation={navigation}/>,
          <NavComponentCreator.ADD_SLICE_INPUT key={ADD_SLICE_INPUT} navigation={navigation}/>,
        ]
      }
    </NavHeader>
  );
};
