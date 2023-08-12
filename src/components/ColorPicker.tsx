import React, {useContext, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {SettingsContext} from '../contexts/SettingsContext';
import BTController, {Zone} from '../controllers/BTController';

function ColorPicker(props: {
  onColorChange: (color: string) => void;
}): JSX.Element {
  const theme = useTheme();
  const {height} = useContext(SettingsContext).window;

  const size = height - 40;
  const ringThickness = 30;
  const stickSize = ringThickness * 1.8;
  const stickBorderSize = ringThickness / 4;
  const initialPosition = {
    x: -(stickSize - ringThickness) / 2,
    y: size / 2 - ringThickness,
  };
  const stickPosition = new Animated.ValueXY(initialPosition);
  const {currentColor} = useContext(SettingsContext);

  useEffect(() => {
    if (currentColor.value === '') {
      currentColor.setValue('0000FF');
      BTController.getInstance().sendSetColorCommand(
        Zone.FRONT,
        currentColor.value,
      );
      BTController.getInstance().sendSetColorCommand(
        Zone.MIDDLE,
        currentColor.value,
      );
      BTController.getInstance().sendSetColorCommand(
        Zone.BACK,
        currentColor.value,
      );
    }

    const angle = hexToHue(currentColor.value) * (Math.PI / 180) * -1;
    const newPosition = {
      x:
        Math.cos(angle) * (size / 2 - ringThickness / 2) +
        size / 2 -
        stickSize / 2,
      y:
        Math.sin(angle) * (size / 2 - ringThickness / 2) +
        size / 2 -
        stickSize / 2,
    };
    stickPosition.setValue(newPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hslToHex(h: number, s: number, l: number): string {
    // Convert HSL to RGB
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const hueSegment = h / 60;
    const x = chroma * (1 - Math.abs((hueSegment % 2) - 1));

    let r = 0,
      g = 0,
      b = 0;

    if (hueSegment >= 0 && hueSegment < 1) {
      r = chroma;
      g = x;
    } else if (hueSegment >= 1 && hueSegment < 2) {
      r = x;
      g = chroma;
    } else if (hueSegment >= 2 && hueSegment < 3) {
      g = chroma;
      b = x;
    } else if (hueSegment >= 3 && hueSegment < 4) {
      g = x;
      b = chroma;
    } else if (hueSegment >= 4 && hueSegment < 5) {
      r = x;
      b = chroma;
    } else {
      r = chroma;
      b = x;
    }

    const lightnessAdjustment = l - chroma / 2;

    r += lightnessAdjustment;
    g += lightnessAdjustment;
    b += lightnessAdjustment;

    // Convert RGB to hexadecimal
    const rHex = Math.round(r * 255)
      .toString(16)
      .padStart(2, '0');
    const gHex = Math.round(g * 255)
      .toString(16)
      .padStart(2, '0');
    const bHex = Math.round(b * 255)
      .toString(16)
      .padStart(2, '0');

    return `${rHex}${gHex}${bHex}`;
  }

  function hexToHue(hex: string) {
    // Parse the hexadecimal values for red, green, and blue
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the maximum and minimum values among r, g, and b
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate the hue value
    let h;
    if (max === min) {
      h = 0; // Hue is undefined (achromatic)
    } else {
      const delta = max - min;
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
      h *= 60; // Convert hue to degrees
    }

    return h;
  }

  function onMove(event: PanGestureHandlerGestureEvent) {
    // constrain the stick to the outer circle
    const delta = {
      x: event.nativeEvent.x - size / 2,
      y: event.nativeEvent.y - size / 2,
    };
    let angle = Math.atan2(delta.y, delta.x);
    let newPosition: {x: number; y: number};
    // touch is outside the joystick
    newPosition = {
      x:
        Math.cos(angle) * (size / 2 - ringThickness / 2) +
        size / 2 -
        stickSize / 2,
      y:
        Math.sin(angle) * (size / 2 - ringThickness / 2) +
        size / 2 -
        stickSize / 2,
    };
    stickPosition.setValue(newPosition);
    angle = angle < 0 ? (angle * 180) / Math.PI : (angle * 180) / Math.PI - 360;
    angle *= -1;

    const hex = hslToHex(angle, 1, 0.5);

    currentColor.setValue(`${hex}`);
    props.onColorChange(hex);
  }

  const styles = StyleSheet.create({
    image: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
    },
    blackoutCircle: {
      position: 'absolute',
      width: size - ringThickness * 2,
      height: size - ringThickness * 2,
      borderRadius: size / 2,
      backgroundColor: theme.colors.background,
      left: ringThickness,
      top: ringThickness,
    },
    centerCircle: {
      position: 'absolute',
      width: size / 2,
      height: size / 2,
      borderRadius: size / 2,
      backgroundColor: `#${currentColor.value}`,
      left: size / 4,
      top: size / 4,
    },
    stick: {
      borderRadius: 100,
      width: stickSize,
      height: stickSize,
      borderColor: theme.colors.onBackground,
      borderWidth: stickBorderSize,
      position: 'absolute',
      backfaceVisibility: 'hidden',
    },
  });

  return (
    <PanGestureHandler onGestureEvent={onMove} minDist={0}>
      <View>
        <Image
          source={require('../assets/color-picker.png')}
          style={styles.image}
        />
        <View style={styles.blackoutCircle} />
        <View style={styles.centerCircle} />
        <Animated.View
          style={[
            styles.stick,
            {
              transform: [
                {translateX: stickPosition.x},
                {translateY: stickPosition.y},
              ],
            },
          ]}
        />
      </View>
    </PanGestureHandler>
  );
}

export default ColorPicker;
