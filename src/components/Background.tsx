import React from 'react';
import {useTheme} from 'react-native-paper';

import NativeBackground from './NativeComponents/NativeBackground';
import {StyleSheet} from 'react-native';
import {rgbToHex} from '../Utils';

function Background() {
  const theme = useTheme();
  const maxLength = 500;
  const minLength = 100;
  const maxLasers = 30;
  const minSpeed = 5;
  const speedRange = 5;
  const minThickness = 1;
  const maxThickness = 5;

  const laserColors = [
    '#ff0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#0080ff',
    '#0000ff',
    rgbToHex(theme.colors.primary),
    '#ff00ff',
    '#ff0080',
  ];

  // FUTURE: Revisit the "99.9%" to see if we can figure out why "100%" causes
  // the bottom of other pages to be cut off.
  const styles = StyleSheet.create({
    background: {
      width: '99.9%',
      height: '99.9%',
      left: 0,
      top: 0,
      position: 'absolute',
    },
  });

  return (
    <NativeBackground
      style={styles.background}
      backgroundColor={rgbToHex(theme.colors.background)}
      maxLength={maxLength}
      minLength={minLength}
      minSpeed={minSpeed}
      speedRange={speedRange}
      laserColors={laserColors}
      minThickness={minThickness}
      maxThickness={maxThickness}
      maxLasers={maxLasers}
    />
  );
  // }
}

export default Background;
