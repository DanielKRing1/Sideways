import React, {FC} from 'react';
import {View} from 'react-native';
import IconButton, {IconButtonProps} from 'ssComponents/Button/IconButton';

type IconModalButtonProps = {} & IconButtonProps;

const IconModalButton: FC<IconModalButtonProps> = props => {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <IconButton {...props} />
    </View>
  );
};

export default IconModalButton;
