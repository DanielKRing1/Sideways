import React, { FC, useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleProp } from 'react-native';

type EditableTextProps = {
  style?: StyleProp<View>;
  text: string;
  handleCommitText: (newText: string) => void;
};
const EditableText: FC<EditableTextProps> = (props) => {

  const { style, text, handleCommitText } = props;

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
    // @ts-ignore
    <View style={style}>
    {
      !isEditing ?
      <TouchableOpacity
        onPress={() => setIsEditing(true)}
      >
        <Text>{text}</Text>
      </TouchableOpacity>
      :
      <TextInput
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
