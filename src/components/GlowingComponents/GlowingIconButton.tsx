import {Button, IconButton, useTheme} from 'react-native-paper';
import GlowingComponent from './GlowingComponent';
import {rgbToRgba} from '../../ColorUtils';

export default function GlowingIconButton(props: {
  icon: string;
  style?: any;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <GlowingComponent>
      <IconButton
        icon={props.icon}
        mode="contained"
        style={[props.style, {margin: 0}]}
        onPress={props.onPress}
        size={35}
        iconColor={theme.colors.onBackground}
        rippleColor={rgbToRgba(theme.colors.shadow, 0.5)}
      />
    </GlowingComponent>
  );
}
