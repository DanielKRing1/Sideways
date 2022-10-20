import React, { FC } from 'react';

import IconButton, { IconButtonProps } from 'ssComponents/Button/IconButton';

type IconModalButtonProps = {
    color: string;
} & IconButtonProps;
const IconModalButton: FC<IconModalButtonProps> = (props) => {
    return (
        <IconButton
            {...props}
        />
    );
}

export default IconModalButton;
