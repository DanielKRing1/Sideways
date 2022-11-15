import React, {FC, useState, useMemo} from 'react';
import {View} from 'react-native';

import RawCollapsible from './RawCollapsible';

type AccordionProps = {
  headerProps: ({id: number | string} & any)[];
  Header: FC<any>;

  initiallyOpen?: number;
  duration?: number;
  children: React.ReactNode;
};
const Accordion: FC<AccordionProps> = props => {
  const {
    headerProps,
    Header,
    initiallyOpen = -1,
    duration = 400,
    children = [],
  } = props;

  // STATE
  const [totalHeight, setTotalHeight] = useState(0);

  const [areOpen, setAreOpen] = useState(
    new Array(headerProps.length)
      .fill(undefined)
      .map((v, i) => i === initiallyOpen),
  );
  const [headerHeights, setHeaderHeights] = useState(
    new Array(headerProps.length).fill(undefined).map(() => 0),
  );

  // HANDLERS
  const handleSetIsOpen = (isOpen: boolean, index: number) => {
    // 1. Handle close
    if (!isOpen) areOpen[index] = false;
    // 2. Handle open
    else {
      // 2.1. Close all
      areOpen.forEach((v, i) => (areOpen[i] = false));

      // 2.2. Open selected Collapsible
      areOpen[index] = true;
    }

    setAreOpen([...areOpen]);
  };

  // MEMOS
  const headerComponents: FC<{}>[] = useMemo(
    () =>
      headerProps.map((v, i) => () => (
        <View
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;

            headerHeights[i] = height;
            setHeaderHeights([...headerHeights]);
          }}>
          <Header {...headerProps[i]} />
        </View>
      )),
    [headerProps, Header],
  );

  const totalHeaderHeight: number = useMemo(
    () => headerHeights.reduce((acc, val) => acc + val, 0),
    [headerHeights],
  );

  return (
    <View
      style={{height: '100%'}}
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setTotalHeight(height);
      }}>
      {children !== null &&
        (children as any[]).map((child: React.ReactNode, i: number) => (
          <RawCollapsible
            key={headerProps[i].id}
            Header={headerComponents[i]}
            isOpen={areOpen[i]}
            setIsOpen={(isOpen: boolean) => handleSetIsOpen(isOpen, i)}
            openHeight={totalHeight - totalHeaderHeight}
            duration={duration}>
            {child}
          </RawCollapsible>
        ))}
    </View>
  );
};

export default Accordion;
