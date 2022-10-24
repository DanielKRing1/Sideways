import React, { FC, useMemo } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import AutoCompleteDropdown, { AutoCompleteDropdownProps, DropdownRowProps } from 'ssComponents/Search/AutocompleteDropdown';
import DecorationRow from './DecorationRow';
import { DecorationJson, DECORATION_ROW_KEY } from 'ssDatabase/api/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AvailableIcons } from 'ssDatabase/api/userJson/decoration/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'ssRedux/index';
import { startUpdateDecorationRow } from 'ssRedux/userJson/decorationSlice';
import { getDecorationMapValue } from 'ssDatabase/hardware/realm/userJson/utils';

export type AutoCompleteDecorationProps<T> = {
    editable?: boolean;
    allEntityIds: string[];
    decorationRowKey: DECORATION_ROW_KEY;

    onSelectEntityId: (entityId: string) => void;
} & Omit<AutoCompleteDropdownProps<T>, 'allEntityIds' | 'allSuggestions' | 'getSuggestionText' | 'DropdownRow'>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps<any>> = (props) => {

    // PROPS
    const {
        editable=true, clickOutsideId,
        placeholder, inputValue, setInputValue,
        decorationRowKey, allEntityIds,
        onSelectEntityId,
    } = props;

    // REDUX SELECTOR
    const { fullDecorationMap, decorationsSignature, } = useSelector((state: RootState) => (state.userJsonSlice.decorationSlice));
    const dispatch: AppDispatch = useDispatch();

    const decorationDict: DecorationJson = useMemo(() => fullDecorationMap[decorationRowKey], [decorationRowKey]);

    // HANDLERS (Input text, color, icon)
    const handleCommitInputText = (oldText: string, newText: string) => {
        // 1. Add new edited name
        const newJson: DecorationJson = {
            ...fullDecorationMap[decorationRowKey],
            [newText]: fullDecorationMap[decorationRowKey][oldText],
        };
        // 2. Remove old name
        delete fullDecorationMap[decorationRowKey][oldText];

        dispatch(startUpdateDecorationRow({
            rowKey: DECORATION_ROW_KEY[decorationRowKey],
            newJson,
        }));
    }
    const handleCommitInputColor = (inputText: string, newColor: string) => {
        // 1. Add new color
        const newJson: DecorationJson = {
            ...fullDecorationMap[decorationRowKey],
            [inputText]: {
                ...fullDecorationMap[decorationRowKey][inputText],
                COLOR: newColor,
            },
        };

        dispatch(startUpdateDecorationRow({
            rowKey: DECORATION_ROW_KEY[decorationRowKey],
            newJson,
        }));
    }
    const handleCommitInputIcon = (inputText: string, newIconName: string) => {
        // 1. Add new icon
        const newJson: DecorationJson = {
            ...fullDecorationMap[decorationRowKey],
            [inputText]: {
                ...fullDecorationMap[decorationRowKey][inputText],
                ICON: newIconName,
            },
        };

        dispatch(startUpdateDecorationRow({
            rowKey: DECORATION_ROW_KEY[decorationRowKey],
            newJson,
        }));
    }

    const DropdownRow: FC<DropdownRowProps<any>> = useMemo(() => (props) => {
        const entityId: string = props.suggestion;
        
        return (
            <TouchableOpacity
                onPress={() => onSelectEntityId(entityId)}
            >
                <DecorationRow
                    editable={editable}
                    text={entityId}
                    onCommitText={(newText: string) => handleCommitInputText(entityId, newText)}
                    color={getDecorationMapValue(decorationRowKey, entityId, fullDecorationMap).COLOR}
                    onCommitColor={(newColor: string) => handleCommitInputColor(entityId, newColor)}
                    iconName={getDecorationMapValue(decorationRowKey, entityId, fullDecorationMap).ICON as AvailableIcons}
                    onCommitIcon={(newIconName: AvailableIcons) => handleCommitInputIcon(entityId, newIconName)}
                />
            </TouchableOpacity>
        )
    }, [ editable, decorationDict, onSelectEntityId, handleCommitInputText, handleCommitInputColor, handleCommitInputIcon ]);

    return (
        <AutoCompleteDropdown
            clickOutsideId={clickOutsideId}
            placeholder={placeholder}
            allSuggestions={allEntityIds}
            getSuggestionText={(entityId) => entityId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            DropdownRow={DropdownRow}
        />
    );
}

export default AutoCompleteDecoration;
