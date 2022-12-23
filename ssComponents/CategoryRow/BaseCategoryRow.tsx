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
import {useWindowDimensions, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components';

import {FlexRow} from 'ssComponents/Flex';
import MyText from 'ssComponents/ReactNative/MyText';
import EditableText from 'ssComponents/Input/EditableText';
import IconSelector from 'ssComponents/IconInput/IconSelector';
import IconModalButton from './components/IconModalButton';

import DecorationRowModal from './components/Modal';
import DecorationRowColorPicker from './components/ColorPicker';

import {cIdToCD} from 'ssDatabase/hardware/realm/userJson/utils';
import {DISPLAY_SIZE, HexColor} from '../../global';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {GJ_CategoryDecoration} from 'ssDatabase/api/userJson/category/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import MyButton from 'ssComponents/ReactNative/MyButton';
import StopPropagationView from 'ssComponents/View/StopPropagationView';
import MyModal from 'ssComponents/View/Modal';
import {UNASSIGNED_CATEGORY_ID} from 'ssDatabase/api/userJson/category/constants';
import {useTimeout} from 'ssHooks/useTimeout';
import CIdSelector from './components/CIdSelector';
import MyPadding from 'ssComponents/ReactNative/MyPadding';

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
  onEditCId?: (cId: string) => void;
  onEditColor?: (color: HexColor) => void;
  onEditIcon?: (icon: AvailableIcons) => void;

  onCommitInputName: (newInputName: string) => void;
  onDeleteCategoryRow: () => void;

  onCommitCId?: (cId: string) => void;
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
    onEditCId = () => {},
    onEditColor = () => {},
    onEditIcon = () => {},

    onCommitInputName,
    onDeleteCategoryRow,

    onCommitCId = () => {},
    onCommitColor = () => {},
    onCommitIcon = () => {},
  } = props;

  // HOOKS
  const {width} = useWindowDimensions();
  const theme = useTheme();

  const categoryDecoration: GJ_CategoryDecoration = useMemo(() => {
    return cIdToCD(activeSliceName, categoryId, fullUserJsonMap);
  }, [inputName, categoryId, fullUserJsonMap]);

  // LOCAL STATE
  const [errMsg, setErrMsg] = useState('');
  const {createTO: createInvalidCategoryErrTO} = useTimeout();

  // CId
  const [localCId, setLocalCId] = useState<string>(categoryId);
  const [cIdPickerOpen, setCIdPickerOpen] = useState(false);
  // Color
  const [localColor, setLocalColor] = useState<HexColor>(
    categoryDecoration.color,
  );
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  // Icon
  const [localIcon, setLocalIcon] = useState<AvailableIcons>(
    categoryDecoration.icon,
  );
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  // HANDLERS (Input text, color, icon)

  // MODAL HANDLERS
  const handleOpenCIdModal = () => {
    // If category is selected
    if (true) setCIdPickerOpen(true);
  };
  /**
   * Display an error modal if trying to open color/icon picker before a valid category is selected
   */
  const handleOpenColorModal = () => {
    // If category is selected
    if (categoryId !== UNASSIGNED_CATEGORY_ID) setColorPickerOpen(true);
    else {
      setErrMsg('Choose a category first!');
      createInvalidCategoryErrTO(() => setErrMsg(''), 1000);
    }
  };
  const handleOpenIconModal = () => {
    // If category is selected
    if (categoryId !== UNASSIGNED_CATEGORY_ID) setIconPickerOpen(true);
    else {
      setErrMsg('Choose a category first!');
      createInvalidCategoryErrTO(() => setErrMsg(''), 1000);
    }
  };

  // EDIT HANDLERS
  const handleEditInputName = (newText: string) => onEditInputName(newText);
  const handleEditCId = (newCId: string) => {
    // Props
    onEditCId(newCId);
    // Local
    setLocalCId(newCId);
  };
  const handleEditColor = (newColor: HexColor) => {
    // Props
    onEditColor(newColor);
    // Local
    setLocalColor(newColor);
  };
  const handleEditIcon = (newIcon: AvailableIcons) => {
    // Props
    onEditIcon(newIcon);
    // Local
    setLocalIcon(newIcon);
  };

  // COMMIT HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    console.log('HANDLER: handleCommitInputName');
    console.log(newInputName);
    console.log(inputName);

    // No inputName
    if (newInputName === '') onDeleteCategoryRow();
    else onCommitInputName(newInputName);
  };
  const handleCommitCId = (newCId: string) => {
    // No change
    if (categoryId === localCId) return;

    onCommitCId(newCId);
  };
  const handleCommitColor = (newColor: HexColor) => {
    // No change
    if (categoryDecoration.color === localColor) return;

    onCommitColor(newColor);
  };
  const handleCommitIcon = (newIcon: AvailableIcons) => {
    // No change
    if (categoryDecoration.icon === localIcon) return;

    onCommitIcon(newIcon);
  };

  // EFFECTS

  // Commit cId
  useEffect(() => {
    // Update local color
    if (cIdPickerOpen === true) setLocalCId(categoryId);
    // If local color is new color, then Commit local color when ColorPicker modal closes
    else handleCommitCId(localCId);
  }, [cIdPickerOpen]);
  // Commit color
  useEffect(() => {
    // Update local color
    if (colorPickerOpen === true) setLocalColor(categoryDecoration.color);
    // If local color is new color, then Commit local color when ColorPicker modal closes
    else handleCommitColor(localColor);
  }, [colorPickerOpen]);
  // Commit icon
  useEffect(() => {
    // Update local icon
    if (iconPickerOpen === true) setLocalIcon(categoryDecoration.icon);
    // If local icon is new icon, then Commit local icon when IconPicker modal closes
    else handleCommitIcon(localIcon);
  }, [iconPickerOpen]);

  return (
    <MyPadding
      isMargin
      style={{width: '100%'}}
      baseSize={DISPLAY_SIZE.xs}
      leftSize={DISPLAY_SIZE.none}
      rightSize={DISPLAY_SIZE.none}>
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
          containerStyle={{flex: 0.6}}
          placeholder={placeholder}
          text={inputName}
          onEditText={handleEditInputName}
          onCommitText={handleCommitInputName}
        />
        <StopPropagationView style={{flex: 0.4}}>
          <FlexRow justifyContent={'space-around'}>
            {/* CId */}
            <IconModalButton
              color={categoryDecoration.color}
              iconName={categoryDecoration.icon}
              onPress={handleOpenCIdModal}
            />

            {/* Icon */}
            <IconModalButton
              color={categoryDecoration.color}
              iconName={'circle'}
              onPress={handleOpenIconModal}
            />

            {/* Color */}
            <IconModalButton
              color={categoryDecoration.color}
              iconName={'square'}
              onPress={handleOpenColorModal}
            />

            {deletable && (
              <MyButton onPress={onDeleteCategoryRow}>
                <MyText>X</MyText>
              </MyButton>
            )}
          </FlexRow>
        </StopPropagationView>
        {/* MODALS */}
        {/* Error Modal: Cannot open color picker until valid category is selected */}
        <MyModal
          backgroundStyle={{
            backgroundColor: 'transparent',
          }}
          contentContainerStyle={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          isOpen={errMsg !== ''}
          close={() => setErrMsg('')}>
          <MyText style={{fontWeight: 'bold', color: 'white'}}>{errMsg}</MyText>
        </MyModal>

        <DecorationRowModal isOpen={cIdPickerOpen} setIsOpen={setCIdPickerOpen}>
          <CIdSelector onCommitCId={handleEditCId} />
        </DecorationRowModal>

        <DecorationRowModal
          isOpen={iconPickerOpen}
          setIsOpen={setIconPickerOpen}>
          <IconSelector
            categoryColor={categoryDecoration.color}
            onCommitIcon={handleEditIcon}
          />
        </DecorationRowModal>

        <DecorationRowModal
          isOpen={colorPickerOpen}
          setIsOpen={setColorPickerOpen}>
          <DecorationRowColorPicker
            color={categoryDecoration.color}
            onColorChange={() => {}}
            onColorSelected={(color: string) =>
              handleEditColor(color as HexColor)
            }
          />
        </DecorationRowModal>
      </FlexRow>
    </MyPadding>
  );
};

export default memo<BaseCategoryRowProps>(BaseCategoryRow);
