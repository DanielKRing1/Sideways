import React, {FC} from 'react';

import DismissKeyboardView from 'ssComponents/View/DismissKeyboardView';
import Accordion from 'ssComponents/View/Collapsible/Accordion';
import Header from './Header';
import RatingInputDisplay from '../Input/RatingInputDisplay';
import RatingOutputOptions from '../Output/OutputOptions';
import RatingSlider from '../Rating/RatingInput';
import RateButton from '../Rating/RateButton';
import {RATING_TYPE} from './types';

type BaseRatingMenuProps = {
  ratingType: RATING_TYPE;
};
const BaseRatingMenu: FC<BaseRatingMenuProps> = props => {
  return (
    <DismissKeyboardView
      style={{
        height: '100%',
      }}>
      <Accordion
        headerProps={[
          {id: 'Inputs', title: 'Inputs'},
          {id: 'Outputs', title: 'Outputs'},
          {id: 'Rating', title: 'Rating'},
        ]}
        Header={({title}: {title: string}) => <Header title={title} />}
        initiallyOpen={0}
        duration={400}>
        {/* INPUTS */}
        <RatingInputDisplay {...props} />

        {/* OUTPUTS */}
        <RatingOutputOptions {...props} />

        {/* RATING */}
        <RatingSlider {...props} />
      </Accordion>

      <RateButton {...props} />
    </DismissKeyboardView>
  );
};

export default BaseRatingMenu;
