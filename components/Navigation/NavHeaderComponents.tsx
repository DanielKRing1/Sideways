import React, { FC } from "react";
import { TouchableOpacity, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// REDUX
import { RootState } from "../../redux";

// NAVIGATION
import { PROFILE_SCREEN_NAME, ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME, SETTINGS_SCREEN_NAME } from "../../navigation/constants";
import { StackNavigatorNavigationProp, StackNavigatorParamList } from "../../navigation/StackNavigator";
import { setSliceName } from "../../redux/createSidewaysSlice";
import { setSearchedSliceName } from "../../redux/readSidewaysSlice";
import MyTextInput from "../ReactNative/MyTextInput";
import MyText from "../ReactNative/MyText";
import { theme } from "../../theme/theme";
import BackButton from "../../navigation/components/Buttons/BackButton";

type ProfileNavButton<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createProfileNavButton: FC<ProfileNavButton<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(PROFILE_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>{'<- Profile'}</MyText>
        </TouchableOpacity>
    );
};

type ActiveSliceNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createActiveSliceNavButton: FC<ActiveSliceNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(ACTIVE_SLICE_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>{activeSliceName || 'Choose Slice...'}</MyText>
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>Search</MyText>
        </TouchableOpacity>
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
        <TouchableOpacity
            onPress={() => navigation.navigate(
                            ADD_SLICE_SCREEN_NAME as keyof StackNavigatorParamList,
                            { inputSliceName: '???' })
                    }
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>+</MyText>
        </TouchableOpacity>
    );
};

type AddSliceNavInputProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createAddSliceNavInput: FC<AddSliceNavInputProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    const { sliceName, possibleOutputs, createdSignature } = useSelector((state: RootState) => ({ ...state.createSidewaysSlice }));
    const dispatch = useDispatch();

    const handleChangeText = (newText: string) => {
        dispatch(setSliceName);
    };

    return (
        <MyTextInput
            placeholder='New Slice name...'
            value={sliceName}
            onChangeText={handleChangeText}
        />
    );
};

type SettingsNavButtonProps<PreviousScreen extends keyof StackNavigatorParamList> = {
    navigation: StackNavigatorNavigationProp<PreviousScreen>;
};
const createSettingsNavButton: FC<SettingsNavButtonProps<keyof StackNavigatorParamList>> = (props) => {
    const { navigation } = props;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(SETTINGS_SCREEN_NAME)}
        >
            <MyText style={{ fontWeight: 'bold', fontSize: theme.fontSizes.lg }}>{'Settings ->'}</MyText>
        </TouchableOpacity>
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

export const PROFILE_BUTTON = 'PROFILE_BUTTON';
export const ACTIVE_SLICE_BUTTON = 'ACTIVE_SLICE_BUTTON';
export const ADD_SLICE_BUTTON = 'ADD_SLICE_BUTTON';
export const SETTINGS_BUTTON = 'SETTINGS_BUTTON';
export const ACTIVE_SLICE_INPUT = 'ACTIVE_SLICE_INPUT';
export const ADD_SLICE_INPUT = 'ADD_SLICE_INPUT';
export const GO_BACK_BUTTON = 'GO_BACK_BUTTON';

type ComponentCreatorKeys = typeof PROFILE_BUTTON | typeof ACTIVE_SLICE_BUTTON | typeof ADD_SLICE_BUTTON | typeof SETTINGS_BUTTON | typeof ACTIVE_SLICE_INPUT | typeof ADD_SLICE_INPUT | typeof GO_BACK_BUTTON;

const componentCreator: Record<ComponentCreatorKeys, FC<any>> = {
    [PROFILE_BUTTON]: createProfileNavButton,
    [ACTIVE_SLICE_BUTTON]: createActiveSliceNavButton,
    [ADD_SLICE_BUTTON]: createAddSliceNavButton,
    [SETTINGS_BUTTON]: createSettingsNavButton,

    [ACTIVE_SLICE_INPUT]: createActiveSliceNavInput,
    [ADD_SLICE_INPUT]: createAddSliceNavInput,

    [GO_BACK_BUTTON]: createGoBackNavButton,
};

export default componentCreator;
