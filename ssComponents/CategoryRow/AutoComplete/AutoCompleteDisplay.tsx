import React, {FC, memo, useState} from 'react';
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

export type AutoCompleteListProps<T> = {item: T; index: number};
type AutoCompleteDisplayProps = {
  data: any[];
  onSelectSuggestion: (selectedText: string) => void;
  hideWhileSearching?: boolean;
  listFirst?: boolean;

  ListRenderItem: FC<AutoCompleteListProps<any>>;
  NoInputsDisplay: FC;
} & AutoCompleteDecorationProps;
const AutoCompleteDisplay: FC<AutoCompleteDisplayProps> = props => {
  // PROPS
  const {
    data,
    value: searchInput,
    onChangeText: setSearchInput,
    hideWhileSearching = false,
    listFirst = false,
    onSubmitEditing = () => {},
    onSelectSuggestion,
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
    onSelectSuggestion(selectedInputName);
  };

  const AutoCompleteList: FC = memo(() => (
    <>
      {(!isSearching || !hideWhileSearching) && (
        <>
          {data.length > 0 ? (
            <FlatList
              data={data}
              renderItem={({item, index}) => (
                <ListRenderItem item={item} index={index} />
              )}
              keyExtractor={item => `${item.id}`}
            />
          ) : (
            <NoInputsDisplay />
          )}
        </>
      )}
    </>
  ));

  return (
    <FlexCol>
      {listFirst && <AutoCompleteList />}

      <ScrollView keyboardShouldPersistTaps="handled">
        <AutoCompleteCategory
          placeholder="Add an input..."
          value={searchInput}
          onChangeText={setSearchInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          onSelectEntityId={handleSelectSuggestion}
        />
      </ScrollView>

      {!listFirst && <AutoCompleteList />}
    </FlexCol>
  );
};

export default AutoCompleteDisplay;
