import React, {useContext} from 'react';
import {SettingsContext} from '../contexts/SettingsContext';
import {useTheme} from 'react-native-paper';

import NativeBackground from './NativeComponents/NativeBackground';
import {PixelRatio, StyleSheet} from 'react-native';
import {rgbToHex} from '../Utils';

function Background() {
  const theme = useTheme();
  const {window} = useContext(SettingsContext);
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

  const styles = StyleSheet.create({
    background: {
      // converts dpi to px, provide desired height
      width: PixelRatio.getPixelSizeForLayoutSize(
        window.width + window.leftSA + window.rightSA,
      ),
      height: PixelRatio.getPixelSizeForLayoutSize(
        window.height + window.topSA + window.bottomSA,
      ),
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
