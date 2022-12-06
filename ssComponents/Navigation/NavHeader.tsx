import React, {FC, useContext} from 'react';

// NAVIGATION
import {
  PROFILE_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
  TAB_NAV_NAME,
} from '../../ssNavigation/constants';

// COMPONENTS
import FlexRow from '../Flex/FlexRow';
import {
  ActiveSliceNavButton,
  ActiveSliceNavInput,
  AddSliceNavButton,
  AddSliceNavInput,
  EmptySpace,
  GoBackNavButton,
  GoNavButton,
  ProfileNavButton,
  SettingsNavButton,
} from './NavHeaderComponents';
import {RequireActiveSliceContext} from 'ssContexts/RequireActiveSlice/RequireActiveSlice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigatorNavigationProp} from 'ssNavigation/StackNavigator';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';

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

  const {remainingHeight} = useTabBarHeight();

  return (
    <FlexRow
      style={{height: (remainingHeight * 10) / 100}}
      justifyContent={justifyContent}>
      {children}
    </FlexRow>
  );
};

type TabNavHeaderProps = {};
export const TabNavHeader: FC<TabNavHeaderProps> = props => {
  const navigation: StackNavigatorNavigationProp = useNavigation();

  return (
    <NavHeader>
      <ProfileNavButton />
      <ActiveSliceNavButton />
      <SettingsNavButton />
    </NavHeader>
  );
};

type ActiveSliceHeaderProps = {};
export const ActiveSliceNavHeader: FC<ActiveSliceHeaderProps> = props => {
  const {} = useContext(RequireActiveSliceContext);

  return (
    <NavHeader>
      <GoBackNavButton />
      <ActiveSliceNavInput />
      <AddSliceNavButton />
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

  const {} = useContext(RequireActiveSliceContext);

  return (
    <NavHeader justifyContent={justifyContent}>
      <GoBackNavButton />
      <AddSliceNavInput />
      <EmptySpace />
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

  return (
    <NavHeader justifyContent={justifyContent}>
      <GoBackNavButton
        style={{
          paddingTop: 15,
          paddingLeft: 15,
        }}
      />
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

  return (
    <NavHeader justifyContent={justifyContent}>
      <GoBackNavButton
        style={{
          paddingTop: 15,
          paddingLeft: 15,
        }}
      />
    </NavHeader>
  );
};
