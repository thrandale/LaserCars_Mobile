import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import WindowDimensions from '../WindowDimensions';
import Joystick, {JoystickData} from './Joystick';

const {outerRadius, innerRadius} = Joystick.joystickSize;
const initialStickPos = Joystick.initialStickPos;

const createJoystick = (
  x: number,
  y: number,
  windowDimensions: WindowDimensions,
) => {
  const joystickProps: JoystickData = {
    touchId: undefined,
    globalPosition: {x: x, y: y},
    stickPosition: initialStickPos,
    value: {x: 0, y: 0},
    windowDimensions: windowDimensions,
  };
  return new Joystick(joystickProps);
};

export default function MultiTouch(): JSX.Element {
  const windowDimensions = WindowDimensions();
  const {left, right, top, bottom} = windowDimensions;
  const {width, height} = {
    width: Dimensions.get('window').width - left - right,
    height: Dimensions.get('window').height - top - bottom,
  };
  const [joysticks, setJoysticks] = useState<Joystick[]>([]);

  // Create 2 joysticks on mount
  useEffect(() => {
    setJoysticks([
      createJoystick(
        0,
        height - outerRadius * 2 - innerRadius,
        windowDimensions,
      ),
      createJoystick(
        width - outerRadius * 2 - innerRadius,
        height - outerRadius * 2 - innerRadius,
        windowDimensions,
      ),
    ]);
  }, [height, width, windowDimensions]);

  return (
    <View style={styles.container}>
      {joysticks.map((joystick, index) => (
        <Joystick key={index} {...joystick.props} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
});
