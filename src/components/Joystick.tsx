import React from 'react';
import {NativeTouchEvent, StyleSheet, View, ViewStyle} from 'react-native';

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
    const {outerRadius} = Joystick.joystickSize;

    const horizontalLineStyle: ViewStyle = {
      position: 'absolute',
      top: outerRadius - innerLineWidth / 2 - outerLineWidth,
      width: outerRadius * 2 - outerLineWidth * 2,
      height: innerLineWidth,
      backgroundColor: outerColor,
    };
    const verticalLineStyle: ViewStyle = {
      position: 'absolute',
      left: outerRadius - innerLineWidth / 2 - outerLineWidth,
      width: innerLineWidth,
      height: (outerRadius - outerLineWidth) * 2,
      backgroundColor: outerColor,
    };

    return (
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
        <View style={horizontalLineStyle} />
        <View style={verticalLineStyle} />
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
    );
  }
}

const styles = StyleSheet.create({
  touchArea: {
    position: 'absolute',
    boxSizing: 'border-box',
    width: Joystick.joystickSize.outerRadius * 2,
    height: Joystick.joystickSize.outerRadius * 2,
    borderRadius: Joystick.joystickSize.outerRadius,
    borderWidth: outerLineWidth,
    borderColor: outerColor,
  },
  stick: {
    position: 'absolute',
    width: Joystick.joystickSize.innerRadius * 2,
    height: Joystick.joystickSize.innerRadius * 2,
    borderRadius: Joystick.joystickSize.innerRadius,
    backgroundColor: innerColor,
    opacity: 0.8,
  },
});

export default Joystick;
