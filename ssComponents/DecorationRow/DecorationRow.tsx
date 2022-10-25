import React, {FC, useEffect, useState, memo, useMemo} from 'react';
import {View, useWindowDimensions, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import {FlexRow} from 'ssComponents/Flex';
import MyText from 'ssComponents/ReactNative/MyText';
import EditableText from 'ssComponents/Input/EditableText';
import DecorationRowModal from './components/Modal';
import DecorationRowColorPicker from './components/ColorPicker';
import SelectableIcons from 'ssComponents/IconInput/SelectableIcons';
import ColorModalButton from './components/ColorModalButton';
import IconModalButton from './components/IconModalButton';
import {DecorationJsonValue, DECORATION_ROW_KEY} from 'ssDatabase/api/types';
import {
  startUpdateDecorationText,
  startUpdateDecorationColor,
  startUpdateDecorationIcon,
} from 'ssRedux/userJson/decorationSlice';
import {RootState, AppDispatch} from 'ssRedux/index';
import {getDecorationJsonValue} from 'ssDatabase/hardware/realm/userJson/utils';
import {AvailableIcons} from 'ssDatabase/api/userJson/decoration/constants';

type DecorationRowProps = {
  editable?: boolean;
  style?: ViewStyle;

  rowKey: DECORATION_ROW_KEY;
  entityId: string;
  placeholder?: string;

  onEditEntityId?: (oldId: string, newId: string) => void;
  onEditColor?: (entityId: string, color: string) => void;
  onEditIcon?: (entityId: string, icon: AvailableIcons) => void;

  onCommitEntityId?: (oldId: string, newId: string) => void;
  onCommitColor?: (entityId: string, color: string) => void;
  onCommitIcon?: (entityId: string, icon: AvailableIcons) => void;
};
const DecorationRow: FC<DecorationRowProps> = props => {
  const {
    editable = true,
    style = {},
    rowKey,
    entityId,
    placeholder,
    onEditEntityId = () => {},
    onEditColor = () => {},
    onEditIcon = () => {},
    onCommitEntityId = () => {},
    onCommitColor = () => {},
    onCommitIcon = () => {},
  } = props;

  // HOOKS
  const {width} = useWindowDimensions();
  const theme = useTheme();

  // REDUX SELECTOR
  const {fullDecorationMap, decorationsSignature} = useSelector(
    (state: RootState) => state.userJsonSlice.decorationSlice,
  );
  const decorationValue: DecorationJsonValue = useMemo(
    () => getDecorationJsonValue(entityId, fullDecorationMap[rowKey]),
    [entityId, fullDecorationMap, rowKey],
  );
  const dispatch: AppDispatch = useDispatch();

  // LOCAL STATE
  const [localColor, setLocalColor] = useState(decorationValue.COLOR);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [localIconName, setLocalIconName] = useState<AvailableIcons>(
    decorationValue.ICON,
  );
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  // HANDLERS (Input text, color, icon)
  const handleEditEntityId = (newText: string) =>
    onEditEntityId(entityId, newText);
  const handleEditColor = (newColor: string) => {
    // Props
    onEditColor(entityId, newColor);
    // Local
    setLocalColor(newColor);
  };
  const handleEditIcon = (newIcon: AvailableIcons) => {
    // Props
    onEditIcon(entityId, newIcon);
    // Local
    setLocalIconName(newIcon);
  };

  const handleCommitInputText = (newId: string) => {
    // Props
    onCommitEntityId(entityId, newId);
    // Redux
    dispatch(
      startUpdateDecorationText({
        rowKey: DECORATION_ROW_KEY[rowKey],
        entityId,
        newValue: newId,
      }),
    );
  };
  const handleCommitInputColor = (newColor: string) => {
    // Props
    onCommitColor(entityId, newColor);
    // Redux
    dispatch(
      startUpdateDecorationColor({
        rowKey: DECORATION_ROW_KEY.INPUT,
        entityId,
        newValue: newColor,
      }),
    );
  };
  const handleCommitInputIcon = (newIconName: AvailableIcons) => {
    // Props
    onCommitIcon(entityId, newIconName);
    // Redux
    dispatch(
      startUpdateDecorationIcon({
        rowKey: DECORATION_ROW_KEY.INPUT,
        entityId,
        newValue: newIconName,
      }),
    );
  };

  // EFFECTS

  // Commit color
  useEffect(() => {
    // Update local color
    if (colorPickerOpen === true) setLocalColor(decorationValue.COLOR);
    // If local color is new color, then Commit local color when ColorPicker modal closes
    else if (decorationValue.COLOR !== localColor)
      handleCommitInputColor(localColor);
  }, [colorPickerOpen]);
  // Commit iconName
  useEffect(() => {
    // Update local iconName
    if (iconPickerOpen === true) setLocalIconName(decorationValue.ICON);
    // If local icon is new icon, then Commit local iconName when IconPicker modal closes
    else if (decorationValue.ICON !== localIconName)
      handleCommitInputIcon(localIconName);
  }, [iconPickerOpen]);

  return (
    <FlexRow
      alignItems="center"
      justifyContent="space-between"
      style={{
        paddingLeft: (width * 1) / 20,
        paddingRight: (width * 1) / 20,
        borderColor: theme.colors.blackText,
        borderWidth: 2,
        borderRadius: width / 35,
        ...style,
      }}>
      {/* DISPLAYED IN ROW */}

      <View>
        {editable ? (
          <EditableText
            textStyle={{
              borderBottomWidth: 3,
              borderColor: theme.colors.grayBorder,
            }}
            placeholder={placeholder}
            text={entityId}
            onEditText={handleEditEntityId}
            onCommitText={handleCommitInputText}
          />
        ) : (
          <MyText>{entityId}</MyText>
        )}
      </View>

      <FlexRow style={{flex: 0.3}} justifyContent={'space-between'}>
        <ColorModalButton
          style={{flex: 0.1}}
          color={decorationValue.COLOR}
          onPress={() => {
            setColorPickerOpen(true);
          }}
        />

        <IconModalButton
          style={{flex: 0.1}}
          color={decorationValue.COLOR}
          iconName={decorationValue.ICON}
          onPress={() => {
            setIconPickerOpen(true);
          }}
        />
      </FlexRow>

      {/* MODALS */}

      <DecorationRowModal
        isOpen={colorPickerOpen}
        setIsOpen={setColorPickerOpen}>
        <DecorationRowColorPicker
          color={decorationValue.COLOR}
          onColorChange={() => {}}
          onColorSelected={handleEditColor}
        />
      </DecorationRowModal>

      <DecorationRowModal isOpen={iconPickerOpen} setIsOpen={setIconPickerOpen}>
        <SelectableIcons onConfirmSelection={handleEditIcon} />
      </DecorationRowModal>
    </FlexRow>
  );
};

export default memo<DecorationRowProps>(DecorationRow);
