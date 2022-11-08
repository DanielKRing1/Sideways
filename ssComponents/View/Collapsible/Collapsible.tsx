import React, {FC, useState} from 'react';

import RawCollapsible from './RawCollapsible';

type CollapsibleProps = {
  Header: FC<{}>;
  initiallyOpen?: boolean;
  openHeight: number;
  duration?: number;
  children?: React.ReactNode;
};
const Collapsible: FC<CollapsibleProps> = props => {
  const {
    Header,
    initiallyOpen = false,
    openHeight,
    duration = 400,
    children,
  } = props;

  // STATE
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <RawCollapsible
      Header={Header}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      openHeight={openHeight}
      duration={duration}
      children={children}
    />
  );
};

export default Collapsible;
