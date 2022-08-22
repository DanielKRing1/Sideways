import React, { FC, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';

// REDUX
import { RootState } from '../../../redux';
import { forceSignatureRerender, setSliceName, addPossibleOutput, removePossibleOutput, setPossibleOutputs, startCreate } from '../../../redux/createSidewaysSlice';

// NAVIGATION
import { ADD_SLICE_SCREEN_NAME } from '../../../navigation/constants';
import { StackNavigatorProps } from '../../../navigation/StackNavigator';

// COMPONENTS
import Todo from '../../../components/Dev/Todo';
import { GrowingList } from '../../../components/Input/GrowingInputList';

// NAV
import { AddSliceNavHeader } from '../../../components/Navigation/NavHeader';
import MyTextInput from '../../../components/ReactNative/MyTextInput';

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

    // REDUX
    const { searchedSliceName } = useSelector((state: RootState) => state.readSidewaysSlice.toplevelReadReducer);
    const { createdSignature, possibleOutputs, sliceName } = useSelector((state: RootState) => state.createSidewaysSlice);
    const dispatch = useDispatch();

    // UPDATE REDUX STATE
    useEffect(() => {
        dispatch(setSliceName(searchedSliceName));
    }, []);

    // HANDLER METHODS
    const handleAddInput = (newPossibleInput: string) => {
        dispatch(addPossibleOutput(newPossibleInput));
    };
    const handleUpdateInput = (newText: string, index: number) => {
        possibleOutputs[index] = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setPossibleOutputs(possibleOutputs));
    }
    
    return (
        <View>
            <AddSliceNavHeader/>

            <Todo name='Possible outputs growing input'/>
            <GrowingList
                data={possibleOutputs}
                createRenderItemComponent={createRenderItemComponent}
                keyExtractor={(dataPoint: string) => ''}
                genNextDataPlaceholder={() => ''}
                handleUpdateInput={handleUpdateInput}
                handleAddInput={handleAddInput}
            />
        </View>
    )
}

export default AddSliceScreen;
