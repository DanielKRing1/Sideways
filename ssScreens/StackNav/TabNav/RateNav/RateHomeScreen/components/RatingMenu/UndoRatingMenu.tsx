import React, {FC} from 'react';
import BaseRatingMenu from './BaseRatingMenu';

import {RATING_TYPE} from './types';

type UndoRatingMenuProps = {};
const UndoRatingMenu: FC<UndoRatingMenuProps> = props => {
  return <BaseRatingMenu ratingType={RATING_TYPE.UndoRate} />;
};

export default UndoRatingMenu;
