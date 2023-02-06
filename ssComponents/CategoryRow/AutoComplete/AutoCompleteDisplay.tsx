import React, {FC, memo, useMemo, useState} from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  ScrollView,
  TextInputSubmitEditingEventData,
} from 'react-native';

import {FlexCol} from 'ssComponents/Flex';
import AutoCompleteCategory, {
  AutoCompleteDecorationProps,
} from './AutoCompleteCategory';

export type AutoCompleteListProps<T> = {item: T & {id: string}; index: number};
type AutoCompleteDisplayProps = {
  data: (any & {id: string})[];
  hideWhileSearching?: boolean;
  listFirst?: boolean;

  ListRenderItem: FC<AutoCompleteListProps<any>>;
  NoInputsDisplay: FC;
} & AutoCompleteDecorationProps;
const AutoCompleteDisplay: FC<AutoCompleteDisplayProps> = props => {
  // PROPS
  const {
    data,
    hideWhileSearching = false,
    listFirst = false,
    onSubmitEditing = () => {},
    onSelectEntityId,
    ListRenderItem,
    NoInputsDisplay,
  } = props;

  // LOCAL STATE
  const [isSearching, setIsSearching] = useState(false);

  // HANDLERS
  // SearchInput
  const handleFocus = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);
  // SearchInput
  const handleSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    onSubmitEditing(e);
  };

  // SearchSuggestions
  const handleSelectSuggestion = (selectedInputName: string) => {
    onSelectEntityId(selectedInputName);
  };

  const AutoCompleteList = useMemo(
    () => (
      <>
        {(!isSearching || !hideWhileSearching) && (
          <>
            {data.map((d, index) => (
              <ListRenderItem key={d.id} item={d} index={index} />
            ))}
          </>

          // <>
          //   {data.length > 0 ? (
          //     <FlatList
          //       data={data}
          //       renderItem={({item, index}) => (
          //         <ListRenderItem item={item} index={index} />
          //       )}
          //       keyExtractor={item => `${item.id}`}
          //     />
          //   ) : (
          //     <NoInputsDisplay />
          //   )}
          // </>
        )}
      </>
    ),
    [data, data.length],
  );

  return (
    <>
      {listFirst && AutoCompleteList}

      <AutoCompleteCategory
        {...props}
        onSubmitEditing={handleSubmitEditing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSelectEntityId={handleSelectSuggestion}
      />

      {!listFirst && AutoCompleteList}

      {data.length === 0 && <NoInputsDisplay />}
    </>
  );
};

export default AutoCompleteDisplay;
