import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Todo from '../../../../components/Dev/Todo';
import { TabNavHeader } from '../../../../components/Navigation/NavHeader';

import { RootState } from '../../../../redux';
import { forceSignatureRerender } from '../../../../redux/readSidewaysSlice';
import { setStartDate, forceSignatureRerender as forceStackSignatureRerender } from '../../../../redux/readSidewaysSlice/readStack';
import StackDatePicker from './components/StackDatePicker';
import StackList from './components/StackList';

// Possible outputs

type StackViewScreenProps = {

};
const StackViewScreen: FC<StackViewScreenProps> = (props) => {
    const {  } = props;

    const { readSSSignature, activeSliceName, readStackSignature, stackStartDate } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.internalReadReducer.readStackReducer, ...state.readSidewaysSlice.toplevelReadReducer }));

    return (
        <View>
            <TabNavHeader/>

            <StackDatePicker/>
            
            <StackList/>
        </View>
    )
}

export default StackViewScreen;
