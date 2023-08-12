/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Shadow} from 'react-native-shadow-2';
import {useTheme} from 'react-native-paper';
import {rgbToRgba} from '../../ColorUtils';

export default function GlowingComponent(props: {
  children: any;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <Shadow
      distance={10}
      startColor={rgbToRgba(theme.colors.shadow, 0.5)}
      endColor={rgbToRgba(theme.colors.shadow, 0)}
      style={{borderRadius: 50}}>
      {props.children}
    </Shadow>
  );
}
