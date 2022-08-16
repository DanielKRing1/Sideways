import React, { FC } from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import FlexCol from '../../../../../components/Flex/FlexCol';
import GrowingIdList from '../../../../../components/Input/GrowingIdList';
import MyTextInput from '../../../../../components/Input/MyTextInput';
import MyText from '../../../../../components/Text/MyText';

// REDUX
import { RootState } from '../../../../../redux';
import { addInput, setInputs, setOutputs, startRate, forceSignatureRerender, RateInput } from '../../../../../redux/rateSidewaysSlice';

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createInputsRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <StyledTextInput
        placeholder={'Anotha input...'}
        value={item.title}
        onChangeText={(newText: string) => handleChangeText(newText, index)}
    />
);

const GrowingInputList: FC = (props) => {
    
    // REDUX
    const { ratedSignature, inputs } = useSelector((state: RootState) => state.rateSidewaysSlice);
    const dispatch = useDispatch();

    // HANDLER METHODS
    const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddInput = (id: number, newInputOption: string) => {
        dispatch(addInput({ id, text: newInputOption }));
    };
    const handleUpdateInput = (newText: string, index: number) => {
        inputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setInputs(inputs));
    };

    const startingId: number = inputs.reduce((maxId: number, curVal: RateInput) => Math.max(maxId, curVal.id), 0);

    return (
        <GrowingIdList
            data={inputs}
            createRenderItemComponent={createInputsRenderItemComponent}
            keyExtractor={keyExtractor}
            startingId={startingId}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateInput}
            handleAddInput={handleAddInput}
        />
    );
}

export default GrowingInputList;
