import React, {FC} from 'react';

import RatingMenu from './components/RatingMenu/RatingMenu';
import {RATING_TYPE} from './components/RatingMenu/types';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
  return <RatingMenu ratingType={RATING_TYPE.Rate} />;
};

export default RateHomeScreen;
