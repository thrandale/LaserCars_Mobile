import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import GlowingComponent from './GlowingComponent';
import {rgbToRgba} from '../../Utils';
import {StyleProp, ViewStyle} from 'react-native';

function GlowingButton(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  margin?: number;
  borderRadius?: number;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <GlowingComponent
      disabled={props.disabled}
      style={{margin: props.margin}}
      borderRadius={props.borderRadius}>
      <Button
        mode="contained"
        onPress={props.onPress}
        style={props.style}
        disabled={props.disabled}
        rippleColor={rgbToRgba(theme.colors.shadow, 0.6)}>
        {props.children}
      </Button>
    </GlowingComponent>
  );
}

export default GlowingButton;
