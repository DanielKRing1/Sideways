import React, { FC, useMemo, useState } from 'react';

import { FlexCol } from 'ssComponents/Flex';
import IconInput, { IconInputProps } from './IconInput';
import { AvailableIcons, CONFIRM_SELECTION_ICON, getAvailableIcons } from 'ssDatabase/api/userJson/decoration/constants';
import Grid from 'ssComponents/View/Grid';

type SelectableIconsProps = {
    onConfirmSelection: (iconName: AvailableIcons) => void;
};
const SelectableIcons: FC<SelectableIconsProps> = (props) => {
    const { onConfirmSelection } = props;

    const [ tappedIcon, setTappedIcon ] = useState<AvailableIcons | undefined>(undefined);

    const iconProps: IconInputProps[] = useMemo(() => {
        const iconNames: AvailableIcons[] = getAvailableIcons();
        
        return iconNames.map((iconName: AvailableIcons) => ({
            iconName: iconName !== tappedIcon ? iconName : CONFIRM_SELECTION_ICON,
            onPress: () => {
                // 1. Force tap a 2nd time
                if(iconName !== tappedIcon) setTappedIcon(iconName);
                // 2. 2nd tap, execute cb + reset tapped icon
                else {
                    onConfirmSelection(iconName);
                    setTappedIcon(undefined);
                }
            },
        }))
    }, [onConfirmSelection]);

    return (
        <FlexCol
            alignItems='center'
        >
            <Grid
                cols={[5, 4]}
            >
            {
                iconProps.map((props: IconInputProps) => <IconInput {...props} />)
            }
            </Grid>
        </FlexCol>
    )
};

export default SelectableIcons;
