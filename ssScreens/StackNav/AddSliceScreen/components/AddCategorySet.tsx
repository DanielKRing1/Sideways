import React, {FC, useMemo} from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import CategorySetCategoryRow from 'ssComponents/CategoryRow/CategorySetCategoryRow';
import MyText from 'ssComponents/ReactNative/MyText';

import {
  ASJ_CATEGORY_ROW_KEY,
  GJ_CategorySet,
  GJ_UserCategoryDecoration,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {RootState} from 'ssRedux/index';

export const DEFAULT_CREATE_CS_ACTIVE_SLICE: string =
  'DEFAULT_CREATE_CS_ACTIVE_SLICE';
export const DEFAULT_CREATE_CS_ID: string = 'DEFAULT_CREATE_CS_ID';

type AddCategorySetProps = {};
const AddCategorySet: FC<AddCategorySetProps> = props => {
  // REDUX
  const {categorySetName, categories} = useSelector(
    (state: RootState) => state.createCategorySetSlice,
  );

  const csUserJsonMap: UserJsonMap = useMemo(() => {
    return {
      [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]: {
        [DEFAULT_CREATE_CS_ACTIVE_SLICE]: DEFAULT_CREATE_CS_ID,
      },
      [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: {
        [DEFAULT_CREATE_CS_ID]: Object.values(
          categories,
        ).reduce<GJ_CategorySet>(
          (acc: GJ_CategorySet, c: GJ_UserCategoryDecoration) => {
            acc[c.name] = {
              cId: c.name,
              icon: c.icon,
              color: c.color,
            };
            return acc;
          },
          {},
        ),
      },
      [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: {},
      [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: {},
      [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]: {},
      [ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING]: {},
    };
  }, [categories]);

  return (
    <>
      <MyText>{categorySetName}</MyText>
      <FlatList
        data={Object.values(categories)}
        renderItem={({item}) => (
          <NewCategory userCD={item} csUserJsonMap={csUserJsonMap} />
        )}
        keyExtractor={item => item.name}
      />
    </>
  );
};

export default AddCategorySet;

type NewCategoryProps = {
  userCD: GJ_UserCategoryDecoration;
  csUserJsonMap: UserJsonMap;
};
const NewCategory: FC<NewCategoryProps> = props => {
  const {userCD, csUserJsonMap} = props;

  return (
    <CategorySetCategoryRow
      inputName={userCD.name}
      csUserJsonMap={csUserJsonMap}
      onCommitInputName={() => {}}
      onDeleteCategoryRow={() => {}}
    />
  );
};
