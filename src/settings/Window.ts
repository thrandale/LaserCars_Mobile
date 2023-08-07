import {Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useWindow = () => {
  const {left, right, top, bottom} = useSafeAreaInsets();
  const {width, height} = {
    width: Dimensions.get('window').width - left - right,
    height: Dimensions.get('window').height,
  };

  return {width, height, left, right, top, bottom};
};
