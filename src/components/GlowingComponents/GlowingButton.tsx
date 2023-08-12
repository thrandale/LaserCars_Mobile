import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import GlowingComponent from './GlowingComponent';
import {rgbToRgba} from '../../ColorUtils';
import {StyleProp, ViewStyle} from 'react-native';

function GlowingButton(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
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

export default GlowingButton;
