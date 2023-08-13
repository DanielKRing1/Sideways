import {useCreateDefinedCategorySet} from './useCreateDefinedCategorySet';
import {useHydrateApp} from './useHydrateApp';
import {useHydrateJournal} from './useHydrateJournal';
import {useStartCacheAllDbInputsOutputs} from './useStartCacheAllDbInputsOutputs';

export default () => {
  useCreateDefinedCategorySet();
  useStartCacheAllDbInputsOutputs();

  useHydrateApp();
  useHydrateJournal();

  return <></>;
};
