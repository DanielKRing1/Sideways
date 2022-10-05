import React, { FC, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

// REDUX
import { RootState } from '../../../../ssRedux';
import { forceSignatureRerender, setNewSliceName, addPossibleOutput, removePossibleOutput, setPossibleOutputs, startCreateSlice } from '../../../../ssRedux/createSidewaysSlice';

// NAVIGATION
import { ADD_SLICE_SCREEN_NAME } from '../../../../ssNavigation/constants';
import { StackNavigatorProps } from '../../../../ssNavigation/StackNavigator';

// COMPONENTS
import Todo from '../../../../ssComponents/Dev/Todo';
import GrowingIdList, { GrowingIdText } from '../../../../ssComponents/Input/GrowingIdList';
import { GrowingIdText as NewSliceOutput } from '../../../../ssComponents/Input/GrowingIdList';

// NAV
import { AddSliceNavHeader } from '../../../../ssComponents/Navigation/NavHeader';
import MyTextInput from '../../../../ssComponents/ReactNative/MyTextInput';
import MyButton from '../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../ssComponents/ReactNative/MyText';
import { FlexCol } from '../../../../ssComponents/Flex';
import VerticalSpace from '../../../../ssComponents/Spacing/VerticalSpace';

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

type GrowingPossibleOutputsProps = {};
const GrowingPossibleOutputs: FC<GrowingPossibleOutputsProps> = (props) => {

    // REDUX
    const { searchedSliceName } = useSelector((state: RootState) => state.readSidewaysSlice.toplevelReadReducer);
    const { createdSignature, possibleOutputs, newSliceName } = useSelector((state: RootState) => state.createSidewaysSlice);
    const dispatch = useDispatch();

    // UPDATE REDUX STATE
    useEffect(() => {
        dispatch(setNewSliceName(searchedSliceName));
    }, []);

    // HANDLER METHODS
    const keyExtractor = (dataPoint: NewSliceOutput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddOutput = (id: number, newPossibleOutput: string) => {
        dispatch(addPossibleOutput({ id, text: newPossibleOutput }));
    };
    const handleUpdateOutput = (newText: string, index: number) => {
        possibleOutputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setPossibleOutputs(possibleOutputs));
    }
    
    return (
        <GrowingIdList
            data={possibleOutputs}
            createRenderItemComponent={createRenderItemComponent}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateOutput}
            handleAddInput={handleAddOutput}
        />
    );
}

export default GrowingPossibleOutputs;
