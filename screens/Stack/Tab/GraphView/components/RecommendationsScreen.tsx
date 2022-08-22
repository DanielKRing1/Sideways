import { RankedNode } from '@asianpersonn/realm-graph/dist/types/RealmGraph';
import React, { FC, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme } from 'styled-components/native';
import { GrowingList } from '../../../../../components/Input/GrowingInputList';
import MyTextInput from '../../../../../components/ReactNative/MyTextInput';

// DB DRIVER
import { DbLoaderContext } from '../../../../../contexts/DbLoader';
import dbDriver from '../../../../../database/dbDriver';

// REDUX
import { RootState } from '../../../../../redux';
import { setRecommendationSliceOutput, setRecommendationInputNodeIds, addRecommendationInputNodeId, removeRecommendationInputNodeId } from '../../../../../redux/recommendationsSlice';

type RecommendationScreenProps = {

};
const RecommendationScreen: FC<RecommendationScreenProps> = (props) => {
    const dispatch = useDispatch();
    const { activeSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const { recommendationSliceOutput, recommendationsInputNodeIds, recommendationsSignature } = useSelector((state: RootState) => ({ ...state.recommendationsSlice }));
    
    const [ recommendations, setRecommendations ] = useState<RankedNode[]>([]);
    const getRecommendations = async () => {
        const { isLoaded } = useContext(DbLoaderContext);
        const TARGET_INPUT_NODE_WEIGHT: number = 0.5;
        const EDGE_INFLATION_MAGNITUDE: number = 2;
        
        const recommendationsPromise = useMemo(() => dbDriver.getRecommendations(activeSliceName, recommendationSliceOutput, recommendationsInputNodeIds, TARGET_INPUT_NODE_WEIGHT, EDGE_INFLATION_MAGNITUDE, 20, 0.85), [isLoaded, activeSliceName, recommendationSliceOutput, recommendationsInputNodeIds]);
        const newRecommendations = await recommendationsPromise;
        // Type is { id: string, [any key]: any value }
        setRecommendations(newRecommendations as RankedNode[]);
    }

    // HANDLER METHODS
    const handleAddInput = (newInputNodeId: string) => {
        dispatch(addRecommendationInputNodeId(newInputNodeId));
    };
    const handleUpdateInput = (newText: string, index: number) => {
        recommendationsInputNodeIds[index] = newText;
        // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
        dispatch(setRecommendationInputNodeIds(recommendationsInputNodeIds));
    }

    // TODO: Move these code blocks out of this component
    // TODO: Make this input component reusable
    const StyledTextInput = styled(MyTextInput)`
        borderWidth: 1px;
        borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};
        paddingVertical: 25px;
        paddingHorizontal: 10px;
    `;

    const createRenderItemComponent = (handleChangeText: (newText: string, index: number) => void) => ({ item, index }: any) => (
        <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.title}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        />
    );

    return (
        <View>

            <GrowingList
                data={recommendationsInputNodeIds}
                createRenderItemComponent={createRenderItemComponent}
                keyExtractor={(dataPoint: string) => ''}
                genNextDataPlaceholder={() => ''}
                handleUpdateInput={handleUpdateInput}
                handleAddInput={handleAddInput}
            />

        </View>
    )
}
