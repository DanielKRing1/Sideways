import React, {FC, useContext, useEffect, useState} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// DB DRIVER
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {DbLoaderContext} from 'ssContexts/DbLoader/DbLoader';

// REDUX
import {AppDispatch, RootState} from 'ssRedux/index';

// COMPONENTS
import {SearchableFlatList} from 'ssComponents/Search/SearchableFlatList';
import {SidewaysSnapshotRow} from 'ssDatabase/api/core/types';
import {deserializeDate, serializeDateNum} from 'ssUtils/date';
import StackCard from './StackCard';
import UndoRateModal from './UndoRateModal';
import UndoRatingMenu from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen/components/RatingMenu/UndoRatingMenu';
import {setSnapshot} from 'ssRedux/undorateSidewaysSlice';

const createRenderItem =
  (
    openUpdateRatingModal: (
      itemInfo: ListRenderItemInfo<SidewaysSnapshotRow>,
    ) => void,
  ) =>
  (itemInfo: ListRenderItemInfo<SidewaysSnapshotRow>) =>
    (
      <StackCard
        itemInfo={itemInfo}
        openUpdateRatingModal={() => openUpdateRatingModal(itemInfo)}
      />
    );

type StackListProps = {};
const StackList: FC<StackListProps> = props => {
  // LOCAL STATE
  const [searchIndex, setSearchIndex] = useState<number>(-1);
  const [stack, setStack] = useState<SidewaysSnapshotRow[]>([]);

  // REDUX
  const {activeSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {stackStartDate, readStackSignature} = useSelector(
    (state: RootState) =>
      state.readSidewaysSlice.internalReadReducer.readStackReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  // DB DRIVER
  const {isLoaded} = useContext(DbLoaderContext);

  // 1. Get fresh stack list
  useEffect(() => {
    // if(!activeSliceName) return setStack([]);

    (async () => {
      const freshStack: SidewaysSnapshotRow[] = await dbDriver.getList(
        activeSliceName,
      );
      setStack(freshStack);
    })();
  }, [isLoaded, activeSliceName, readStackSignature]);

  // 2. Get stack search index
  useEffect(() => {
    // if(!activeSliceName) return setSearchIndex(-1);

    (async () => {
      let index: number = await dbDriver.searchStack(
        activeSliceName,
        deserializeDate(stackStartDate),
      );
      setSearchIndex(index);
    })();
  }, [stackStartDate, stack]);

  console.log(searchIndex);
  console.log('searchIndex');

  const [updateRatingModalOpen, setUpdateRatingModalOpen] = useState(false);
  const handleOpenUpdateRatingModal = ({
    item,
    index,
  }: ListRenderItemInfo<SidewaysSnapshotRow>) => {
    dispatch(
      setSnapshot({
        indexToUpdate: index,
        originalSnapshot: {
          ...item,
          timestamp: serializeDateNum(item.timestamp),
        },
      }),
    );
    setUpdateRatingModalOpen(true);
  };

  // LIST COMPONENT
  const renderItem = createRenderItem(handleOpenUpdateRatingModal);

  return (
    <>
      <SearchableFlatList
        searchIndex={searchIndex}
        // @ts-ignore
        // TODO: See if this works
        data={stack}
        renderItem={renderItem}
        keyExtractor={(item: SidewaysSnapshotRow): string =>
          item.timestamp.toISOString()
        }
      />

      <UndoRateModal
        isOpen={updateRatingModalOpen}
        setIsOpen={setUpdateRatingModalOpen}>
        <UndoRatingMenu />
      </UndoRateModal>
    </>
  );
};

export default StackList;
