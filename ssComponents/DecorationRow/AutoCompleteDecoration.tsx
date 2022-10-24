import React, { FC, useMemo } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import AutoCompleteDropdown, { AutoCompleteDropdownProps, DropdownRowProps } from 'ssComponents/Search/AutocompleteDropdown';
import DecorationRow from './DecorationRow';
import { DecorationJson } from 'ssDatabase/api/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AvailableIcons } from 'ssDatabase/api/userJson/decoration/constants';

export type AutoCompleteDecorationProps<T> = {
    editable?: boolean;
    allSuggestions: string[];
    decorationDict: DecorationJson;

    onEditSuggestionText: (suggestion: string, newText: string) => void;
    onEditSuggestionColor: (suggestion: string, newColor: string) => void;
    onEditSuggestionIcon: (suggestion: string, newIconName: string) => void;

    onSelectSuggestion: (suggestion: string) => void;
} & Omit<AutoCompleteDropdownProps<T>, 'allSuggestions' | 'getSuggestionText' | 'DropdownRow'>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps<any>> = (props) => {
    const {
        editable=true, clickOutsideId,
        placeholder, inputValue, setInputValue,
        decorationDict, allSuggestions,
        onEditSuggestionText, onEditSuggestionColor, onEditSuggestionIcon,
        onSelectSuggestion,
    } = props;

    const DropdownRow: FC<DropdownRowProps<any>> = useMemo(() => (props) => {
        const suggestion: string = props.suggestion;
        
        const existingDecoration = (decorationName: string) => decorationDict[decorationName] !== undefined;
        
        return (
            <TouchableOpacity
                onPress={() => onSelectSuggestion(suggestion)}
            >
                <DecorationRow
                    editable={editable}
                    text={suggestion}
                    onCommitText={(newText: string) => onEditSuggestionText(suggestion, newText)}
                    // TODO Choose default color and default icon
                    color={decorationDict[suggestion].COLOR}
                    onCommitColor={(newColor: string) => onEditSuggestionColor(suggestion, newColor)}
                    iconName={decorationDict[suggestion].ICON as AvailableIcons}
                    onCommitIcon={(newIconName: AvailableIcons) => onEditSuggestionIcon(suggestion, newIconName)}
                />
            </TouchableOpacity>
        )
    }, [ editable, decorationDict, onSelectSuggestion, onEditSuggestionText, onEditSuggestionColor, onEditSuggestionIcon ]);

    return (
        <AutoCompleteDropdown
            clickOutsideId={clickOutsideId}
            placeholder={placeholder}
            allSuggestions={allSuggestions}
            getSuggestionText={(suggestion) => suggestion}
            inputValue={inputValue}
            setInputValue={setInputValue}
            DropdownRow={DropdownRow}
        />
    );
}

export default AutoCompleteDecoration;
