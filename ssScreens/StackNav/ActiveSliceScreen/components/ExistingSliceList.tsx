import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import {FlatList} from 'react-native';
import styled, {DefaultTheme} from 'styled-components/native';
import {useSelector} from 'react-redux';

// DB DRIVER
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {DbLoaderContext} from 'ssContexts/DbLoader/DbLoader';

// REDUX
import {RootState} from 'ssRedux/index';

// COMPONENTS
import {FlexRow} from 'ssComponents/Flex';

// HOOKS
import {useTrie} from 'ssHooks/useTrie';

// UTILS
import {abbrDate} from 'ssUtils/date';
import MyText from 'ssComponents/ReactNative/MyText';
import DateCard from './DateCard';
import MyButton from 'ssComponents/ReactNative/MyButton';
import {ExistingSlice} from 'ssDatabase/api/core/types';

type ExistingSliceCardProps = {
  item: ExistingSlice;
  index?: number;
};
const createExistingSliceCard =
  (
    onSelectSlice: (sliceName: string) => void,
    onDeleteSlice: (sliceName: string) => void,
  ): FC<ExistingSliceCardProps> =>
  props => {
    const {item} = props;

    const {month = undefined, day = undefined} =
      item.lastLogged !== undefined ? abbrDate(item.lastLogged) : {};

    console.log(item.lastLogged);

    return (
      <StyledTouchableOpacity onPress={() => onSelectSlice(item.sliceName)}>
        <FlexRow justifyContent="space-between">
          {month === undefined || day === undefined ? (
            <MyText>Unused</MyText>
          ) : (
            <DateCard month={month} day={day} />
          )}

          <MyText>{item.sliceName}</MyText>

          <MyButton onPress={() => onDeleteSlice(item.sliceName)}>
            <MyText>X</MyText>
          </MyButton>
        </FlexRow>
      </StyledTouchableOpacity>
    );
  };

const StyledTouchableOpacity = styled.TouchableOpacity`
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.darkRed};
  border-width: 1px;
  border-radius: 5px;

  marginleft: 25px;
  marginright: 25px;
  paddingtop: 15px;
  paddingbottom: 15px;
`;

type ExistingSliceListProps = {
  onSelectSlice: (sliceName: string) => void;
  onDeleteSlice: (sliceName: string) => void;
};
const ExistingSliceList: FC<ExistingSliceListProps> = props => {
  const {onSelectSlice, onDeleteSlice} = props;

  const {
    setValues: setTrieValues,
    search,
    autoComplete,
  } = useTrie<ExistingSlice>((existingSlice: ExistingSlice) =>
    existingSlice.sliceName.toLocaleLowerCase(),
  );
  const [lastLogged, setLastLogged] = useState<ExistingSlice[]>([]);

  // REDUX
  const {activeSliceName, searchedSliceName, readSSSignature} = useSelector(
    (state: RootState) => ({...state.readSidewaysSlice.toplevelReadReducer}),
  );

  // DB DRIVER
  // TODO Possibly remove this
  const {isLoaded} = useContext(DbLoaderContext);

  // 1. Get lastLogged slices
  useEffect(() => {
    (async () => {
      const lastLogged: ExistingSlice[] = await dbDriver.getLastLoggedSlices();
      setLastLogged(lastLogged);
    })();
  }, [isLoaded]);

  // 2. Fill lastLogged slices into Trie
  useEffect(() => {
    setTrieValues(searchedSliceName.toLocaleLowerCase(), lastLogged);
  }, [lastLogged]);

  // 3. Get autoComplete list, based on searchedSliceName
  useEffect(() => {
    search(searchedSliceName.toLocaleLowerCase());
  }, [searchedSliceName]);

  // LIST COMPONENT
  const ExistingSliceCard = useMemo(
    () => createExistingSliceCard(onSelectSlice, onDeleteSlice),
    [onSelectSlice, onDeleteSlice],
  );

  return <FlatList data={autoComplete} renderItem={ExistingSliceCard} />;
};

export default ExistingSliceList;
