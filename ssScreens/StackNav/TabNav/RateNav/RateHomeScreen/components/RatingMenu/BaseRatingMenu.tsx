import React, {FC} from 'react';

import Accordion from 'ssComponents/View/Collapsible/Accordion';
import DismissKeyboardView from 'ssComponents/View/DismissKeyboardView';
import RatingInputSelection, {
  RatingInputSelectionProps,
} from '../Input/RatingInputSelection';
import RatingOutputOptions, {RatingOutputOptionsProps} from '../OutputOptions';
import RateButton from '../RateButton';
import Header from '../Header';
import RatingSlider, {
  RatingSliderProps,
} from '../../../components/RatingSlider';

type RatingMenuProps = {} & RatingInputSelectionProps &
  RatingOutputOptionsProps &
  RatingSliderProps;
const RatingMenu: FC<RatingMenuProps> = props => {
  const {
    inputs,
    onAddInput,
    onEditInput,
    onDeleteCategoryRow,

    outputs,
    onSetOutputs,

    rating,
    onSetRating,
  } = props;

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
        <RatingInputSelection
          inputs={inputs}
          onAddInput={onAddInput}
          onEditInput={onEditInput}
          onDeleteCategoryRow={onDeleteCategoryRow}
        />

        {/* OUTPUTS */}
        <RatingOutputOptions outputs={outputs} onSetOutputs={onSetOutputs} />

        {/* RATING */}
        <RatingSlider rating={rating} onSetRating={onSetRating} />
      </Accordion>

      <RateButton />
    </DismissKeyboardView>
  );
};

export default RatingMenu;
