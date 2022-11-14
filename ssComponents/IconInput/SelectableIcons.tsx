import React, {FC, useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';

import {CONFIRM_SELECTION_ICON} from 'ssDatabase/api/userJson/category/constants';
import IconInput, {IconInputProps} from 'ssComponents/IconInput/IconInput';
import Grid from 'ssComponents/View/Grid';
import {
  AvailableIcons,
  getAvailableIcons,
} from 'ssDatabase/api/userJson/constants';

type SelectableIconsProps = {
  onConfirmSelection: (iconName: AvailableIcons) => void;
};
const SelectableIcons: FC<SelectableIconsProps> = props => {
  const {onConfirmSelection} = props;

  const {width, height} = useWindowDimensions();

  const [tappedIcon, setTappedIcon] = useState<AvailableIcons | undefined>(
    undefined,
  );

  // 1. Build the default icons props from available icons
  const rawIconProps = useMemo(() => {
    const iconNames: AvailableIcons[] = getAvailableIcons();

    return iconNames.map((iconName: AvailableIcons) => ({
      iconName: iconName !== tappedIcon ? iconName : CONFIRM_SELECTION_ICON,
      name:
        iconName.split('-')[0].length <= 6
          ? iconName.split('-')[0]
          : iconName.split('-')[0].slice(0, 3) + '...',
      onPress: () => {
        // 1. Force tap a 2nd time
        if (iconName !== tappedIcon) {
          setTappedIcon(iconName);
          console.log(`Setting tapped icon: ${iconName}`);
        }
        // 2. 2nd tap, execute cb + reset tapped icon
        else {
          onConfirmSelection(iconName);
          setTappedIcon(undefined);
        }
      },
    }));
  }, [onConfirmSelection]);

  // 2. Map icon props to default props or
  const iconProps: IconInputProps[] = useMemo(() => {
    return rawIconProps.map((props: IconInputProps) =>
      props.iconName !== tappedIcon
        ? props
        : {
            ...props,
            isSelected: true,
            iconName: CONFIRM_SELECTION_ICON,
            onPress: () => {
              // 1. Force tap a 2nd time
              if (props.iconName !== tappedIcon) {
                setTappedIcon(props.iconName as AvailableIcons);
              }
              // 2. 2nd tap, execute cb + reset tapped icon
              else {
                onConfirmSelection(props.iconName);
                setTappedIcon(undefined);
              }
            },
          },
    );
  }, [tappedIcon, onConfirmSelection]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        width: '100%',
        paddingRight: (width * 1) / 20,
        paddingLeft: (width * 1) / 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Grid cols={[5, 4]}>
        {iconProps.map((iProps: IconInputProps) => (
          <IconInput key={iProps.iconName} {...iProps} />
        ))}
      </Grid>
    </ScrollView>
  );
};

export default SelectableIcons;
