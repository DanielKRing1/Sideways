import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import dbDriver from '../../ssDatabase/api/core/dbDriver';
import { ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME } from '../../ssNavigation/constants';
import { StackNavigatorNavigationProp, StackNavigatorParamList } from '../../ssNavigation/StackNavigator';
import { RootState } from '../../ssRedux';

type RequireActiveSliceProps = {
    children: React.ReactNode;
};
const RequireActiveSlice: FC<RequireActiveSliceProps> = (props) => {
    const { children } = props;

    // NAVIGATION
    const navigation = useNavigation<StackNavigatorNavigationProp<any>>();
    // REDUX
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    
    useEffect(() => {
        // If no active slice selected or
        // not a valid slice name
        if(activeSliceName === '' || !dbDriver.getSliceNames().includes(activeSliceName)) {
            // Nav to Select Active Slice screen
            if(dbDriver.getSliceNames().length > 0) navigation.navigate(ACTIVE_SLICE_SCREEN_NAME);
            // Or nav to Add Slice screen
            else navigation.navigate(ADD_SLICE_SCREEN_NAME as keyof StackNavigatorParamList, {  inputSliceName: activeSliceName });
        }
    }, [activeSliceName]);

    return (
        <View style={{ flex: 1 }}>
            {children}
        </View>
    )
}

export default RequireActiveSlice;
