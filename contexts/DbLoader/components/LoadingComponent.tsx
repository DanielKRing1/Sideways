import React, { FC } from 'react';
import styled from 'styled-components/native';

import MyText from '../../../components/ReactNative/MyText';

type LoadingComponentProps = {

};
export const LoadingComponent: FC<LoadingComponentProps> = (props) => {
    const {  } = props;

    return (
        <MyText>Loading...</MyText>
    )
}
