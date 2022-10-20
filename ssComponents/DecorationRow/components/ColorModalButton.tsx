import React, { FC } from 'react';

import IconButton, { IconButtonProps } from 'ssComponents/Button/IconButton';
import { RequiredExceptFor } from '../../../global';

type ColorModalButtonProps = {
    color: string;
} & RequiredExceptFor<Omit<IconButtonProps, 'iconName'>, 'children'>;
const ColorModalButton: FC<ColorModalButtonProps> = (props) => {
    return (
        <IconButton
            iconName='square'
            {...props}
        />
    );
}

export default ColorModalButton;
