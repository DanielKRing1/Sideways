import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlexRow } from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import styled, { DefaultTheme } from 'styled-components/native';
import GrowingIdList from '../../../../../ssComponents/Input/GrowingIdList';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';

// REDUX
import { RootState } from '../../../../../ssRedux';
import { addInput, setInputs, removeInput, forceSignatureRerender, RateInput } from '../../../../../ssRedux/rateSidewaysSlice';

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createInputsRenderItemComponent = (deleteInput: (index: number) => void) => (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <FlexRow>
        <StyledTextInput
            placeholder={'Anotha input...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />

        <MyButton
            onPress={() => deleteInput(index)}
        >
            <MyText>X</MyText>
        </MyButton>
    </FlexRow>
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

    return (
        <GrowingIdList
            data={inputs}
            createRenderItemComponent={createInputsRenderItemComponent((index: number) => dispatch(removeInput(index)))}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateInput}
            handleAddInput={handleAddInput}
        />
    );
}

export default GrowingInputList;
