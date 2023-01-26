import React, {FC} from 'react';
import {View} from 'react-native';
import IconButton, {IconButtonProps} from 'ssComponents/Button/IconButton';

type CategoryRowIconButtonProps = {} & IconButtonProps;

const CategoryRowIconButton: FC<CategoryRowIconButtonProps> = props => {
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

export default CategoryRowIconButton;
