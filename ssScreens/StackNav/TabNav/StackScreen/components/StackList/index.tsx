import React, {FC, useContext, useEffect, useState} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {useSelector} from 'react-redux';

// DB DRIVER
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {DbLoaderContext} from 'ssContexts/DbLoader/DbLoader';

// REDUX
import {RootState} from 'ssRedux/index';

// COMPONENTS
import {SearchableFlatList} from 'ssComponents/Search/SearchableFlatList';
import {
  SidewaysSnapshotRow,
  SidewaysSnapshotRowPrimitive,
} from 'ssDatabase/api/core/types';
import {deserializeDate} from 'ssUtils/date';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';
import StackCard from './StackCard';
import UndoRateModal from './UndoRateModal';
import UndoRatingMenu from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen/components/RatingMenu/UndoRatingMenu';

const createRenderItem =
  (openUpdateRatingModal: () => void) =>
  (itemInfo: ListRenderItemInfo<SidewaysSnapshotRowPrimitive>) =>
    (
      <StackCard
        itemInfo={itemInfo}
        openUpdateRatingModal={openUpdateRatingModal}
      />
    );

type StackListProps = {};
const StackList: FC<StackListProps> = props => {
  // LOCAL STATE
  const [searchIndex, setSearchIndex] = useState<number>(-1);
  const [stack, setStack] = useState<Realm.List<SidewaysSnapshotRow> | []>([]);

  // REDUX
  const {activeSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {stackStartDate, readStackSignature} = useSelector(
    (state: RootState) =>
      state.readSidewaysSlice.internalReadReducer.readStackReducer,
  );

  // DB DRIVER
  const {isLoaded} = useContext(DbLoaderContext);

  // 1. Get fresh stack list
  useEffect(() => {
    // if(!activeSliceName) return setStack([]);

    (async () => {
      const freshStack: Realm.List<SidewaysSnapshotRow> | [] =
        await dbDriver.getStack(activeSliceName);
      setStack(freshStack);
    })();
  }, [isLoaded, activeSliceName]);

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
  const handleOpenUpdateRatingModal = () => {
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
