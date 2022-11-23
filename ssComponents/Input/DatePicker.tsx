import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import MyText from '../ReactNative/MyText';

type MyDatePickerProps = {
  buttonText: string;
  mode?: 'datetime' | 'date' | 'time';

  date: Date;
  setDate: (newDate: Date) => void;

  isOpen: boolean;
  open: () => void;
  close: () => void;
};
const MyDatePicker: FC<MyDatePickerProps> = props => {
  const {buttonText, mode = 'date', date, setDate, isOpen, open, close} = props;

  const handleConfirm = (date: Date) => {
    setDate(date);
    close();
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <TouchableOpacity onPress={() => open()}>
        <MyText>Select Date: {buttonText}</MyText>
      </TouchableOpacity>

      <DatePicker
        mode={mode}
        modal
        open={isOpen}
        date={date}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default MyDatePicker;
