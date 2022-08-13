import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import DatePicker from '../../../../../components/Input/DatePicker';

// REDUX
import { setStartDate } from '../../../../../redux/readSidewaysSlice/readStack';
import { RootState } from '../../../../../redux';

const ALL_TIME_TEXT = 'All Time';

type StackDatePickerProps = {

};
const StackDatePicker: FC<StackDatePickerProps> = (props) => {
    const {} = props;

    const dispatch = useDispatch();
    const { stackStartDate, readStackSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.internalReadReducer.readStackReducer }));

    // PROP DRILLING STATE
    const [ isOpen, setIsOpen ] = useState(false);

    const open = () => {
        setIsOpen(true);
    };
    const close = () => {
        setIsOpen(false);
    };

    // REDUX
    const getDisplay = useCallback(() => stackStartDate === null ? ALL_TIME_TEXT : stackStartDate.toDateString(), [stackStartDate]);
    const getDisplayDate = useCallback(() => stackStartDate === null ? new Date() : stackStartDate, [stackStartDate]);
    const handleSetDate = (newDate: Date) => {
        dispatch(setStartDate(newDate));
    };

    return (
        <DatePicker
            buttonText={getDisplay()}
            date={getDisplayDate()}
            setDate={handleSetDate}
            isOpen={isOpen}
            open={open}
            close={close}
        />
    );
};

export default StackDatePicker;
