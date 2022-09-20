import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Todo from '../../../../components/Dev/Todo';
import { TabNavHeader } from '../../../../components/Navigation/NavHeader';

import { RootState } from '../../../../redux';
import { forceSignatureRerender } from '../../../../redux/readSidewaysSlice';
import { setInputSelections, setOutputSelections, forceSignatureRerender as forceGraphSignatureRerender } from '../../../../redux/readSidewaysSlice/readGraph';

// Possible outputs

type GraphViewScreenProps = {

};
const GraphViewScreen: FC<GraphViewScreenProps> = (props) => {
    const {  } = props;

    const { readSSSignature, activeSliceName, readGraphSignature, inputSelections, outputSelections } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.readSidewaysSlice.internalReadReducer.readGraphReducer }));

    return (
        <View>
            <TabNavHeader/>
            
            <Todo name='Input selections dropdown'/>
            <Todo name='Output selections dropdown'/>
        </View>
    )
}

export default GraphViewScreen;
