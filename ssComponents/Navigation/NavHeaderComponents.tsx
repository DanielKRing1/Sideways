import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// REDUX
import {RootState} from '../../ssRedux';

// NAVIGATION
import {
  PROFILE_SCREEN_NAME,
  ACTIVE_SLICE_SCREEN_NAME,
  ADD_SLICE_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
} from '../../ssNavigation/constants';
import {
  StackNavigatorNavigationProp,
  StackNavigatorParamList,
} from '../../ssNavigation/StackNavigator';
import {setNewSliceName} from '../../ssRedux/createSidewaysSlice';
import {setSearchedSliceName} from '../../ssRedux/readSidewaysSlice';
import MyTextInput from '../ReactNative/MyTextInput';
import MyText from '../ReactNative/MyText';
import MyButton from '../ReactNative/MyButton';
import {
  BackButton,
  PlusButton,
  ProfileButton,
  SettingsButton,
} from '../../ssNavigation/components/Buttons';
import {useTheme} from 'styled-components';
import HorizontalSpace, {
  HorizontalSpaceProps,
} from '../Spacing/HorizontalSpace';
import {useWindowDimensions, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useActiveSliceState} from 'ssContexts/RequireActiveSlice/hooks/useActiveSliceState';
import {ActiveSliceState} from 'ssContexts/constants';
import {setNewCategorySetName} from 'ssRedux/createCategorySetSlice';

type ProfileNavButton = {};
export const ProfileNavButton: FC<ProfileNavButton> = props => {
  const navigation: StackNavigatorNavigationProp = useNavigation();

  const theme = useTheme();
  const {height} = useWindowDimensions();

  return (
    <ProfileButton
      alignItems="center"
      marginRight={10}
      onPress={() => navigation.navigate(PROFILE_SCREEN_NAME)}>
      <MyText
        style={{
          fontWeight: 'bold',
          fontSize: height / theme.fontSizeDivisors.md,
          color: theme.colors.darkRed,
        }}>
        Profile
      </MyText>
    </ProfileButton>
  );
};

type ActiveSliceNavButtonProps = {};
export const ActiveSliceNavButton: FC<ActiveSliceNavButtonProps> = props => {
  const navigation: StackNavigatorNavigationProp = useNavigation();

  const {activeSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  const theme = useTheme();
  const {height} = useWindowDimensions();

  return (
    <MyButton onPress={() => navigation.navigate(ACTIVE_SLICE_SCREEN_NAME)}>
      <MyText
        style={{
          fontWeight: 'bold',
          fontSize: height / theme.fontSizeDivisors.md,
        }}>
        {activeSliceName || 'Select Slice...'}
      </MyText>
    </MyButton>
  );
};

type ActiveSliceNavInputProps = {};
export const ActiveSliceNavInput: FC<ActiveSliceNavInputProps> = props => {
  const {activeSliceName, searchedSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch = useDispatch();

  const handleChangeText = (newText: string) => {
    dispatch(setSearchedSliceName(newText));
  };

  return (
    <MyTextInput
      placeholder="Find Slice..."
      value={searchedSliceName}
      onChangeText={handleChangeText}
    />
  );
};

type AddSliceNavButtonProps = {};
export const AddSliceNavButton: FC<AddSliceNavButtonProps> = props => {
  const navigation: StackNavigatorNavigationProp = useNavigation();

  return (
    <PlusButton
      onPress={() =>
        navigation.navigate(ADD_SLICE_SCREEN_NAME, {inputSliceName: '???'})
      }
    />
  );
};

type AddSliceNavInputProps = {};
export const AddSliceNavInput: FC<AddSliceNavInputProps> = props => {
  const {newSliceName, createdSignature} = useSelector(
    (state: RootState) => state.createSidewaysSlice,
  );
  const dispatch = useDispatch();

  const handleChangeText = (newText: string) => {
    dispatch(setNewSliceName(newText));
  };

  return (
    <MyTextInput
      placeholder="New Slice name..."
      value={newSliceName}
      onChangeText={handleChangeText}
    />
  );
};

type AddCategorySetNavInputProps = {};
export const AddCategorySetNavInput: FC<
  AddCategorySetNavInputProps
> = props => {
  const {categorySetName, createdSignature} = useSelector(
    (state: RootState) => state.createCategorySetSlice,
  );
  const dispatch = useDispatch();

  const handleChangeText = (newText: string) => {
    dispatch(setNewCategorySetName(newText));
  };

  return (
    <MyTextInput
      placeholder="New Category Set name..."
      value={categorySetName}
      onChangeText={handleChangeText}
    />
  );
};

// TODO: Remove this?
// type AddInputNavInputProps = {};
// export const AddInputNavInput: FC<AddInputNavInputProps> = props => {
//   const {} = useSelector((state: RootState) => (state.rateSidewaysSlice));
//   const dispatch = useDispatch();

//   const handleChangeText = (newText: string) => {
//     dispatch(setNewSliceName(newText));
//   };

//   return (
//     <MyTextInput
//       placeholder="New Slice name..."
//       value={newSliceName}
//       onChangeText={handleChangeText}
//     />
//   );
// };

type SettingsNavButtonProps = {};
export const SettingsNavButton: FC<SettingsNavButtonProps> = props => {
  const navigation: StackNavigatorNavigationProp = useNavigation();

  const theme = useTheme();
  const {height} = useWindowDimensions();

  return (
    <SettingsButton
      alignItems="center"
      marginLeft={10}
      front={false}
      onPress={() => navigation.navigate(SETTINGS_SCREEN_NAME)}>
      <MyText
        style={{
          fontWeight: 'bold',
          fontSize: height / theme.fontSizeDivisors.md,
          color: theme.colors.darkRed,
        }}>
        Settings
      </MyText>
    </SettingsButton>
  );
};

type GoBackNavButtonProps = {
  style?: ViewStyle;
};
export const GoBackNavButton: FC<GoBackNavButtonProps> = props => {
  const {style} = props;

  // HANDLERS
  const handleGoBack = (navigation: StackNavigatorNavigationProp) => {
    navigation.goBack();
  };

  return <_GoBackNavButtonBase onGoBack={handleGoBack} style={style} />;
};

type GoBackValidSliceNavButtonProps = {
  style?: ViewStyle;
};
export const GoBackValidSliceNavButton: FC<
  GoBackValidSliceNavButtonProps
> = props => {
  const {style} = props;

  // HOOKS: ACTIVE SLICE STATUS
  const {activeSliceState} = useActiveSliceState();

  // HANDLERS
  const handleGoBack = (navigation: StackNavigatorNavigationProp) => {
    if (activeSliceState === ActiveSliceState.VALID_ACTIVE_SLICE)
      navigation.goBack();
  };

  return <_GoBackNavButtonBase onGoBack={handleGoBack} style={style} />;
};

type GoBackAvailableSliceNavButtonProps = {
  style?: ViewStyle;
};
export const GoBackAvailableSliceNavButton: FC<
  GoBackAvailableSliceNavButtonProps
> = props => {
  const {style} = props;

  // HOOKS: ACTIVE SLICE STATUS
  const {activeSliceState} = useActiveSliceState();

  // HANDLERS
  const handleGoBack = (navigation: StackNavigatorNavigationProp) => {
    if (activeSliceState !== ActiveSliceState.NO_AVAILABLE_SLICES)
      navigation.goBack();
  };

  return <_GoBackNavButtonBase onGoBack={handleGoBack} style={style} />;
};

type _GoBackNavButtonBaseProps = {
  style?: ViewStyle;
  onGoBack: (navigation: StackNavigatorNavigationProp) => void;
};
const _GoBackNavButtonBase: FC<_GoBackNavButtonBaseProps> = props => {
  const {style, onGoBack} = props;

  // NAVIGATION
  const navigation: StackNavigatorNavigationProp = useNavigation();

  // HANDLERS
  const handleGoBack = () => {
    onGoBack(navigation);
  };

  return <BackButton onPress={handleGoBack} style={style} />;
};

type GoNavButtonProps = {
  style?: ViewStyle;
  screenName: keyof StackNavigatorParamList;
};
export const GoNavButton: FC<GoNavButtonProps> = props => {
  const {style, screenName} = props;

  // HOOKS: ACTIVE SLICE STATUS
  const {activeSliceState} = useActiveSliceState();

  // NAVIGATION
  const navigation: StackNavigatorNavigationProp = useNavigation();

  // HANDLERS
  const handleGoNav = () => {
    console.log(activeSliceState === ActiveSliceState.VALID_ACTIVE_SLICE);
    if (activeSliceState === ActiveSliceState.VALID_ACTIVE_SLICE)
      navigation.navigate(screenName);
  };

  return (
    <>
      <BackButton {...props} onPress={handleGoNav} style={style} />
      <MyText>{activeSliceState}</MyText>
    </>
  );
};

type EmptySpaceProps = {} & HorizontalSpaceProps;
export const EmptySpace: FC<EmptySpaceProps> = props => {
  const {spacing} = props;

  return <HorizontalSpace spacing={spacing} />;
};

export const PROFILE_BUTTON = 'PROFILE_BUTTON';
export const ACTIVE_SLICE_BUTTON = 'ACTIVE_SLICE_BUTTON';
export const ADD_SLICE_BUTTON = 'ADD_SLICE_BUTTON';
export const SETTINGS_BUTTON = 'SETTINGS_BUTTON';
export const ACTIVE_SLICE_INPUT = 'ACTIVE_SLICE_INPUT';
export const ADD_SLICE_INPUT = 'ADD_SLICE_INPUT';
export const GO_BACK_BUTTON = 'GO_BACK_BUTTON';
export const GO_NAV_BUTTON = 'GO_NAV_BUTTON';
export const EMPTY_SPACE = 'EMPTY_SPACE';
