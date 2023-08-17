import MyText from 'ssComponents/ReactNative/MyText';

import {useHydrateApp} from './useHydrateApp';
import {useHydrateJournal} from './useHydrateJournal';

type AppStateManagerProps = {
  children: React.ReactNode;
};
export default (props: AppStateManagerProps) => {
  // Props
  const {children} = props;

  // Hooks
  useHydrateApp();
  const {isLoaded, load, closeAll} = useHydrateJournal();

  return <>{isLoaded ? {children} : <LoadingComponent />}</>;
};

type LoadingComponentProps = {};
export const LoadingComponent = (props: LoadingComponentProps) => {
  const {} = props;

  return <MyText>Loading...</MyText>;
};
