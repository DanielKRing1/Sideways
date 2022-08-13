import React, { FC, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

// REDUX
import { RootState } from "../../../redux";
import { setActiveSliceName, setSearchedSliceName } from "../../../redux/readSidewaysSlice";

// NAVIGATION
import { StackNavigatorProps } from "../../../navigation/StackNavigator";
import { ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME } from "../../../navigation/constants";

// COMPONENTS
import { SearchableDropdown } from "../../../components/Search/SearchableDropdown";
import ExistingSliceList from './components/ExistingSliceList';

// NAV
import { ActiveSliceNavHeader } from '../../../components/Navigation/NavHeader';

const ActiveSliceScreen: FC<StackNavigatorProps<typeof ACTIVE_SLICE_SCREEN_NAME>> = (props) => {
    const { navigation } = props;

    // REDUX HOOKS
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const dispatch = useDispatch();

    // SLICE HANDLER METHODS
    const handleSelectActiveSlice = (sliceName: string) => {
        dispatch(setActiveSliceName(sliceName));
    };

    return (
        <View>
            <ActiveSliceNavHeader/>

            <ExistingSliceList
                onSelectSlice={handleSelectActiveSlice}
            />
        </View>
    )
};

export default ActiveSliceScreen;
