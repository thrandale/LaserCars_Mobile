import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import Joystick, {JoystickProps} from './Joystick';
import MultiTouchComponent from './MultiTouchComponent';
import {SettingsContext} from '../../contexts/SettingsContext';
import WeaponDataReceiver from '../../controllers/WeaponDataReceiver';
import BTController from '../../controllers/BTController';
import HitReceiver from '../../controllers/HitReceiver';
import MultiTouchArcButtons, {
  MultiTouchArcButtonsProps,
} from './MultiTouchArcButtons';
import {DrivingMode} from '../../settings/DrivingModes';

const createJoystick = (
  x: number,
  y: number,
  onChange: (angle: number, magnitude: number) => void,
  lockX?: boolean,
  lockY?: boolean,
) => {
  const joystickProps: JoystickProps = {
    globalPosition: {x: x, y: y},
    onChange: onChange,
    lockX: lockX,
    lockY: lockY,
  };
  return new Joystick(joystickProps);
};

const createArcButtons = (
  x: number,
  y: number,
  startAngle: number,
  endAngle: number,
  numButtons: number,
  onPress: (() => void)[],
) => {
  const buttonProps: MultiTouchArcButtonsProps = {
    globalPosition: {
      x: x,
      y: y,
    },
    startAngle: startAngle,
    endAngle: endAngle,
    onPress: onPress,
    numButtons: numButtons,
  };
  return new MultiTouchArcButtons(buttonProps);
};

export default function MultiTouchController(props: {editMode: boolean}) {
  const settings = useContext(SettingsContext);
  const {drivingMode, buttons1, buttons2} = settings.controlEditor;
  const {width, height, horizontalOffset, verticalOffset} = settings.window;
  const {outerRadius, innerRadius} = Joystick.size;
  const joystickOffset = horizontalOffset + 30;

  const [multiTouchComponents, setMultiComponents] = useState<
    MultiTouchComponent<any>[]
  >([]);

  const [angle, setAngle] = useState<number>(0);
  const [magnitude, setMagnitude] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Create 2 joysticks on mount
  useEffect(() => {
    setMultiComponents([
      createArcButtons(
        joystickOffset + Joystick.size.outerRadius,
        height - outerRadius * 2 - verticalOffset + Joystick.size.outerRadius,
        -45,
        135,
        parseInt(buttons1.value, 10),
        [
          () => console.log('Pressed 1-0'),
          () => console.log('Pressed 1-1'),
          () => console.log('Pressed 1-2'),
        ],
      ),
      createArcButtons(
        width - outerRadius * 2 - joystickOffset + Joystick.size.outerRadius,
        height - outerRadius * 2 - verticalOffset + Joystick.size.outerRadius,
        45,
        225,
        parseInt(buttons2.value, 10),
        [
          () => console.log('Pressed 2-0'),
          () => console.log('Pressed 2-1'),
          () => console.log('Pressed 2-2'),
        ],
      ),
      createJoystick(
        joystickOffset,
        height - outerRadius * 2 - verticalOffset,
        onChangeLeftJoystick,
        drivingMode.value === DrivingMode.Tank,
      ),
      createJoystick(
        width - outerRadius * 2 - joystickOffset,
        height - outerRadius * 2 - verticalOffset,
        onChangeRightJoystick,
        false,
        true,
      ),
    ]);
  }, [
    outerRadius,
    innerRadius,
    drivingMode,
    horizontalOffset,
    verticalOffset,
    width,
    height,
    joystickOffset,
    buttons1,
    buttons2,
  ]);

  function onChangeLeftJoystick(a: number, m: number) {
    setAngle(a);
    setMagnitude(m);
  }

  function onChangeRightJoystick(a: number, m: number) {
    setRotation(a < Math.PI ? m : -m);
  }

  useEffect(() => {
    BTController.getInstance().sendDriveCommand(angle, magnitude, rotation);
  }, [angle, magnitude, rotation]);

  return (
    <View>
      {multiTouchComponents.map((component: MultiTouchComponent<any>, index) =>
        component instanceof Joystick ? (
          <Joystick
            key={index}
            {...(component.props as JoystickProps)}
            editMode={props.editMode}
          />
        ) : (
          <MultiTouchArcButtons
            key={index}
            {...(component.props as MultiTouchArcButtonsProps)}
            editMode={props.editMode}
          />
        ),
      )}
      <HitReceiver />
      <WeaponDataReceiver />
    </View>
  );
}
