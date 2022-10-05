import React, { FC } from 'react';
import styled from 'styled-components/native';
import { FlexCol } from '../../../../ssComponents/Flex';
import MyText from '../../../../ssComponents/ReactNative/MyText';

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
