/**
 * Modal with transparent background
 * Interact with child content, without closing modal, but
 * Click outside of child content and close modal
 *
 * My demo at https://snack.expo.dev/@asianpersonn/modal
 */

import React, {FC} from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';

type MyModalProps = {
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  backgroundStyle?: ViewStyle;
};
const MyModal: FC<MyModalProps> = props => {
  const {
    isOpen,
    close,
    children,
    contentContainerStyle = {},
    backgroundStyle = {},
  } = props;

  const {width, height} = useWindowDimensions();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => close()}>
      <TouchableWithoutFeedback onPress={close}>
        <View
          style={{
            height: height,
            width: width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...backgroundStyle,
          }}>
          <View
            onStartShouldSetResponder={event => true}
            onTouchEnd={e => {
              e.stopPropagation();
            }}
            style={{
              backgroundColor: '#fff',
              ...contentContainerStyle,
            }}>
            <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MyModal;
