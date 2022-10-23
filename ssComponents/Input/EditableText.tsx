/**
 * Render a Text component by default
 * When clicked, render a TextInput
 * Upon blur, render a Text component again
 * 
 * My demo at https://snack.expo.dev/@asianpersonn/decorationrow
 */

import React, { FC, useEffect, useRef, useState } from 'react';
import { TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import MyTextInput from 'ssComponents/ReactNative/MyTextInput';

type EditableTextProps = {
  style?: ViewStyle;
  textStyle?: TextStyle;
  text: string;
  handleCommitText: (newText: string) => void;
};
const EditableText: FC<EditableTextProps> = (props) => {

  const { style={}, textStyle={}, text, handleCommitText } = props;

  // Local state
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editableText, setEditableText ] = useState('');

  // useRef
  const textInputRef = useRef<TextInput>(null);

  // useEffect
  useEffect(() => {
    if(isEditing === true) setEditableText(text);
  }, [isEditing]);
  useEffect(() => {
    if(textInputRef.current) textInputRef.current.focus();
  }, [textInputRef.current]);

  // Handlers
  const handleBlur = () => {
    handleCommitText(editableText);
    setIsEditing(false);
  }

  return (
    <View style={style}>
    {
      !isEditing ?
      <TouchableOpacity
        onPress={() => setIsEditing(true)}
      >
        <MyText
          style={textStyle}
        >{text}</MyText>
      </TouchableOpacity>
      :
      <MyTextInput
        ref={textInputRef}
        onBlur={handleBlur}
        value={editableText}
        onChangeText={setEditableText}
      />
    }
    </View>
  )
}

export default EditableText;
