import React, { FC } from "react";
import { TouchableOpacity, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// REDUX
import { RootState } from "../../ssRedux";

// NAVIGATION
import { PROFILE_SCREEN_NAME, ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME, SETTINGS_SCREEN_NAME } from "../../ssNavigation/constants";
import { StackNavigatorNavigationProp, StackNavigatorParamList } from "../../ssNavigation/StackNavigator";
import { setNewSliceName } from "../../ssRedux/createSidewaysSlice";
import { setSearchedSliceName } from "../../ssRedux/readSidewaysSlice";
import MyTextInput from "../ReactNative/MyTextInput";
import MyText from "../ReactNative/MyText";
import MyButton from "../ReactNative/MyButton";
import { BackButton, PlusButton, ProfileButton, SettingsButton } from "../../ssNavigation/components/Buttons";
import { FlexRow } from "../Flex";
import { useTheme } from "styled-components";
import HorizontalSpace, { HorizontalSpaceProps } from "../Spacing/HorizontalSpace";

type ProfileNavButton<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createProfileNavButton: FC<ProfileNavButton<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const theme = useTheme();

    return (
        <ProfileButton
            alignItems="center"
            marginRight={10}
            onPress={() => navigation.navigate(PROFILE_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg, color: theme.colors.darkRed }}>Profile</MyText>
        </ProfileButton>
    );
};

type ActiveSliceNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createActiveSliceNavButton: FC<ActiveSliceNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    
    const theme = useTheme();
    
    return (
        <MyButton
            onPress={() => navigation.navigate(ACTIVE_SLICE_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>{activeSliceName || 'Choose Slice...'}</MyText>
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>Search</MyText>
        </MyButton>
    );
};

type ActiveSliceNavInputProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createActiveSliceNavInput: FC<ActiveSliceNavInputProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const dispatch = useDispatch();

    const handleChangeText = (newText: string) => {
        dispatch(setSearchedSliceName(newText));
    };

    return (
        <MyTextInput
            placeholder='Find Slice...'
            value={searchedSliceName}
            onChangeText={handleChangeText}
        />
    );
};

type AddSliceNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createAddSliceNavButton: FC<AddSliceNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    return (
        <PlusButton onPress={() => navigation.navigate(ADD_SLICE_SCREEN_NAME, { inputSliceName: '???' })} />
    );
};

type AddSliceNavInputProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createAddSliceNavInput: FC<AddSliceNavInputProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const { newSliceName, possibleOutputs, createdSignature } = useSelector((state: RootState) => ({ ...state.createSidewaysSlice }));
    const dispatch = useDispatch();

    const handleChangeText = (newText: string) => {
        dispatch(setNewSliceName(newText));
    };

    return (
        <MyTextInput
            placeholder='New Slice name...'
            value={newSliceName}
            onChangeText={handleChangeText}
        />
    );
};

type SettingsNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createSettingsNavButton: FC<SettingsNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const theme = useTheme();

    return (
        <SettingsButton
            alignItems="center"
            marginLeft={10}
            front={false}
            onPress={() => navigation.navigate(SETTINGS_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg, color: theme.colors.darkRed }}>Settings</MyText>
        </SettingsButton>
    );
};

type GoBackNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createGoBackNavButton: FC<GoBackNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    return (
        <BackButton
            onPress={() => navigation.goBack()}
        />
    );
};

type GoNavButtonProps = {
    onPress: () => void;
};
const createGoNavButton: FC<GoNavButtonProps> = (props) => {
    const { onPress } = props;

    return (
        <BackButton
            {...props}
            onPress={onPress}
        />
    );
};

type EmptySpaceProps = {} & HorizontalSpaceProps;
const createEmptySpace: FC<EmptySpaceProps> = (props) => {
    const { spacing } = props;

    return (
        <HorizontalSpace spacing={spacing} />
    )
}

export const PROFILE_BUTTON = 'PROFILE_BUTTON';
export const ACTIVE_SLICE_BUTTON = 'ACTIVE_SLICE_BUTTON';
export const ADD_SLICE_BUTTON = 'ADD_SLICE_BUTTON';
export const SETTINGS_BUTTON = 'SETTINGS_BUTTON';
export const ACTIVE_SLICE_INPUT = 'ACTIVE_SLICE_INPUT';
export const ADD_SLICE_INPUT = 'ADD_SLICE_INPUT';
export const GO_BACK_BUTTON = 'GO_BACK_BUTTON';
export const GO_NAV_BUTTON = 'GO_NAV_BUTTON';
export const EMPTY_SPACE = 'EMPTY_SPACE';

type ComponentCreatorKeys = typeof PROFILE_BUTTON | typeof ACTIVE_SLICE_BUTTON | typeof ADD_SLICE_BUTTON | typeof SETTINGS_BUTTON | typeof ACTIVE_SLICE_INPUT | typeof ADD_SLICE_INPUT | typeof GO_BACK_BUTTON | typeof GO_NAV_BUTTON | typeof EMPTY_SPACE;

const componentCreator: Record<ComponentCreatorKeys, FC<any>> = {
    [PROFILE_BUTTON]: createProfileNavButton,
    [ACTIVE_SLICE_BUTTON]: createActiveSliceNavButton,
    [ADD_SLICE_BUTTON]: createAddSliceNavButton,
    [SETTINGS_BUTTON]: createSettingsNavButton,

    [ACTIVE_SLICE_INPUT]: createActiveSliceNavInput,
    [ADD_SLICE_INPUT]: createAddSliceNavInput,

    [GO_BACK_BUTTON]: createGoBackNavButton,
    [GO_NAV_BUTTON]: createGoNavButton,

    [EMPTY_SPACE]: createEmptySpace,
};

export default componentCreator;
