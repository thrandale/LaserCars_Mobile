import {Button, useTheme} from 'react-native-paper';
import GlowingComponent from './GlowingComponent';
import {rgbToRgba} from '../../ColorUtils';

export default function GlowingButton(props: {
  children: any;
  style?: any;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <GlowingComponent>
      <Button
        mode="contained"
        style={props.style}
        onPress={props.onPress}
        rippleColor={rgbToRgba(theme.colors.shadow, 0.6)}>
        {props.children}
      </Button>
    </GlowingComponent>
  );
}
