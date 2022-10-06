import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import { FlexRow } from '../../../../../../ssComponents/Flex';

// MY COMPONENTS
import GrowingIdList from '../../../../../../ssComponents/Input/GrowingIdList';
import MyButton from '../../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import MyTextInput from '../../../../../../ssComponents/ReactNative/MyTextInput';

// REDUX
import { AppDispatch, RootState } from '../../../../../../ssRedux';
import { setVennInputs, addVennInput, removeVennInput, VennInput } from '../../../../../../ssRedux/timeSeriesStatsSlice';


const createRenderItemComponent = (deleteVennInput: (index: number) => void) => (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <FlexRow>
        <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />

        <MyButton
            onPress={() => deleteVennInput(index)}
        >
            <MyText>X</MyText>
        </MyButton>
    </FlexRow>
);

type GrowingVennInputListProps = {

};
const GrowingVennInputList: FC<GrowingVennInputListProps> = (props) => {

    const { vennNodeInputs } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.timeSeriesStatsSlice }));
    const dispatch: AppDispatch = useDispatch();
    
    const keyExtractor = (dataPoint: VennInput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddInputNode = (id: number, newPossibleOutput: string) => {
        dispatch(addVennInput({ id, text: newPossibleOutput }));
    };
    const handleUpdateInputNode = (newText: string, index: number) => {
        vennNodeInputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setVennInputs(vennNodeInputs));
    }
    
    return (
        <GrowingIdList
            data={vennNodeInputs}
            createRenderItemComponent={createRenderItemComponent((index: number) => dispatch(removeVennInput(index)))}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateInputNode}
            handleAddInput={handleAddInputNode}
        />
    )
}

export default GrowingVennInputList;

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;
