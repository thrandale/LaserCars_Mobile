import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Joystick, {JoystickProps} from './Joystick';
import MultiTouchComponent from './MultiTouchComponent';

const {outerRadius, innerRadius} = Joystick.joystickSize;
const initialStickPos = Joystick.initialStickPos;

const createJoystick = (
  x: number,
  y: number,
  handleTouch: (
    event: GestureResponderEvent,
    component: MultiTouchComponent,
  ) => void,
  handleRelease: (
    event: GestureResponderEvent,
    component: MultiTouchComponent,
  ) => void,
  key: number,
) => {
  const joystickProps: JoystickProps = {
    componentData: {
      touch: undefined,
      globalPosition: {x: x, y: y},
      handleTouch,
      handleRelease,
      key: key,
    },
    joystickData: {
      stickPosition: initialStickPos,
      value: {x: 0, y: 0},
    },
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
    (event: GestureResponderEvent, component: MultiTouchComponent) => {
      const {nativeEvent} = event;
      if (component instanceof Joystick) {
        if (!component.touch) {
          // if the joystick is not already touched, set the touch
          component.touch = nativeEvent;
        } else if (component.touch.identifier === nativeEvent.identifier) {
          // if the touch matches the joystick, update the stick position
          const delta = {
            x:
              nativeEvent.pageX -
              left -
              outerRadius -
              component.globalPosition.x,
            y:
              nativeEvent.pageY -
              top -
              outerRadius -
              component.globalPosition.y,
          };
          const radius = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

          if (radius > outerRadius) {
            // touch is outside the joystick
            const angle = Math.atan2(delta.y, delta.x);
            const newPosition = {
              x: Math.cos(angle) * outerRadius + initialStickPos.x,
              y: Math.sin(angle) * outerRadius + initialStickPos.y,
            };
            component.stickPosition = newPosition;
          } else {
            // touch is inside the joystick
            const newPosition = {
              x: delta.x + initialStickPos.x,
              y: delta.y + initialStickPos.y,
            };
            component.stickPosition = newPosition;
          }
        }
      }
    },
    [left, top],
  );

  const handleRelease = useCallback(
    (event: GestureResponderEvent, component: MultiTouchComponent) => {
      const {nativeEvent} = event;
      if (component.touch && !nativeEvent.touches.includes(component.touch)) {
        if (component instanceof Joystick) {
          component.reset();
        }
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
          componentData={joystick.componentData}
          joystickData={joystick.joystickData}
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
