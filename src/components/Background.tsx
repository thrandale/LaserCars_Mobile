/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  Canvas,
  Line,
  Group,
  SkPoint,
  vec,
  BlurMask,
  Fill,
} from '@shopify/react-native-skia';
import {
  FrameInfo,
  SharedValue,
  interpolate,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import {SettingsContext} from '../contexts/SettingsContext';
import {useTheme} from 'react-native-paper';

import NativeBackground from './NativeComponents/NativeBackground';
import {Dimensions, PixelRatio, Platform} from 'react-native';
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

  const lasers: {
    start: SharedValue<SkPoint>;
    end: SharedValue<SkPoint>;
    length: SharedValue<number>;
    color: SharedValue<string>;
    speed: SharedValue<number>;
    thickness: SharedValue<number>;
  }[] = [];

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

  if (Platform.OS === 'ios') {
    for (let i = 0; i < maxLasers; i++) {
      const length = useSharedValue(
        Math.random() * (maxLength - minLength) + minLength,
      );
      const start = useSharedValue(
        vec(
          Math.random() * (window.width + window.height) -
            length.value -
            window.height,
          Math.random() * (window.height + length.value * 2) - length.value,
        ),
      );
      const speed = useSharedValue(Math.random() * speedRange + minSpeed);

      lasers.push({
        start: start,
        end: useDerivedValue(() => {
          return vec(
            start.value.x + length.value,
            start.value.y + length.value,
          );
        }, [start]),
        length: length,
        color: useSharedValue(
          laserColors[Math.floor(Math.random() * laserColors.length)],
        ),
        speed: speed,
        thickness: useDerivedValue(() => {
          return interpolate(
            speed.value,
            [minSpeed, minSpeed + speedRange],
            [maxThickness, minThickness],
          );
        }),
      });
    }

    useFrameCallback((frameInfo: FrameInfo) => {
      if (frameInfo.timeSincePreviousFrame != null) {
        lasers.forEach(laser => {
          laser.start.value = vec(
            laser.start.value.x +
              (frameInfo.timeSincePreviousFrame as number) / laser.speed.value,
            laser.start.value.y +
              (frameInfo.timeSincePreviousFrame as number) / laser.speed.value,
          );

          if (
            laser.start.value.x > window.width ||
            laser.start.value.y > window.height
          ) {
            laser.length.value =
              Math.random() * (maxLength - minLength) + minLength;
            laser.start.value = vec(
              Math.random() * (window.width + window.height) -
                laser.length.value -
                window.height,
              -laser.length.value,
            );
            laser.color.value =
              laserColors[Math.floor(Math.random() * laserColors.length)];
            laser.speed.value = Math.random() * speedRange + minSpeed;
          }
        });
      }
    }, true);

    return (
      <Canvas
        renderToHardwareTextureAndroid
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <Fill color={theme.colors.background} />
        <Group>
          {lasers.map((laser, i) => (
            <Line
              key={i}
              p1={laser.start}
              p2={laser.end}
              strokeWidth={laser.thickness}
              color={laser.color}
              style="stroke">
              <BlurMask blur={7} style="solid" />
            </Line>
          ))}
        </Group>
      </Canvas>
    );
  } else {
    return (
      <NativeBackground
        style={{
          // converts dpi to px, provide desired height
          width: PixelRatio.getPixelSizeForLayoutSize(
            Dimensions.get('window').width,
          ),
          height: PixelRatio.getPixelSizeForLayoutSize(
            Dimensions.get('window').height,
          ),
          left: 0,
          top: 0,
          position: 'absolute',
          backgroundColor: 'transparent',
        }}
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
  }
}

export default Background;
