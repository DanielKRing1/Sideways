import React, {FC, useMemo} from 'react';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CategorySetCategoryRow from 'ssComponents/CategoryRow/CategorySetCategoryRow';
import GrowingIdList from 'ssComponents/Input/GrowingIdList';
import {DEFAULT_CATEGORY_ICON} from 'ssDatabase/api/userJson/category/constants';

import {
  ASJ_CATEGORY_ROW_KEY,
  GJ_CategoryDecoration,
  GJ_CategorySet,
  GJ_UserCategoryDecoration,
} from 'ssDatabase/api/userJson/category/types';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {useUniqueId} from 'ssHooks/useUniqueId';
import {addC, editC} from 'ssRedux/input/createCategorySet';
import {AppDispatch, RootState} from 'ssRedux/index';
import {hashToColor} from 'ssUtils/color';

export const DEFAULT_CREATE_CS_ACTIVE_SLICE: string =
  'DEFAULT_CREATE_CS_ACTIVE_SLICE';
export const DEFAULT_CREATE_CS_ID: string = 'DEFAULT_CREATE_CS_ID';

type GrowingCategorySetProps = {};
const GrowingCategorySet: FC<GrowingCategorySetProps> = props => {
  // REDUX
  const {cs, cscNameMapping} = useSelector(
    (state: RootState) => state.input.createCategorySet,
  );
  const dispatch: AppDispatch = useDispatch();

  const csUserJsonMap: UserJsonMap = useMemo(() => {
    return {
      [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]: {
        [DEFAULT_CREATE_CS_ACTIVE_SLICE]: DEFAULT_CREATE_CS_ID,
      },
      [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: {
        [DEFAULT_CREATE_CS_ID]: Object.values(cs).reduce<GJ_CategorySet>(
          (acc: GJ_CategorySet, c: GJ_CategoryDecoration) => {
            acc[c.cId] = {
              cId: c.cId,
              icon: c.icon,
              color: c.color,
            };
            return acc;
          },
          {},
        ),
      },
      [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: {},
      [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: cscNameMapping,
      [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]: {},
      [ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING]: {},
    };
  }, [cs, cscNameMapping]);

  console.log('TTTTTTTTTTTTTTT-------------------------');
  console.log(Object.values(cs));

  return (
    <GrowingIdList
      data={Object.values(cs)}
      idGenerator={useUniqueId(5, Object.keys(cs))}
      handleAddInput={(id: string, newText: string) => {
        console.log('HANDLEADDINPUT-------------------------');
        console.log(newText);
        if (newText === undefined) {
          return;
        }
        dispatch(
          addC({
            cName: newText,
            cd: {cId: id, color: hashToColor(id), icon: DEFAULT_CATEGORY_ICON},
          }),
        );
      }}
      handleUpdateInput={(newText: string, index: number, id: string) =>
        dispatch(editC({cId: id, partialUserCD: {name: newText}}))
      }
      RenderItem={({item, index, handleChangeText}) => (
        <NewCategory
          cd={item}
          index={index}
          csUserJsonMap={csUserJsonMap}
          handleChangeCategory={handleChangeText}
        />
      )}
      keyExtractor={item => item.cId}
      genNextDataPlaceholder={(id: string) => ({
        cId: id,
        color: '#ffffff',
        icon: AvailableIcons.bed,
      })}
    />
  );
};

export default GrowingCategorySet;

type NewCategoryProps = {
  cd: GJ_CategoryDecoration;
  index: number;
  csUserJsonMap: UserJsonMap;
  handleChangeCategory: (newCategoryName: string, index: number) => void;
};
const NewCategory: FC<NewCategoryProps> = props => {
  const {cd, index, csUserJsonMap, handleChangeCategory} = props;

  console.log(
    'csUserJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]-----------------------------',
  );
  console.log(csUserJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]);
  console.log(cd.cId);

  return (
    <CategorySetCategoryRow
      disableButtons={
        csUserJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING][
          DEFAULT_CREATE_CS_ID
        ][cd.cId] === undefined
      }
      categoryId={cd.cId}
      csUserJsonMap={csUserJsonMap}
      onCommitInputName={(newCategoryName: string) =>
        handleChangeCategory(newCategoryName, index)
      }
      onDeleteCategoryRow={() => {}}
    />
  );
};
