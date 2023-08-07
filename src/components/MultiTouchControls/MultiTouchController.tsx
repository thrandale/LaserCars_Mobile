import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import Joystick, {JoystickProps} from './Joystick';
import MultiButton, {MultiButtonProps} from './MultiButton';
import MultiTouchComponent from './MultiTouchComponent';
import {SettingsContext} from '../../contexts/SettingsContext';
import WeaponDataReceiver from '../../controllers/WeaponDataReceiver';
import BTController from '../../controllers/BTController';
import HitReceiver from '../../controllers/HitReceiver';

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

const createButton = (
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onPress: () => void,
) => {
  const buttonProps: MultiButtonProps = {
    globalPosition: {x: x, y: y},
    width: width,
    height: height,
    label: label,
    onPress: onPress,
    editMode: false,
  };
  return new MultiButton(buttonProps);
};

export default function MultiTouchController(props: {editMode: boolean}) {
  const settings = useContext(SettingsContext);
  const {drivingMode} = settings;
  const {width, height} = settings.window;
  const {outerRadius, innerRadius} = Joystick.size;

  const [multiTouchComponents, setMultiComponents] = useState<
    MultiTouchComponent<any>[]
  >([]);

  const [angle, setAngle] = useState<number>(0);
  const [magnitude, setMagnitude] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Create 2 joysticks on mount
  useEffect(() => {
    const bSize = 75;

    setMultiComponents([
      createJoystick(
        innerRadius,
        height - outerRadius * 2 - innerRadius,
        'Left Joystick',
        onChangeLeftJoystick,
        drivingMode.value === 'tank',
      ),
      createJoystick(
        width - outerRadius * 2 - innerRadius,
        height - outerRadius * 2 - innerRadius,
        'Right Joystick',
        onChangeRightJoystick,
        false,
        true,
      ),
      createButton(200, 195, bSize, bSize, 'Fire 0', () => {
        BTController.getInstance().sendFireCommand([0]);
      }),
      createButton(200, 280, bSize, bSize, 'Fire 1', () => {
        BTController.getInstance().sendFireCommand([1]);
      }),
      createButton(width - 200 - bSize, 195, bSize, bSize, 'Fire 2', () => {
        BTController.getInstance().sendFireCommand([2]);
      }),
      createButton(width - 200 - bSize, 280, bSize, bSize, 'Fire All', () => {
        BTController.getInstance().sendFireCommand([0, 1, 2]);
      }),
    ]);
  }, [height, width, outerRadius, innerRadius, drivingMode]);

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
          <MultiButton
            key={index}
            {...(component.props as MultiButtonProps)}
            editMode={props.editMode}
          />
        ),
      )}
      <HitReceiver />
      <WeaponDataReceiver />
    </View>
  );
}
