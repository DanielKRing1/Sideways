import React, { FC } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

type StickyScrollViewProps = {
    stickyHeaderIndices: number[];
    children: React.ReactNode;
} & ScrollViewProps;

const StickyScrollView: FC<StickyScrollViewProps> = (props) => {
    const { stickyHeaderIndices, children } = props;
  
    return (
      <ScrollView
        stickyHeaderIndices={stickyHeaderIndices}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    )
};

export default StickyScrollView;
