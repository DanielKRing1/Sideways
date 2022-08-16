import React, { FC } from 'react';
import { Button, Text, View } from 'react-native';
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
import GrowingInputsList from './components/GrowingInputsList';
import GrowingOutputsList from './components/GrowingOutputsList';

type RateSliceScreenProps = {

};
const RateSliceScreen: FC<RateSliceScreenProps> = (props) => {
    const {  } = props;

    // REDUX
    const { ratedSignature, inputs, outputs, rating } = useSelector((state: RootState) => state.rateSidewaysSlice);
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));

    const handleRate = async () => {
        await startRate({
            sliceName: activeSliceName,
            inputs,
            outputs,
            rating,
        });
    };

    return (
        <View>
            <MyText>Is this working??</MyText>

            <FlexCol>
                <TabNavHeader/>


                <Todo name='Inputs growing input'/>
                <Todo name='Output input'/>
                <Todo name='Rating input'/>

                <GrowingInputsList/>

                <GrowingOutputsList/>
                
                <Button
                    title="Rate .u."
                    onPress={handleRate}
                />
                
            </FlexCol>
        </View>
    )
}

export default RateSliceScreen;
