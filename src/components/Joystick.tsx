import React from 'react';
import {NativeTouchEvent, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

export interface JoystickData {
  touch: NativeTouchEvent | undefined;
  offset: {x: number; y: number};
  globalPosition: {x: number; y: number};
  stickPosition: {x: number; y: number};
  value: {x: number; y: number};
}

interface JoystickProps {
  joystick: JoystickData;
  handleTouch: Function;
  handleRelease: Function;
  id: number;
}

const outerLineWidth = 6;
const innerLineWidth = outerLineWidth / 2;
const outerColor = 'darkgray';
const innerColor = 'gray';

class Joystick extends React.Component<JoystickProps> {
  static joystickSize = {
    outerRadius: 75,
    innerRadius: 75 / 2,
  };
  static initialStickPos = {
    x:
      Joystick.joystickSize.outerRadius -
      Joystick.joystickSize.innerRadius -
      outerLineWidth,
    y:
      Joystick.joystickSize.outerRadius -
      Joystick.joystickSize.innerRadius -
      outerLineWidth,
  };

  // update the joystick value
  componentDidUpdate() {
    const {joystick} = this.props;
    const {stickPosition} = joystick;
    const {joystickSize, initialStickPos} = Joystick;
    // normalize the stick position to a value between -1 and 1
    joystick.value = {
      x: (stickPosition.x - initialStickPos.x) / joystickSize.outerRadius,
      y: (stickPosition.y - initialStickPos.y) / joystickSize.outerRadius,
    };
  }

  render() {
    const {joystick, handleTouch, handleRelease, id} = this.props;

    return (
      <View>
        <View
          style={[
            styles.touchArea,
            {
              left: joystick.globalPosition.x,
              top: joystick.globalPosition.y,
            },
          ]}
          onTouchStart={event => handleTouch(event, id)}
          onTouchMove={event => handleTouch(event, id)}
          onTouchEnd={event => handleRelease(event, id)}
          onTouchCancel={event => handleRelease(event, id)}>
          <View style={styles.textContainer}>
            <Text>X: {joystick.value.x.toFixed(2)}</Text>
            <Text>Y: {joystick.value.y.toFixed(2)}</Text>
          </View>
          <View style={[styles.line, styles.horizontal]} />
          <View style={[styles.line, styles.vertical]} />
          <View
            style={[
              styles.stick,
              {
                left: joystick.stickPosition.x,
                top: joystick.stickPosition.y,
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

const {outerRadius, innerRadius} = Joystick.joystickSize;

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    top: -50,
    left: -outerLineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: outerRadius * 2,
  },
  touchArea: {
    position: 'absolute',
    width: outerRadius * 2,
    height: outerRadius * 2,
    borderRadius: outerRadius,
    borderWidth: outerLineWidth,
    borderColor: outerColor,
  },
  stick: {
    width: innerRadius * 2,
    height: innerRadius * 2,
    borderRadius: innerRadius,
    backgroundColor: innerColor,
    opacity: 0.8,
  },
  line: {
    position: 'absolute',
    backgroundColor: outerColor,
  },
  horizontal: {
    top: outerRadius - innerLineWidth / 2 - outerLineWidth,
    width: outerRadius * 2 - outerLineWidth * 2,
    height: innerLineWidth,
  },
  vertical: {
    left: outerRadius - innerLineWidth / 2 - outerLineWidth,
    width: innerLineWidth,
    height: (outerRadius - outerLineWidth) * 2,
  },
});

export default Joystick;
