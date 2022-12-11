import React, {FC, useMemo, useState} from 'react';
import {useWindowDimensions, ScrollView} from 'react-native';

import {CONFIRM_SELECTION_ICON} from 'ssDatabase/api/userJson/category/constants';
import IconInput, {IconInputProps} from 'ssComponents/IconInput/IconInput';
import Grid from 'ssComponents/View/Grid';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {useSelector} from 'react-redux';
import {RootState} from 'ssRedux/index';
import {
  cIdToCD,
  cIdToCName,
  getCSCIds,
  snToCSId,
} from 'ssDatabase/hardware/realm/userJson/utils';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {GJ_CategoryDecoration} from 'ssDatabase/api/userJson/category/types';

type CIdSelectorProps = {
  onCommitCId: (commitedCId: string) => void;
};
const CIdSelector: FC<CIdSelectorProps> = props => {
  // PROPS
  const {onCommitCId} = props;

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );

  // REDUX USERJSONMAP
  const csId: string = snToCSId(activeSliceName, fullUserJsonMap);
  const cIds: string[] = getCSCIds(csId, fullUserJsonMap);
  console.log('CIdSelector');
  console.log(fullUserJsonMap);
  console.log('CIDSSSS');
  console.log(cIds);

  // THEME
  const {width, height} = useWindowDimensions();

  // LOCAL STATE
  const [tappedCId, setTappedCId] = useState<string>();

  // 1. Build the default icons props from available icons
  const iconProps = useMemo(() => {
    return cIds.map((cId: string) => {
      const cName: string = cIdToCName(cId, fullUserJsonMap);
      const cd: GJ_CategoryDecoration = cIdToCD(
        activeSliceName,
        cId,
        fullUserJsonMap,
      );

      return {
        cId,
        iconName: cId !== tappedCId ? cd.icon : CONFIRM_SELECTION_ICON,
        unselectedColor: cIdToCD(activeSliceName, cId, fullUserJsonMap).color,
        name:
          cName.split('-')[0].length <= 6
            ? cName.split('-')[0]
            : cName.split('-')[0].slice(0, 3) + '...',
        onPress: () => {
          // 1. Force tap a 2nd time
          if (cId !== tappedCId) {
            setTappedCId(cId);
            console.log(
              `Setting tapped icon: cId - ${cId}, cName: ${cName}, cd: ${cd}`,
            );
          }
          // 2. 2nd tap, execute cb + reset tapped icon
          else {
            onCommitCId(cId);
            setTappedCId(undefined);
          }
        },
        isSelected: cId === tappedCId,
      };
    });
  }, [tappedCId, onCommitCId]);

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
        {iconProps.map((iProps: IconInputProps & {cId: string}) => (
          <IconInput key={iProps.cId} {...iProps} />
        ))}
      </Grid>
    </ScrollView>
  );
};

export default CIdSelector;
