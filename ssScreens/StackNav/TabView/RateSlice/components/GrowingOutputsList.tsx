import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';

import GrowingIdList from '../../../../../ssComponents/Input/GrowingIdList';
import { FlexRow } from 'ssComponents/Flex';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';
import MyText from '../../../../../ssComponents/ReactNative/MyText';

// REDUX
import { RootState } from '../../../../../ssRedux';
import { addOutput, setOutputs, removeOutput, forceSignatureRerender } from '../../../../../ssRedux/rateSidewaysSlice';
import { GrowingIdText as RateInput } from '../../../../../ssComponents/Input/GrowingIdList';
import MyButton from 'ssComponents/ReactNative/MyButton';

const StyledTextOutput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createOutputsRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <FlexRow>
        <StyledTextOutput
            placeholder={'Anotha output...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />
        
        <MyButton
            onPress={() => removeOutput(index)}
        >
            <MyText>X</MyText>
        </MyButton>
    </FlexRow>
);

const GrowingOutputsList: FC = (props) => {
    
    // REDUX
    const { ratedSignature, outputs } = useSelector((state: RootState) => state.rateSidewaysSlice);
    const dispatch = useDispatch();

    // HANDLER METHODS
    const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddOutput = (id: number, newOutputOption: string) => {
        dispatch(addOutput({ id, text: newOutputOption }));
    };
    const handleUpdateOutput = (newText: string, index: number) => {
        outputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setOutputs(outputs));
    };

    return (
        <GrowingIdList
            data={outputs}
            createRenderItemComponent={createOutputsRenderItemComponent}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateOutput}
            handleAddInput={handleAddOutput}
        />
    );
}

export default GrowingOutputsList;
