import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';

import MyModal from 'ssComponents/View/Modal';

type DecorationRowModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children?: React.ReactNode;
};
const DecorationRowModal: FC<DecorationRowModalProps> = (props) => {
    const { isOpen, setIsOpen, children } = props;

    const { height, width } = useWindowDimensions();

    return (
        <MyModal
            isOpen={isOpen}
            close={() => setIsOpen(false)}
            contentContainerStyle={{
                height: height*2/3,
                width: width,
                paddingTop: height*1/15,
                paddingBottom: height*1/15,
                backgroundColor: 'rgba(50,50,50,1)',
                borderRadius: 10,
            }}
        >
            {children}
        </MyModal>
    )
}

export default DecorationRowModal;
