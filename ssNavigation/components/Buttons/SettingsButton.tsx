import React, { FC } from 'react';

import IconButton, { IconButtonProps } from '../../../ssComponents/Button/IconButton';
import { RequiredExceptFor } from '../../../global';

type SettingsButtonProps = {

} & RequiredExceptFor<Omit<IconButtonProps, 'iconName'>, 'children'>;
const SettingsButton: FC<SettingsButtonProps> = (props) => {
    return (
        <IconButton
            iconName='gear'
            {...props}
        />
    );
}

export default SettingsButton;
