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
import { addOutput, setOutputs, startRate, forceSignatureRerender, RateInput } from '../../../../../redux/rateSidewaysSlice';

const StyledTextOutput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createOutputsRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <StyledTextOutput
        placeholder={'Anotha output...'}
        value={item.title}
        onChangeText={(newText: string) => handleChangeText(newText, index)}
    />
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

    const startingId: number = outputs.reduce((maxId: number, curVal: RateInput) => Math.max(maxId, curVal.id), 0);

    return (
        <GrowingIdList
            data={outputs}
            createRenderItemComponent={createOutputsRenderItemComponent}
            keyExtractor={keyExtractor}
            startingId={startingId}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateOutput}
            handleAddInput={handleAddOutput}
        />
    );
}

export default GrowingOutputsList;
