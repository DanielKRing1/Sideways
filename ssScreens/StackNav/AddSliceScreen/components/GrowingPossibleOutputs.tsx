import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';

// REDUX
import { RootState } from '../../../../ssRedux';
import { setNewSliceName, addPossibleOutput, removePossibleOutput, setPossibleOutputs, forceSignatureRerender } from '../../../../ssRedux/createSidewaysSlice';

// COMPONENTS
import GrowingIdList from '../../../../ssComponents/Input/GrowingIdList';
import { GrowingIdText as NewSliceOutput } from '../../../../ssComponents/Input/GrowingIdList';

// NAV
import MyTextInput from '../../../../ssComponents/ReactNative/MyTextInput';
import MyButton from '../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../ssComponents/ReactNative/MyText';
import { FlexRow } from '../../../../ssComponents/Flex';
import VerticalSpace from '../../../../ssComponents/Spacing/VerticalSpace';

// Possible outputs

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;

const createRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <FlexRow>
        <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />

        <MyButton
            onPress={() => removePossibleOutput(index)}
        >
            <MyText>X</MyText>
        </MyButton>
    </FlexRow>
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
