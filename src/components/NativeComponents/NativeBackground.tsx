import {StyleProp, ViewStyle, requireNativeComponent} from 'react-native';

interface NativeBackgroundProps {
  backgroundColor: string;
  minLength: number;
  maxLength: number;
  minSpeed: number;
  speedRange: number;
  laserColors: string[];
  minThickness: number;
  maxThickness: number;
  maxLasers: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Native component for the background on Android.
 */
export default requireNativeComponent<NativeBackgroundProps>(
  'NativeBackground',
);
