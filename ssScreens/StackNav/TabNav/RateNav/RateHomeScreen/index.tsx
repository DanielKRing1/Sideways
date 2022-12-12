import React, {FC} from 'react';

import Accordion from 'ssComponents/View/Collapsible/Accordion';
import RatingInputSelection from './components/Input/RatingInputSelection';
import RatingOutputOptions from './components/Output/OutputOptions';
import RatingSlider from '../components/RatingSlider';
import RateButton from './components/Rating/RateButton';
import Header from './components/Header';
import DismissKeyboardView from 'ssComponents/View/DismissKeyboardView';

type RateHomeScreenProps = {};
const RateHomeScreen: FC<RateHomeScreenProps> = props => {
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
        <RatingInputSelection />

        {/* OUTPUTS */}
        <RatingOutputOptions />

        {/* RATING */}
        <RatingSlider />
      </Accordion>

      <RateButton />
    </DismissKeyboardView>
  );
};

export default RateHomeScreen;
