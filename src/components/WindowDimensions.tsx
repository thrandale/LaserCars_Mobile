import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import {useMemo} from 'react';

interface WindowDimensions {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function WindowDimensions() {
  const {left, right, top, bottom} = useSafeAreaInsets();

  return useMemo(() => {
    return {
      width: Dimensions.get('window').width - left - right,
      height: Dimensions.get('window').height - top - bottom,
      left: left,
      right: right,
      top: top,
      bottom: bottom,
    };
  }, [left, right, top, bottom]);
}

export default WindowDimensions;
