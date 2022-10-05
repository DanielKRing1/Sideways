import React, { FC } from 'react';

import IconButton, { IconButtonProps } from '../../../ssComponents/Button/IconButton';
import { RequiredExceptFor } from '../../../global';

type PlusButtonProps = {

} & RequiredExceptFor<Omit<IconButtonProps, 'iconName'>, 'children'>;
const PlusButton: FC<PlusButtonProps> = (props) => {
    return (
        <IconButton
            iconName='plus'
            {...props}
        />
    );
}

export default PlusButton;
