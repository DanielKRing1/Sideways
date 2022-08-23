import React, { FC } from 'react';

import IconButton, { IconButtonProps } from '../../../components/Button/IconButton';

type PlusButtonProps = {

} & Omit<IconButtonProps, 'iconName'>;
const PlusButton: FC<PlusButtonProps> = (props) => {
    return (
        <IconButton
            iconName='angle-double-left'
            {...props}
        />
    );
}

export default PlusButton;