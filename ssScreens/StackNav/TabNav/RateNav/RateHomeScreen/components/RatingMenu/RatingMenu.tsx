import React, {FC} from 'react';

import BaseRatingMenu from './BaseRatingMenu';
import {RATING_TYPE} from './types';

type RatingMenuProps = {};
const RatingMenu: FC<RatingMenuProps> = props => {
  return <BaseRatingMenu ratingType={RATING_TYPE.Rate} />;
};

export default RatingMenu;
