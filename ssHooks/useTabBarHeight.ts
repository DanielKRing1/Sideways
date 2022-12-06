import {useState, useEffect} from 'react';
import {useWindowDimensions} from 'react-native';

export const useTabBarHeight = () => {
  const [barHeight, setBarHeight] = useState(0);

  const {height: screenHeight} = useWindowDimensions();

  useEffect(() => {
    setBarHeight((screenHeight * 1) / 10);
  }, [screenHeight]);

  return {
    barHeight,
    remainingHeight: screenHeight - barHeight,
  };
};
