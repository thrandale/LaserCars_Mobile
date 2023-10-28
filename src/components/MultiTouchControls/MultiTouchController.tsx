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
import {cartesianToPolar, polarToCartesian} from '../../Utils';

const createJoystick = (
  x: number,
  y: number,
  onChange: (
    angle: number,
    magnitude: number,
    lockX: boolean,
    lockY: boolean,
  ) => void,
  lockX: boolean,
  lockY: boolean,
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
  const {drivingMode, swapJoysticks, buttons1, buttons2} =
    settings.controlEditor;
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
    function onChangeJoystick(
      a: number,
      m: number,
      lockX: boolean,
      lockY: boolean,
    ) {
      if (lockX && lockY) {
        return;
      } else if (lockX) {
        setAngle(a);
        setMagnitude(m);
      } else if (lockY) {
        setRotation(a < Math.PI ? m : -m);
      } else if (drivingMode.value === DrivingMode.Mecanum) {
        setAngle(a);
        setMagnitude(m);
      } else {
        let {x, y} = polarToCartesian(0, 0, a, m);
        let {radius: xMagnitude, angle: xAngle} = cartesianToPolar(0, 0, x, 0);
        let {radius: yMagnitude, angle: yAngle} = cartesianToPolar(0, 0, 0, y);

        setAngle(yAngle);
        setMagnitude(yMagnitude);
        setRotation(xAngle < Math.PI ? xMagnitude : -xMagnitude);
      }
    }

    let leftLockX = false;
    let leftLockY = false;
    let rightLockX = false;
    let rightLockY = false;

    switch (drivingMode.value) {
      case DrivingMode.Mecanum:
        leftLockX = false;
        leftLockY = false;
        rightLockX = false;
        rightLockY = true;
        break;
      case DrivingMode.Car:
        leftLockX = true;
        leftLockY = false;
        rightLockX = false;
        rightLockY = true;
        break;
      case DrivingMode.Arcade:
        leftLockX = false;
        leftLockY = false;
        rightLockX = true;
        rightLockY = true;
        break;
    }

    if (swapJoysticks.value) {
      const tempLeftX = leftLockX;
      const tempLeftY = leftLockY;
      leftLockX = rightLockX;
      leftLockY = rightLockY;
      rightLockX = tempLeftX;
      rightLockY = tempLeftY;
    }

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
        onChangeJoystick,
        leftLockX,
        leftLockY,
      ),
      createJoystick(
        width - outerRadius * 2 - joystickOffset,
        height - outerRadius * 2 - verticalOffset,
        onChangeJoystick,
        rightLockX,
        rightLockY,
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
    swapJoysticks.value,
  ]);

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
