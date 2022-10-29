import React, {FC, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';

// NAVIGATION
import {StackNavigatorNavigationProp} from '../../ssNavigation/StackNavigator';
import {TABS_SCREEN_NAME} from '../../ssNavigation/constants';

// COMPONENTS
import FlexRow from '../Flex/FlexRow';
import NavComponentCreator, {
  ACTIVE_SLICE_BUTTON,
  ACTIVE_SLICE_INPUT,
  ADD_SLICE_BUTTON,
  ADD_SLICE_INPUT,
  EMPTY_SPACE,
  GO_BACK_BUTTON,
  GO_NAV_BUTTON,
  PROFILE_BUTTON,
  SETTINGS_BUTTON,
} from './NavHeaderComponents';
import {AuthorizedNavContext} from 'ssContexts/RequireActiveSlice/AuthorizedNavProvider';

type NavHeaderType = {
  children: React.ReactNode;
  justifyContent?:
    | 'space-around'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-evenly';
};
const NavHeader: FC<NavHeaderType> = props => {
  const {children, justifyContent = 'space-between'} = props;

  return <FlexRow justifyContent={justifyContent}>{children}</FlexRow>;
};

type TabNavHeaderProps = {};
export const TabNavHeader: FC<TabNavHeaderProps> = props => {
  const {authorizedStackNavigate} = useContext(AuthorizedNavContext);

  return (
    <NavHeader>
      {[
        <NavComponentCreator.PROFILE_BUTTON
          key={PROFILE_BUTTON}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.ACTIVE_SLICE_BUTTON
          key={ACTIVE_SLICE_BUTTON}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.SETTINGS_BUTTON
          key={SETTINGS_BUTTON}
          navigation={authorizedStackNavigate}
        />,
      ]}
    </NavHeader>
  );
};

type ActiveSliceHeaderProps = {};
export const ActiveSliceNavHeader: FC<ActiveSliceHeaderProps> = props => {
  const {authorizedStackNavigate} = useContext(AuthorizedNavContext);

  return (
    <NavHeader>
      {[
        <NavComponentCreator.GO_BACK_BUTTON
          key={GO_BACK_BUTTON}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.ACTIVE_SLICE_INPUT
          key={ACTIVE_SLICE_INPUT}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.ADD_SLICE_BUTTON
          key={ADD_SLICE_BUTTON}
          navigation={authorizedStackNavigate}
        />,
      ]}
    </NavHeader>
  );
};

type AddSliceHeaderProps = {
  justifyContent?:
    | 'space-around'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-evenly';
};
export const AddSliceNavHeader: FC<AddSliceHeaderProps> = props => {
  const {justifyContent = 'space-between'} = props;

  const {authorizedStackNavigate} = useContext(AuthorizedNavContext);

  return (
    <NavHeader justifyContent={justifyContent}>
      {[
        <NavComponentCreator.GO_BACK_BUTTON
          key={GO_BACK_BUTTON}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.ADD_SLICE_INPUT
          key={ADD_SLICE_INPUT}
          navigation={authorizedStackNavigate}
        />,
        <NavComponentCreator.EMPTY_SPACE key={EMPTY_SPACE} />,
      ]}
    </NavHeader>
  );
};

type ProfileHeaderProps = {
  justifyContent?:
    | 'space-around'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-evenly';
};
export const ProfileHeader: FC<ProfileHeaderProps> = props => {
  const {justifyContent = 'flex-start'} = props;

  const {authorizedStackNavigate} = useContext(AuthorizedNavContext);

  return (
    <NavHeader justifyContent={justifyContent}>
      {[
        <NavComponentCreator.GO_NAV_BUTTON
          key={GO_NAV_BUTTON}
          style={{
            paddingTop: 15,
            paddingLeft: 15,
          }}
          onPress={() => authorizedStackNavigate(TABS_SCREEN_NAME)}
        />,
      ]}
    </NavHeader>
  );
};

type SettingsHeaderProps = {
  justifyContent?:
    | 'space-around'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-evenly';
};
export const SettingsHeader: FC<SettingsHeaderProps> = props => {
  const {justifyContent = 'flex-start'} = props;

  const {authorizedStackNavigate} = useContext(AuthorizedNavContext);

  return (
    <NavHeader justifyContent={justifyContent}>
      {[
        <NavComponentCreator.GO_NAV_BUTTON
          key={GO_NAV_BUTTON}
          style={{
            paddingTop: 15,
            paddingLeft: 15,
          }}
          onPress={() => authorizedStackNavigate(TABS_SCREEN_NAME)}
        />,
      ]}
    </NavHeader>
  );
};
