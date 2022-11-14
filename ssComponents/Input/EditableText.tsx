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

type EditableTextProps = {
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholder?: string;
  text: string;
  onEditText?: (newText: string) => void;
  onCommitText: (newText: string) => void;
};
const EditableText: FC<EditableTextProps> = props => {
  const {
    style = {},
    textStyle = {},
    placeholder,
    text,
    onEditText = () => {},
    onCommitText,
  } = props;

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text);

  // useRef
  const textInputRef = useRef<TextInput>(null);

  // useEffect
  useEffect(() => {
    if (isEditing === true) setEditableText(text);
  }, [isEditing]);
  useEffect(() => {
    if (textInputRef.current) textInputRef.current.focus();
  }, [textInputRef.current]);

  // HANDLERS

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
    <View style={style}>
      {!isEditing ? (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MyText style={textStyle}>{text || placeholder}</MyText>
        </TouchableOpacity>
      ) : (
        <MyTextInput
          ref={textInputRef}
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
