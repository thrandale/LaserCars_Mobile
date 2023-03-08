import React from 'react';
import {
  GestureResponderEvent,
  NativeTouchEvent,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';

export interface JoystickData {
  touch: NativeTouchEvent | undefined;
  globalPosition: {x: number; y: number};
  stickPosition: {x: number; y: number};
  value: {x: number; y: number};
}

export interface JoystickProps {
  joystickData: JoystickData;
  handleTouch: (event: GestureResponderEvent, joystick: Joystick) => void;
  handleRelease: (event: GestureResponderEvent, joystick: Joystick) => void;
  key: number;
}

class Joystick extends React.Component<JoystickProps> {
  // static class variables
  static readonly outerLineWidth = 6;
  static readonly innerLineWidth = Joystick.outerLineWidth / 2;
  static readonly outerColor = 'darkgray';
  static readonly innerColor = 'gray';
  static readonly joystickSize = {
    outerRadius: 75,
    innerRadius: 75 / 2,
  };
  static readonly initialStickPos = {
    x:
      Joystick.joystickSize.outerRadius -
      Joystick.joystickSize.innerRadius -
      Joystick.outerLineWidth,
    y:
      Joystick.joystickSize.outerRadius -
      Joystick.joystickSize.innerRadius -
      Joystick.outerLineWidth,
  };

  // State
  state = {
    joystickData: this.props.joystickData,
  };

  // Getters and Setters
  get joystickData() {
    return this.state.joystickData;
  }

  get touch() {
    return this.state.joystickData.touch;
  }

  set touch(touch: NativeTouchEvent | undefined) {
    this.setState({
      joystickData: {
        ...this.state.joystickData,
        touch: touch,
      },
    });
  }

  get globalPosition() {
    return this.state.joystickData.globalPosition;
  }

  get stickPosition() {
    return this.state.joystickData.stickPosition;
  }

  set stickPosition(stickPosition: {x: number; y: number}) {
    this.setState({
      joystickData: {
        ...this.state.joystickData,
        stickPosition: stickPosition,
      },
    });
  }

  get value() {
    return this.state.joystickData.value;
  }

  set value(value: {x: number; y: number}) {
    this.setState({
      joystickData: {
        ...this.state.joystickData,
        value: value,
      },
    });
  }

  get key() {
    return this.props.key;
  }

  reset() {
    // reset everything except the global position
    this.setState({
      joystickData: {
        ...this.state.joystickData,
        touch: undefined,
        stickPosition: Joystick.initialStickPos,
        value: {x: 0, y: 0},
      },
    });
  }

  // update the joystick value
  componentDidUpdate(prevProps: JoystickProps, prevState: JoystickProps) {
    const {joystickData} = this.state;
    const {stickPosition} = joystickData;
    const {initialStickPos, joystickSize} = Joystick;

    if (stickPosition !== prevState.joystickData.stickPosition) {
      // normalize the stick position to a value between -1 and 1
      this.value = {
        x: (stickPosition.x - initialStickPos.x) / joystickSize.outerRadius,
        y: (stickPosition.y - initialStickPos.y) / joystickSize.outerRadius,
      };
    }
  }

  render() {
    const {handleTouch, handleRelease} = this.props;
    const {globalPosition, stickPosition, value} = this.state.joystickData;

    return (
      <View>
        <View
          style={[
            styles.touchArea,
            {
              left: globalPosition.x,
              top: globalPosition.y,
            },
          ]}
          onTouchStart={event => handleTouch(event, this)}
          onTouchMove={event => handleTouch(event, this)}
          onTouchEnd={event => handleRelease(event, this)}
          onTouchCancel={event => handleRelease(event, this)}>
          <View style={styles.textContainer}>
            <Text>X: {value.x.toFixed(2)}</Text>
            <Text>Y: {value.y.toFixed(2)}</Text>
          </View>
          <View style={[styles.line, styles.horizontal]} />
          <View style={[styles.line, styles.vertical]} />
          <View
            style={[
              styles.stick,
              {
                left: stickPosition.x,
                top: stickPosition.y,
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

const {outerLineWidth, innerLineWidth, outerColor, innerColor} = Joystick;
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
