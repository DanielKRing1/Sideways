import React, { FC, useEffect, useState, memo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components';

import { FlexRow } from 'ssComponents/Flex';
import { AvailableIcons } from 'ssDatabase/api/userJson/decoration/constants';
import MyText from 'ssComponents/ReactNative/MyText';
import EditableText from 'ssComponents/Input/EditableText';
import DecorationRowModal from './components/Modal';
import DecorationRowColorPicker from './components/ColorPicker';
import SelectableIcons from 'ssComponents/IconInput/SelectableIcons';
import ColorModalButton from './components/ColorModalButton';
import IconModalButton from './components/IconModalButton';

type DecorationRowProps = {
    editable?: boolean;
    text: string;
    onCommitText?: (newText: string) => void;

    color: string;
    onCommitColor: (newColor: string) => void;
    
    iconName: AvailableIcons;
    onCommitIcon: (iconName: AvailableIcons) => void;
};
const DecorationRow: FC<DecorationRowProps> = (props) => {
    const { editable=true, text, onCommitText=()=>{}, color, onCommitColor, iconName, onCommitIcon } = props;

    // HOOKS
    const { height, width } = useWindowDimensions();
    const theme = useTheme();

    // STATE
    const [localColor, setLocalColor ] = useState(color);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [localIconName, setLocalIconName ] = useState(iconName);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);

    // EFFECTS

    // Commit color
    useEffect(() => {
        // Update local color
        if(colorPickerOpen === true) setLocalColor(color);
        // Commit local color when ColorPicker modal closes
        else if(color !== localColor) onCommitColor(localColor);
    }, [colorPickerOpen]);
    // Commit iconName
    useEffect(() => {
        // Update local iconName
        if(iconPickerOpen === true) setLocalIconName(iconName);
        // Commit local iconName when IconPicker modal closes
        else if(iconName !== localIconName) onCommitIcon(localIconName);
    }, [iconPickerOpen]);

    return (
        <FlexRow
            alignItems='center'
            justifyContent='space-between'
            style={{
                paddingLeft: width * 1 / 20,
                paddingRight: width * 1 / 20,
                borderColor: theme.colors.blackText,
                borderWidth: 2,
                borderRadius: width / 35,
            }}
        >
            {/* DISPLAYED IN ROW */}

            <View>
            {
                editable
                ?
                <EditableText
                    textStyle={{
                        borderBottomWidth: 3,
                        borderColor: theme.colors.grayBorder,
                    }}
                    text={text}
                    handleCommitText={onCommitText}
                />
                :
                <MyText>{text}</MyText>
            }
            </View>

            <FlexRow
                style={{ flex: 0.3 }}
                justifyContent={'space-between'}
            >
                <ColorModalButton
                    style={{ flex: 0.1 }}
                    color={color}
                    onPress={() => { setColorPickerOpen(true) }}
                />

                <IconModalButton
                    style={{ flex: 0.1 }}
                    color={color}
                    iconName={iconName}
                    onPress={() => { setIconPickerOpen(true) }}
                />
            </FlexRow>

            {/* MODALS */}

            <DecorationRowModal
                isOpen={colorPickerOpen}
                setIsOpen={setColorPickerOpen}
            >
                <DecorationRowColorPicker
                    color={color}
                    onColorChange={()=>{}}
                    onColorSelected={setLocalColor}
                />
            </DecorationRowModal>

            <DecorationRowModal
                isOpen={iconPickerOpen}
                setIsOpen={setIconPickerOpen}
            >
                <SelectableIcons
                    onConfirmSelection={setLocalIconName}
                />

            </DecorationRowModal>
        </FlexRow>
    );
}

export default memo<DecorationRowProps>(DecorationRow);
