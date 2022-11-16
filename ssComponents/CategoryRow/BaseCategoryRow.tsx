/**
 * InputName
 * // Receive initial state
 * 1. Receive inputName prop, stored in parent state
 *
 * // Local state
 * 2. EditablText caches 'localInputName' in its local state
 *
 * // Edits
 * 3. Edits to inputName in the CategoryRow (via EditableText) occur on the 'localInputName'
 *
 * // Commits
 * 4. Upon clicking out of EditableText, commit 'localInputName' to Db
 */

import React, {FC, useEffect, useState, memo, useMemo} from 'react';
import {View, useWindowDimensions, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components';

import {FlexRow} from 'ssComponents/Flex';
import MyText from 'ssComponents/ReactNative/MyText';
import EditableText from 'ssComponents/Input/EditableText';
import SelectableIcons from 'ssComponents/IconInput/SelectableIcons';
import IconModalButton from 'ssComponents/Button/IconButton';
import ColorModalButton from './components/ColorModalButton';

import DecorationRowModal from './components/Modal';
import DecorationRowColorPicker from './components/ColorPicker';

import {cIdToCD} from 'ssDatabase/hardware/realm/userJson/utils';
import {HexColor} from '../../global';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {GJ_CategoryDecoration} from 'ssDatabase/api/userJson/category/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import MyButton from 'ssComponents/ReactNative/MyButton';
import StopPropagationView from 'ssComponents/View/StopPropagationView';

export type BaseCategoryRowProps = {
  editable?: boolean;
  deletable?: boolean;
  style?: ViewStyle;

  inputName: string;
  categoryId: string;
  placeholder?: string;

  activeSliceName: string;
  fullUserJsonMap: UserJsonMap;

  onEditInputName?: (newInputName: string) => void;
  onEditColor?: (color: HexColor) => void;
  onEditIcon?: (icon: AvailableIcons) => void;

  onCommitInputName: (newInputName: string) => void;
  onDeleteCategoryRow: () => void;

  onCommitColor?: (color: HexColor) => void;
  onCommitIcon?: (icon: AvailableIcons) => void;
};
const BaseCategoryRow: FC<BaseCategoryRowProps> = props => {
  const {
    editable = true,
    deletable = true,
    style = {},

    inputName,
    categoryId,
    placeholder,

    activeSliceName,
    fullUserJsonMap,

    onEditInputName = () => {},
    onEditColor = () => {},
    onEditIcon = () => {},

    onCommitInputName,
    onDeleteCategoryRow,

    onCommitColor = () => {},
    onCommitIcon = () => {},
  } = props;

  // HOOKS
  const {width} = useWindowDimensions();
  const theme = useTheme();

  const categoryDecoration: GJ_CategoryDecoration = useMemo(() => {
    return cIdToCD(activeSliceName, categoryId, fullUserJsonMap);
  }, [inputName, categoryId]);

  // LOCAL STATE
  const [localColor, setLocalColor] = useState<HexColor>(
    cIdToCD(activeSliceName, categoryId, fullUserJsonMap).color,
  );
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [localIconName, setLocalIconName] = useState<AvailableIcons>(
    cIdToCD(activeSliceName, categoryId, fullUserJsonMap).icon,
  );
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  // HANDLERS (Input text, color, icon)
  // EDIT HANDLERS
  const handleEditInputName = (newText: string) => onEditInputName(newText);
  const handleEditCategoryColor = (newColor: HexColor) => {
    // Props
    onEditColor(newColor);
    // Local
    setLocalColor(newColor);
  };
  const handleEditCategoryIcon = (newIcon: AvailableIcons) => {
    // Props
    onEditIcon(newIcon);
    // Local
    setLocalIconName(newIcon);
  };

  // COMMIT HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    // No change
    if (newInputName === inputName) return;

    // No inputName
    if (newInputName === '') onDeleteCategoryRow();
    else onCommitInputName(newInputName);
  };
  const handleCommitCategoryColor = (newColor: HexColor) => {
    // No change
    if (categoryDecoration.color === localColor) return;

    onCommitColor(newColor);
  };
  const handleCommitCategoryIcon = (newIconName: AvailableIcons) => {
    // No change
    if (categoryDecoration.icon !== localIconName) return;

    onCommitIcon(newIconName);
  };

  // EFFECTS

  // Commit color
  useEffect(() => {
    // Update local color
    if (colorPickerOpen === true) setLocalColor(categoryDecoration.color);
    // If local color is new color, then Commit local color when ColorPicker modal closes
    else handleCommitCategoryColor(localColor);
  }, [colorPickerOpen]);
  // Commit iconName
  useEffect(() => {
    // Update local iconName
    if (iconPickerOpen === true) setLocalIconName(categoryDecoration.icon);
    // If local icon is new icon, then Commit local iconName when IconPicker modal closes
    else handleCommitCategoryIcon(localIconName);
  }, [iconPickerOpen]);

  return (
    <FlexRow
      alignItems="center"
      justifyContent="space-between"
      style={{
        flex: 1,
        paddingLeft: (width * 1) / 20,
        paddingRight: (width * 1) / 20,
        borderColor: theme.colors.blackText,
        borderWidth: 2,
        borderRadius: width / 35,
        ...style,
      }}>
      {/* DISPLAYED IN ROW */}

      <EditableText
        editable={editable}
        containerStyle={{flex: 0.7}}
        placeholder={placeholder}
        text={inputName}
        onEditText={handleEditInputName}
        onCommitText={handleCommitInputName}
      />

      <StopPropagationView style={{flex: 0.3}}>
        <FlexRow justifyContent={'space-around'}>
          <IconModalButton
            color={categoryDecoration.color}
            iconName={categoryDecoration.icon}
            onPress={() => {
              // If category is selected
              if (true) setIconPickerOpen(true);
            }}
          />

          <ColorModalButton
            color={categoryDecoration.color}
            onPress={() => {
              // If category is selected
              if (true) setColorPickerOpen(true);
            }}
          />

          {deletable && (
            <MyButton onPress={onDeleteCategoryRow}>
              <MyText>X</MyText>
            </MyButton>
          )}
        </FlexRow>
      </StopPropagationView>

      {/* MODALS */}

      <DecorationRowModal
        isOpen={colorPickerOpen}
        setIsOpen={setColorPickerOpen}>
        <DecorationRowColorPicker
          color={categoryDecoration.color}
          onColorChange={() => {}}
          onColorSelected={(color: string) =>
            handleEditCategoryColor(color as HexColor)
          }
        />
      </DecorationRowModal>

      <DecorationRowModal isOpen={iconPickerOpen} setIsOpen={setIconPickerOpen}>
        <SelectableIcons onConfirmSelection={handleEditCategoryIcon} />
      </DecorationRowModal>
    </FlexRow>
  );
};

export default memo<BaseCategoryRowProps>(BaseCategoryRow);
