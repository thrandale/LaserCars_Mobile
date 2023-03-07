import React, {useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Joystick, {JoystickData} from './Joystick';

const {outerRadius, innerRadius} = Joystick.joystickSize;
const initialStickPos = Joystick.initialStickPos;

export default function MultiTouch(): JSX.Element {
  const {left, right, top, bottom} = useSafeAreaInsets();
  const {width, height} = {
    width: Dimensions.get('window').width - left - right,
    height: Dimensions.get('window').height - top - bottom,
  };
  const [joysticks, setJoysticks] = useState<JoystickData[]>([
    {
      touch: undefined,
      offset: {x: 0, y: 0},
      globalPosition: {
        x: innerRadius,
        y: height - outerRadius * 2 - innerRadius,
      },
      stickPosition: initialStickPos,
      value: {x: 0, y: 0},
    },
    {
      touch: undefined,
      offset: {x: 0, y: 0},
      globalPosition: {
        x: width - outerRadius * 2 - innerRadius,
        y: height - outerRadius * 2 - innerRadius,
      },
      stickPosition: initialStickPos,
      value: {x: 0, y: 0},
    },
  ]);

  const updateJoystick = (index: number, joystick: JoystickData) => {
    setJoysticks([
      ...joysticks.slice(0, index),
      joystick,
      ...joysticks.slice(index + 1),
    ]);
  };

  const handleTouch = (event: GestureResponderEvent, id: number) => {
    const {nativeEvent} = event;
    const joystick = joysticks[id];

    if (!joystick.touch) {
      // if the joystick is not already touched, set the touch
      updateJoystick(id, {...joystick, touch: nativeEvent});
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
        updateJoystick(id, {
          ...joystick,
          stickPosition: newPosition,
        });
      } else {
        // touch is inside the joystick
        const newPosition = {
          x: delta.x + initialStickPos.x,
          y: delta.y + initialStickPos.y,
        };
        updateJoystick(id, {
          ...joystick,
          stickPosition: {
            x: newPosition.x,
            y: newPosition.y,
          },
        });
      }
    }
  };

  const handleRelease = (event: GestureResponderEvent, index: number) => {
    const {nativeEvent} = event;
    const joystick = joysticks[index];
    if (joystick.touch && !nativeEvent.touches.includes(joystick.touch)) {
      updateJoystick(index, {
        ...joystick,
        touch: undefined,
        stickPosition: initialStickPos,
        value: {x: 0, y: 0},
      });
    }
  };

  return (
    <View style={styles.container}>
      {joysticks.map((joystick, index) => (
        <Joystick
          key={index}
          joystick={joystick}
          handleTouch={(event: GestureResponderEvent) =>
            handleTouch(event, index)
          }
          handleRelease={(event: GestureResponderEvent) =>
            handleRelease(event, index)
          }
          id={index}
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
