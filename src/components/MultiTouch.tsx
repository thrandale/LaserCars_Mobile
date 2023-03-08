import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Joystick, {JoystickProps} from './Joystick';

const {outerRadius, innerRadius} = Joystick.joystickSize;
const initialStickPos = Joystick.initialStickPos;

const createJoystick = (
  x: number,
  y: number,
  handleTouch: (event: GestureResponderEvent, joystick: Joystick) => void,
  handleRelease: (event: GestureResponderEvent, joystick: Joystick) => void,
  key: number,
) => {
  const joystickProps: JoystickProps = {
    joystickData: {
      touch: undefined,
      globalPosition: {x, y},
      stickPosition: initialStickPos,
      value: {x: 0, y: 0},
    },
    handleTouch,
    handleRelease,
    key: key,
  };
  return new Joystick(joystickProps);
};

export default function MultiTouch(): JSX.Element {
  const {left, right, top, bottom} = useSafeAreaInsets();
  const {width, height} = {
    width: Dimensions.get('window').width - left - right,
    height: Dimensions.get('window').height - top - bottom,
  };
  const [joysticks, setJoysticks] = useState<Joystick[]>([]);

  const handleTouch = useCallback(
    (event: GestureResponderEvent, joystick: Joystick) => {
      const {nativeEvent} = event;

      if (!joystick.touch) {
        // if the joystick is not already touched, set the touch
        joystick.touch = nativeEvent;
      } else if (joystick.touch.identifier === nativeEvent.identifier) {
        // if the touch matches the joystick, update the stick position
        const delta = {
          x: nativeEvent.pageX - left - outerRadius - joystick.globalPosition.x,
          y: nativeEvent.pageY - top - outerRadius - joystick.globalPosition.y,
        };
        const radius = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

        if (radius > outerRadius) {
          // touch is outside the joystick
          const angle = Math.atan2(delta.y, delta.x);
          const newPosition = {
            x: Math.cos(angle) * outerRadius + initialStickPos.x,
            y: Math.sin(angle) * outerRadius + initialStickPos.y,
          };
          joystick.stickPosition = newPosition;
        } else {
          // touch is inside the joystick
          const newPosition = {
            x: delta.x + initialStickPos.x,
            y: delta.y + initialStickPos.y,
          };
          joystick.stickPosition = newPosition;
        }
      }
    },
    [left, top],
  );

  const handleRelease = useCallback(
    (event: GestureResponderEvent, joystick: Joystick) => {
      const {nativeEvent} = event;
      if (joystick.touch && !nativeEvent.touches.includes(joystick.touch)) {
        joystick.reset();
      }
    },
    [],
  );

  // Create 2 joysticks on mount
  useEffect(() => {
    setJoysticks([
      createJoystick(
        innerRadius,
        height - outerRadius * 2 - innerRadius,
        handleTouch,
        handleRelease,
        0,
      ),
      createJoystick(
        width - outerRadius * 2 - innerRadius,
        height - outerRadius * 2 - innerRadius,
        handleTouch,
        handleRelease,
        1,
      ),
    ]);
  }, [height, width, handleTouch, handleRelease]);

  return (
    <View style={styles.container}>
      {joysticks.map(joystick => (
        <Joystick
          key={joystick.key}
          joystickData={joystick.joystickData}
          handleTouch={handleTouch}
          handleRelease={handleRelease}
        />
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
