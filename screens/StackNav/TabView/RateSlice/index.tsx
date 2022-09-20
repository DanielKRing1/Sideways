import React, { FC } from 'react';
import { Button, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import Realm from 'realm';
import FlexCol from '../../../../components/Flex/FlexCol';
import { GrowingList } from '../../../../components/Input/GrowingInputList';
import MyTextInput from '../../../../components/ReactNative/MyTextInput';
import { TabNavHeader } from '../../../../components/Navigation/NavHeader';
import MyText from '../../../../components/ReactNative/MyText';

// REDUX
import { AppDispatch, RootState } from '../../../../redux';
import { addInput, setInputs, setOutputs, startRate, forceSignatureRerender, RateInput } from '../../../../redux/rateSidewaysSlice';
import GrowingInputsList from './components/GrowingInputsList';
import GrowingOutputsList from './components/GrowingOutputsList';
import RatingSlider from './components/RatingSlider';
import MyButton from '../../../../components/ReactNative/MyButton';
import VerticalSpace from '../../../../components/Spacing/VerticalSpace';
import { useNavigation } from '@react-navigation/native';
import { ACTIVE_SLICE_SCREEN_NAME } from '../../../../navigation/constants';
import { StackNavigatorNavigationProp } from '../../../../navigation/StackNavigator';
import { DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH, DEFAULT_REALM_GRAPH_META_REALM_PATH, DEFAULT_REALM_STACK_LOADABLE_REALM_PATH, DEFAULT_REALM_STACK_META_REALM_PATH } from '../../../../database/realm/config';
import { resetRealm } from '../../../../realm/reset';

type RateSliceScreenProps = {

};
const RateSliceScreen: FC<RateSliceScreenProps> = (props) => {
    const {  } = props;

    // THEME
    const theme = useTheme();

    // NAVIGATION
    const navigation = useNavigation<StackNavigatorNavigationProp<any>>()
    
    // REDUX
    const { ratedSignature, inputs, outputs, rating } = useSelector((state: RootState) => state.rateSidewaysSlice);
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const dispatch: AppDispatch = useDispatch();

    const handleRate = async () => {
        dispatch(startRate());
    };

    return (
        <View>
            <FlexCol>
                <TabNavHeader/>

                <GrowingInputsList/>
                <VerticalSpace/>
                <GrowingOutputsList/>

                <RatingSlider/>
                
                {
                    !!activeSliceName ?
                        <FlexCol alignItems='center'>
                            <MyButton
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    padding: 10,
                                    width: '80%',
                                }}
                                onPress={handleRate}
                                >
                                <MyText>Rate .u.</MyText>
                            </MyButton>
                        </FlexCol>
                    :
                        <FlexCol alignItems='center'>
                            <MyButton 
                                style={{
                                    borderWidth: 1,
                                    borderColor: theme.colors.grayBorder,
                                    padding: 10,
                                    width: '80%',
                                }}
                                onPress={() => navigation.navigate(ACTIVE_SLICE_SCREEN_NAME)}
                            >
                                <MyText style={{ color: theme.colors.darkRed }}>Select a slice!</MyText>
                            </MyButton>
                        </FlexCol>
                }

                <FlexCol alignItems='center'>
                    <MyButton 
                        style={{
                            borderWidth: 1,
                            borderColor: theme.colors.grayBorder,
                            padding: 10,
                            width: '80%',
                        }}
                        onPress={resetRealm}
                    >
                        <MyText style={{ color: theme.colors.darkRed }}>Delete entire Realm</MyText>
                    </MyButton>
                </FlexCol>
                
            </FlexCol>
        </View>
    )
}

export default RateSliceScreen;
