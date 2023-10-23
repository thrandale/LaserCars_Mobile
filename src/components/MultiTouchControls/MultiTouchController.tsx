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

const createJoystick = (
  x: number,
  y: number,
  label: string,
  onChange: (angle: number, magnitude: number) => void,
  lockX?: boolean,
  lockY?: boolean,
) => {
  const joystickProps: JoystickProps = {
    globalPosition: {x: x, y: y},
    onChange: onChange,
    label: label,
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
    label: 'FIXME',
  };
  return new MultiTouchArcButtons(buttonProps);
};

export default function MultiTouchController(props: {editMode: boolean}) {
  const settings = useContext(SettingsContext);
  const {drivingMode} = settings;
  const {width, height, horizontalOffset, verticalOffset} = settings.window;
  const {outerRadius, innerRadius} = Joystick.size;

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
        horizontalOffset + Joystick.size.outerRadius,
        height - outerRadius * 2 - verticalOffset + Joystick.size.outerRadius,
        -45,
        135,
        3,
        [
          () => console.log('Pressed 1-0'),
          () => console.log('Pressed 1-1'),
          () => console.log('Pressed 1-2'),
        ],
      ),
      createArcButtons(
        width - outerRadius * 2 - horizontalOffset + Joystick.size.outerRadius,
        height - outerRadius * 2 - verticalOffset + Joystick.size.outerRadius,
        45,
        225,
        3,
        [
          () => console.log('Pressed 2-0'),
          () => console.log('Pressed 2-1'),
          () => console.log('Pressed 2-2'),
        ],
      ),
      createJoystick(
        horizontalOffset,
        height - outerRadius * 2 - verticalOffset,
        'Left Joystick',
        onChangeLeftJoystick,
        drivingMode.value === 'tank',
      ),
      createJoystick(
        width - outerRadius * 2 - horizontalOffset,
        height - outerRadius * 2 - verticalOffset,
        'Right Joystick',
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
