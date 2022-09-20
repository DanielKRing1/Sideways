import React, { FC } from 'react';
import styled from 'styled-components/native';
import { FlexCol } from '../../../../components/Flex';
import MyText from '../../../../components/ReactNative/MyText';

type DateCardProps = {
    month: string;
    day: number | string;
};
const DateCard: FC<DateCardProps> = (props) => {
    const { month, day } = props;

    return (
        <FlexCol>
            <MyText>{day}</MyText>
            <MyText>{month}</MyText>
        </FlexCol>
    );
}

export default DateCard;
