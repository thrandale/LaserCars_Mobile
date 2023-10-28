import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useWindow = () => {
  const {left, right, top, bottom} = useSafeAreaInsets();
  const horizontalOffset = Math.max(left, right);
  const verticalOffset = Math.max(top, bottom, 30);
  const [dimensions, setDimensions] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({screen}) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  });

  return {
    width: dimensions.width,
    height: dimensions.height,
    leftSA: left,
    rightSA: right,
    topSA: top,
    bottomSA: bottom,
    horizontalOffset,
    verticalOffset,
  };
};
