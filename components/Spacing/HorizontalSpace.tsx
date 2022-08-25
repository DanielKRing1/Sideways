import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

export type HorizontalSpaceProps = {
    spacing?: number;
};
const HorizontalSpace: FC<HorizontalSpaceProps> = (props) => {
    const { spacing=10 } = props;

    return (
        <View style={{ width: spacing }}>

        </View>
    );
}

export default HorizontalSpace;
