import React, {FC, useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';

import {CONFIRM_SELECTION_ICON} from 'ssDatabase/api/userJson/category/constants';
import IconInput, {IconInputProps} from 'ssComponents/IconInput/IconInput';
import Grid from 'ssComponents/View/Grid';
import {
  AvailableIcons,
  getAvailableIcons,
} from 'ssDatabase/api/userJson/constants';
import {HexColor} from '../../global';

type IconSelectorProps = {
  categoryColor: HexColor;
  onCommitIcon: (iconName: AvailableIcons) => void;
};
const IconSelector: FC<IconSelectorProps> = props => {
  // PROPS
  const {categoryColor, onCommitIcon} = props;
  console.log(categoryColor);

  // DB: Category Set
  const availableIcons: AvailableIcons[] = getAvailableIcons();

  // THEME
  const {width, height} = useWindowDimensions();

  // LOCAL STATE
  const [tappedIcon, setTappedIcon] = useState<AvailableIcons>();

  // 1. Build the default icons props from available icons
  const iconProps = useMemo(() => {
    return availableIcons.map((icon: AvailableIcons) => ({
      iconName: icon !== tappedIcon ? icon : CONFIRM_SELECTION_ICON,
      name: icon,
      unselectedColor: categoryColor,
      onPress: () => {
        // 1. Force tap a 2nd time
        if (icon !== tappedIcon) {
          setTappedIcon(icon);
          console.log(`Setting tapped icon: ${icon}`);
        }
        // 2. 2nd tap, execute cb + reset tapped icon
        else {
          onCommitIcon(icon);
          setTappedIcon(undefined);
        }
      },
      isSelected: icon === tappedIcon,
    }));
  }, [onCommitIcon]);

  console.log('ICON SELECTOR------------------------');
  console.log(AvailableIcons);
  console.log(availableIcons);
  console.log(iconProps);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
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

export default IconSelector;
