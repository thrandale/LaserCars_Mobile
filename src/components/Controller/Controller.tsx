import React, {useEffect, useState} from 'react';
import {GestureResponderEvent, View} from 'react-native';
import WindowDimensions from '../WindowDimensions';
import {JoystickData} from './Joystick';
import Joystick from './Joystick';
import MultiButton, {MultiButtonData} from './MultiButton';

const createJoystick = (
  x: number,
  y: number,
  windowDimensions: WindowDimensions,
) => {
  const joystickProps: JoystickData = {
    globalPosition: {x: x, y: y},
    windowDimensions: windowDimensions,
  };
  return new Joystick(joystickProps);
};

const createButton = (
  x: number,
  y: number,
  width: number,
  height: number,
  windowDimensions: WindowDimensions,
  onPress: (event: GestureResponderEvent) => void,
) => {
  const buttonProps: MultiButtonData = {
    globalPosition: {x: x, y: y},
    windowDimensions: windowDimensions,
    width: width,
    height: height,
    onPress: onPress,
  };
  return new MultiButton(buttonProps);
};

export default function MultiTouch(): JSX.Element {
  const windowDimensions = WindowDimensions();
  const {width, height} = windowDimensions;
  const {outerRadius, innerRadius} = Joystick.joystickSize;

  const [joysticks, setJoysticks] = useState<Joystick[]>([]);
  const [buttons, setButtons] = useState<MultiButton[]>([]);

  // Create 2 joysticks on mount
  useEffect(() => {
    setJoysticks([
      createJoystick(
        0,
        height - outerRadius * 2 - innerRadius / 2,
        windowDimensions,
      ),
      createJoystick(
        width - outerRadius * 2,
        height - outerRadius * 2 - innerRadius / 2,
        windowDimensions,
      ),
    ]);

    setButtons([
      createButton(150, 185, 75, 75, windowDimensions, () => {
        console.log('button 1 pressed');
      }),
      createButton(150, 275, 75, 75, windowDimensions, () => {
        console.log('button 2 pressed');
      }),
      createButton(525, 185, 75, 75, windowDimensions, () => {
        console.log('button 3 pressed');
      }),
      createButton(525, 275, 75, 75, windowDimensions, () => {
        console.log('button 4 pressed');
      }),
    ]);
  }, [height, width, windowDimensions, outerRadius, innerRadius]);

  return (
    <View>
      {joysticks.map((joystick, index) => (
        <Joystick key={index} {...joystick.props} />
      ))}
      {buttons.map((button, index) => (
        <MultiButton key={index} {...button.props} />
      ))}
    </View>
  );
}
