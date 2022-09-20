import React, { FC } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { RootState } from '../../../../../redux';

type StatsScreenProps = {

};
const StatsScreen: FC<StatsScreenProps> = (props) => {

    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));

    return (
        <View>

        </View>
    );
}

export default StatsScreen;
