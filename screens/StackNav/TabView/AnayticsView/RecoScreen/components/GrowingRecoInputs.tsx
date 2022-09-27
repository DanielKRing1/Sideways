import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import { FlexRow } from '../../../../../../components/Flex';

// MY COMPONENTS
import GrowingIdList from '../../../../../../components/Input/GrowingIdList';
import MyButton from '../../../../../../components/ReactNative/MyButton';
import MyText from '../../../../../../components/ReactNative/MyText';
import MyTextInput from '../../../../../../components/ReactNative/MyTextInput';

// REDUX
import { RootState } from '../../../../../../redux';
import { setRecommendationInputs, addRecommendationInput, removeRecommendationInput, RecoInput } from '../../../../../../redux/recommendationsSlice';

const createRenderItemComponent = (deleteInputNode: (index: number) => void) => (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
    <FlexRow>
        <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />

        <MyButton
            onPress={() => deleteInputNode(index)}
        >
            <MyText>X</MyText>
        </MyButton>
    </FlexRow>
);

type GrowingRecoInputsProps = {

};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = (props) => {
    const dispatch = useDispatch();
    const { readSSSignature, recommendationInputs, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.recommendationsSlice }));

    // HANDLER METHODS
    const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddInput = (id: number, newInputOption: string) => {
        dispatch(addRecommendationInput({ id, text: newInputOption }));
    };
    const handleUpdateInput = (newText: string, index: number) => {
        recommendationInputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setRecommendationInputs(recommendationInputs));
    }

    return (
        <GrowingIdList
            data={recommendationInputs}
            createRenderItemComponent={createRenderItemComponent((index: number) => dispatch(removeRecommendationInput(index)))}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateInput}
            handleAddInput={handleAddInput}
        />
    );
}

export default GrowingRecoInputs;

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;
