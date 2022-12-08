import {useState, useEffect} from 'react';
import {useWindowDimensions} from 'react-native';

export const useTabBarHeight = () => {
  const [botNavHeight, setBotNavHeight] = useState(0);
  const [topNavHeight, setTopNavHeight] = useState(0);

  const {height: screenHeight} = useWindowDimensions();

  useEffect(() => {
    setTopNavHeight((screenHeight * 1) / 10);
    setBotNavHeight((screenHeight * 1) / 14);
  }, [screenHeight]);

  return {
    topNavHeight,
    botNavHeight,
    remainingHeight: screenHeight - topNavHeight - botNavHeight,
  };
};
