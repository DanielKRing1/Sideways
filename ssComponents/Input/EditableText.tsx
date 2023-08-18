/**
 * Render a Text component by default
 * When clicked, render a TextInput
 * Upon blur, render a Text component again
 *
 * My demo at https://snack.expo.dev/@asianpersonn/decorationrow
 *
 * 'onEditText': Called on each keystroke
 * 'onCommitText': Called when textinput blurs
 */

import React, {FC, useEffect, useRef, useState} from 'react';
import {
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import MyTextInput from 'ssComponents/ReactNative/MyTextInput';
import MyTouchableOpacity from 'ssComponents/ReactNative/MyTouchableOpacity';

type EditableTextProps = {
  editable?: boolean;
  containerStyle?: TextStyle;
  placeholder?: string;
  text: string;
  onEditText?: (newText: string) => void;
  onCommitText: (newText: string) => void;
};
const EditableText: FC<EditableTextProps> = props => {
  const {
    editable = false,
    containerStyle = {},
    placeholder,
    text,
    onEditText = () => {},
    onCommitText,
  } = props;

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text);

  // useEffect
  useEffect(() => {
    // Reset the editable text
    if (isEditing === true) {
      setEditableText(text);
    }
  }, [isEditing]);

  // HANDLERS

  const handleStartEditing = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  // Called every keystroke
  const handleChangeText = (newText: string) => {
    // Prop
    onEditText(newText);
    // Local
    setEditableText(newText);
  };

  // Called on blur, commit text
  const handleBlur = () => {
    onCommitText(editableText);
    setIsEditing(false);
  };

  return (
    <View style={containerStyle}>
      {!isEditing ? (
        <MyTouchableOpacity disabled={!editable} onPress={handleStartEditing}>
          <MyText style={{width: '100%'}}>{text || placeholder}</MyText>
        </MyTouchableOpacity>
      ) : (
        <MyTextInput
          autoFocus={true}
          style={{
            borderWidth: 1,
            borderColor: 'black',
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          value={editableText}
          onChangeText={handleChangeText}
        />
      )}
    </View>
  );
};

export default EditableText;
