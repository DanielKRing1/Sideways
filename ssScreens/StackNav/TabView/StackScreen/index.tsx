import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Todo from '../../../../ssComponents/Dev/Todo';
import { TabNavHeader } from '../../../../ssComponents/Navigation/NavHeader';

import { AppDispatch, RootState } from '../../../../ssRedux';
import { forceSignatureRerender } from '../../../../ssRedux/readSidewaysSlice';
import { setStartDate, forceSignatureRerender as forceStackSignatureRerender } from '../../../../ssRedux/readSidewaysSlice/readStack';
import { startDeleteSnapshot, startUpdateSnapshot } from '../../../../ssRedux/snapshotCrudSlice';
import StackDatePicker from './components/StackDatePicker';
import StackList from './components/StackList';

// Possible outputs

type StackViewScreenProps = {

};
const StackViewScreen: FC<StackViewScreenProps> = (props) => {
    const {  } = props;

    const { readSSSignature, activeSliceName, readStackSignature, stackStartDate } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.internalReadReducer.readStackReducer, ...state.readSidewaysSlice.toplevelReadReducer }));
    const { snapshotCrudSignature } = useSelector((state: RootState) => (state.snapshotCrudSlice));
    const dispatch: AppDispatch = useDispatch();
    
    const _updateSnapshot = async (oldSnapshot: Realm.Object & SidewaysSnapshotRow, newInputs: string[], newOutputs: string[], newRating: number) => {
        dispatch(startUpdateSnapshot({ sliceName: activeSliceName, oldSnapshot, newInputs, newOutputs, newRating }));
    }
    const _deleteSnapshot = async (snapshot: Realm.Object & SidewaysSnapshotRow, index: number) => {
        dispatch(startDeleteSnapshot({ sliceName: activeSliceName, snapshot, index }));
    }

    return (
        <View>
            <TabNavHeader/>

            <StackDatePicker/>
            
            <StackList
                updateSnapshot={_updateSnapshot}
                deleteSnapshot={_deleteSnapshot}
            />
        </View>
    )
}

export default StackViewScreen;
