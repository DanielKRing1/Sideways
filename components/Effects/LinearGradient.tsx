import { FC } from 'react';
import { LinearGradient as ExpoLinearGradiant } from 'expo-linear-gradient';

type LinearGradientProps = {
    children: React.ReactNode;
    fromLeft: boolean;
};
export const LinearGradient: FC<LinearGradientProps> = (props) => {
    const { children, fromLeft } = props;

    return (
        <ExpoLinearGradiant colors={fromLeft ? ['#fafafa', 'white'] : ['white', '#fbfbfb']} end={{ x: 0.5, y: 0.5 }}>
            {children}
        </ExpoLinearGradiant>
    );
};
