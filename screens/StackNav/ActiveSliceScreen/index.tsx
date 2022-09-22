import React, { FC, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

// REDUX
import { AppDispatch, RootState } from "../../../redux";
import { setActiveSliceName, setSearchedSliceName } from "../../../redux/readSidewaysSlice";

// NAVIGATION
import { StackNavigatorProps } from "../../../navigation/StackNavigator";
import { ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME, TABS_SCREEN_NAME } from "../../../navigation/constants";

// COMPONENTS
import { SearchableDropdown } from "../../../components/Search/SearchableDropdown";
import ExistingSliceList from './components/ExistingSliceList';

// NAV
import { ActiveSliceNavHeader } from '../../../components/Navigation/NavHeader';
import { startDeleteSlice } from "../../../redux/deleteSidewaysSlice";

const ActiveSliceScreen: FC<StackNavigatorProps<typeof ACTIVE_SLICE_SCREEN_NAME>> = (props) => {
    const { navigation } = props;

    // REDUX HOOKS
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    // TODO: Anything need to be done to rerender when signature changes?
    const { deleteSSSignature } = useSelector((state: RootState) => state.deleteSidewaysSlice);
    const dispatch: AppDispatch = useDispatch();

    // SLICE HANDLER METHODS
    const handleSelectActiveSlice = (sliceName: string) => {
        dispatch(setActiveSliceName(sliceName));

        navigation.navigate(TABS_SCREEN_NAME);
    };

    const handleDeleteSlice = (sliceName: string) => {
        dispatch(startDeleteSlice(sliceName));
    }

    return (
        <View>
            <ActiveSliceNavHeader/>

            <ExistingSliceList
                onSelectSlice={handleSelectActiveSlice}
                onDeleteSlice={handleDeleteSlice}
            />
        </View>
    )
};

export default ActiveSliceScreen;
