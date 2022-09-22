import React, { FC } from 'react';

import IconButton, { IconButtonProps } from '../../../components/Button/IconButton';

type BackButtonProps = {

} & Omit<IconButtonProps, 'iconName'>;
const BackButton: FC<BackButtonProps> = (props) => {
    return (
        <IconButton
            iconName='angle-double-left'
            {...props}
        />
    );
}

export default BackButton;
