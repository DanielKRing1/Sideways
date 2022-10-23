import React, { FC, useState, memo } from 'react';
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
    setText?: (newText: string) => void;

    color: string;
    setColor: (newColor: string) => void;
    
    iconName: AvailableIcons;
    onConfirmIconSelection: (iconName: AvailableIcons) => void;
};
const DecorationRow: FC<DecorationRowProps> = (props) => {
    const { editable=true, text, setText=()=>{}, color, setColor, iconName, onConfirmIconSelection } = props;

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
                    handleCommitText={setText}
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
                    handleColorChange={handleColorChange}
                    handleColorSelected={handleColorSelected}
                />
            </DecorationRowModal>

            <DecorationRowModal
                isOpen={iconPickerOpen}
                setIsOpen={setIconPickerOpen}
            >
                <SelectableIcons
                    onConfirmSelection={onConfirmIconSelection}
                />

            </DecorationRowModal>
        </FlexRow>
    );
}

export default memo<DecorationRowProps>(DecorationRow);
