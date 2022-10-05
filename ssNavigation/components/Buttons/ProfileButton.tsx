import React, { FC } from 'react';

import IconButton, { IconButtonProps } from '../../../ssComponents/Button/IconButton';
import { RequiredExceptFor } from '../../../global';

type ProfileButtonProps = {

} & RequiredExceptFor<Omit<IconButtonProps, 'iconName'>, 'children'>;
const PlusButton: FC<ProfileButtonProps> = (props) => {
    return (
        <IconButton
            iconName='user'
            {...props}
        />
    );
}

export default PlusButton;
