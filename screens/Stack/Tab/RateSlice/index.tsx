import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import Todo from '../../../../components/Dev/Todo';
import FlexCol from '../../../../components/Flex/FlexCol';
import { GrowingList } from '../../../../components/Input/GrowingInputList';
import MyTextInput from '../../../../components/Input/MyTextInput';
import { TabNavHeader } from '../../../../components/Navigation/NavHeader';
import MyText from '../../../../components/Text/MyText';
import { useCounterId } from '../../../../hooks/useCounterId';

// REDUX
import { RootState } from '../../../../redux';
import { addInput, setInputs, setOutputs, startRate, forceSignatureRerender, RateInput } from '../../../../redux/rateSidewaysSlice';

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

type RateSliceScreenProps = {

};
const RateSliceScreen: FC<RateSliceScreenProps> = (props) => {
    const {  } = props;

    // REDUX
    const { ratedSignature, inputs, outputs, rating } = useSelector((state: RootState) => state.rateSidewaysSlice);
    const dispatch = useDispatch();

    // ID GENERATOR
    // Start id generator with current max id or 0
    const { peekId, popId } = useCounterId(inputs.reduce((maxId: number, curVal: RateInput) => Math.max(maxId, curVal.id), 0));

    // HANDLER METHODS
    const handleAddInput = (newInputOption: string) => {
        dispatch(addInput({ id: popId(), text: newInputOption }));
    };
    const handleUpdateText = (newText: string, index: number) => {
        inputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setInputs(inputs));
    }

    return (
        <View>
            <MyText>Is this working??</MyText>

            <FlexCol>
                <TabNavHeader/>


                <Todo name='Inputs growing input'/>
                <Todo name='Output input'/>
                <Todo name='Rating input'/>

                <GrowingList
                    data={inputs}
                    createRenderItemComponent={createRenderItemComponent}
                    keyExtractor={(dataPoint: RateInput) => `${dataPoint.id}`}
                    genNextDataPlaceholder={() => ({ id: peekId(), text: '' })}
                    handleUpdateText={handleUpdateText}
                    handleAddInput={handleAddInput}
                />
                
            </FlexCol>
        </View>
    )
}

export default RateSliceScreen;
