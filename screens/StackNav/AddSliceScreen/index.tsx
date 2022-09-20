import React, { FC, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

// REDUX
import { AppDispatch, RootState } from '../../../redux';
import { forceSignatureRerender, setNewSliceName, addPossibleOutput, removePossibleOutput, setPossibleOutputs, startCreateSlice } from '../../../redux/createSidewaysSlice';

// NAVIGATION
import { ADD_SLICE_SCREEN_NAME } from '../../../navigation/constants';
import { StackNavigatorProps } from '../../../navigation/StackNavigator';

// COMPONENTS

// NAV
import { AddSliceNavHeader } from '../../../components/Navigation/NavHeader';
import MyTextInput from '../../../components/ReactNative/MyTextInput';
import MyButton from '../../../components/ReactNative/MyButton';
import MyText from '../../../components/ReactNative/MyText';
import { FlexCol } from '../../../components/Flex';
import VerticalSpace from '../../../components/Spacing/VerticalSpace';
import GrowingPossibleOutputs from './components/GrowingPossibleOutputs';

// Possible outputs

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <StyledTextInput
        placeholder={'Anotha one...'}
        value={item.title}
        onChangeText={(newText: string) => handleChangeText(newText, index)}
    />
);

const AddSliceScreen: FC<StackNavigatorProps<typeof ADD_SLICE_SCREEN_NAME>> = (props) => {
    const { navigation, route } = props;
    const { inputSliceName } = route.params;

    // THEME
    const theme = useTheme();

    // REDUX
    const { searchedSliceName } = useSelector((state: RootState) => state.readSidewaysSlice.toplevelReadReducer);
    const { createdSignature, possibleOutputs, newSliceName } = useSelector((state: RootState) => state.createSidewaysSlice);
    const dispatch: AppDispatch = useDispatch();

    // UPDATE REDUX STATE
    useEffect(() => {
        dispatch(setNewSliceName(searchedSliceName));
    }, []);
    
    return (
        <View>
            <AddSliceNavHeader/>

            <GrowingPossibleOutputs/>

            <VerticalSpace/>

            <FlexCol alignItems='center'>
                <MyButton
                    style={{
                        width: '80%',
                        borderWidth: 1,
                        borderColor: theme.colors.grayBorder,
                        padding: 10,
                    }}
                    onPress={() => dispatch(startCreateSlice())}
                >
                    <MyText>Create new slice!</MyText>
                </MyButton>
            </FlexCol>
        </View>
    )
}

export default AddSliceScreen;
