import React, { FC, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import { RankedNode } from '@asianpersonn/realm-graph';

import GrowingIdList from '../../../../../../components/Input/GrowingIdList';
import MyTextInput from '../../../../../../components/ReactNative/MyTextInput';

// DB DRIVER
import { DbLoaderContext } from '../../../../../../contexts/DbLoader/DbLoader';
import dbDriver from '../../../../../../database/dbDriver';

// REDUX
import { RootState } from '../../../../../../redux';
import { setRecommendationSliceOutput, setRecommendationInputs, addRecommendationInput, removeRecommendationInput, RecoInput } from '../../../../../../redux/recommendationsSlice';

type GrowingRecoInputsProps = {

};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = (props) => {
    const dispatch = useDispatch();
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const { recommendationSliceOutput, recommendationInputs, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.recommendationsSlice }));

    // HANDLER METHODS
    const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
    const genNextDataPlaceholder = (id: number) => ({ id, text: '' });
    const handleAddInput = (id: number, newInputOption: string) => {
        dispatch(addRecommendationInput({ id, text: newInputOption }));
    };
    const handleUpdateInput = (newText: string, index: number) => {
        recommendationInputs[index].text = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setRecommendationInputs(recommendationInputs));
    }

    const createRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
        <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />
    );

    return (
        <GrowingIdList
            data={recommendationInputs}
            createRenderItemComponent={createRenderItemComponent}
            keyExtractor={keyExtractor}
            genNextDataPlaceholder={genNextDataPlaceholder}
            handleUpdateInput={handleUpdateInput}
            handleAddInput={handleAddInput}
        />
    );
}

export default GrowingRecoInputs;

const StyledTextInput = styled(MyTextInput)`
    borderWidth: 1px;
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
    paddingVertical: 25px;
    paddingHorizontal: 10px;
`;
