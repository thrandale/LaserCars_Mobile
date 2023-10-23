import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useWindow = () => {
  const {left, right, top, bottom} = useSafeAreaInsets();
  const horizontalOffset = Math.max(left, right, 50);
  const verticalOffset = Math.max(top, bottom, 30);
  const [dimensions, setDimensions] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({screen}) => {
      setDimensions(screen);
    });
    return () => subscription?.remove();
  });

  return {
    ...dimensions,
    left,
    right,
    top,
    bottom,
    horizontalOffset,
    verticalOffset,
  };
};
