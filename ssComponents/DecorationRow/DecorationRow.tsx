import React, { FC, useState, memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components';

import { FlexRow } from 'ssComponents/Flex';
import { AvailableIcons } from 'ssDatabase/api/userJson/decoration/constants';
import EditableText from 'ssComponents/Input/EditableText';
import MyButton from 'ssComponents/ReactNative/MyButton';
import DecorationRowModal from './components/Modal';
import DecorationRowColorPicker from './components/ColorPicker';
import SelectableIcons from 'ssComponents/IconInput/SelectableIcons';

type DecorationRowProps = {
    editableText: string;
    setEditableText: (newText: string) => void;
    color: string;
    setColor: (newColor: string) => void;
    onConfirmSelection: (iconName: AvailableIcons) => void;
};
const DecorationRow: FC<DecorationRowProps> = (props) => {
    const { editableText, setEditableText, color, setColor, onConfirmSelection } = props;

    // HOOKS
    const { height, width } = useWindowDimensions();
    const theme = useTheme();

    // STATE
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);

    const handleColorChange = (color: string) => {
        // setColor(color);
    }
    const handleColorSelected = (color: string) => {
        setColor(color);
        // console.log(color);
    }

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

            <EditableText
                style={{ flex: 0.8 }}
                text={editableText}
                handleCommitText={setEditableText}
            />

            <MyButton
                style={{ flex: 0.1 }}
                onPress={() => { setColorPickerOpen(true) }}
            >
                C
            </MyButton>

            <MyButton
                style={{ flex: 0.1 }}
                onPress={() => { setIconPickerOpen(true) }}
            >
                I
            </MyButton>

            {/* MODALS */}

            <DecorationRowModal
                isOpen={colorPickerOpen}
                setIsOpen={setColorPickerOpen}
            >
                <DecorationRowColorPicker
                    color={color}
                    handleColorChange={handleColorChange}
                    handleColorSelected={handleColorSelected}
                />
            </DecorationRowModal>

            <DecorationRowModal
                isOpen={iconPickerOpen}
                setIsOpen={setIconPickerOpen}
            >
                <SelectableIcons
                    onConfirmSelection={onConfirmSelection}
                />

            </DecorationRowModal>
        </FlexRow>
    );
}

export default memo(DecorationRow);
