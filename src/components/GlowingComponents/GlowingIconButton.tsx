/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import GlowingComponent from './GlowingComponent';
import {rgbToRgba} from '../../ColorUtils';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {StyleProp, ViewStyle} from 'react-native';

function GlowingIconButton(props: {
  icon: IconSource;
  style?: StyleProp<ViewStyle>;
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

export default GlowingIconButton;
