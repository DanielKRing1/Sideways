import React, {FC} from 'react';

import RatingMenu from './components/RatingMenu/ReduxRatingMenu';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  return <RatingMenu />;
};

export default RateHomeScreen;
