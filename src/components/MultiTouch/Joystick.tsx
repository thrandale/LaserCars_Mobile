import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import MultiTouchComponent, {
  MultiTouchComponentProps,
} from './MultiTouchComponent';

export interface JoystickData {
  stickPosition: {x: number; y: number};
  value: {x: number; y: number};
}

export interface JoystickProps extends MultiTouchComponentProps {
  joystickData: JoystickData;
}

class Joystick extends MultiTouchComponent {
  constructor(props: JoystickProps) {
    super(props);

    this.state = {
      ...this.state,
      joystickData: props.joystickData,
    };
  }

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

  get componentData() {
    return this.state.componentData;
  }

  get joystickData() {
    return this.state.joystickData;
  }

  get stickPosition() {
    return this.state.joystickData.stickPosition;
  }

  set stickPosition(stickPosition: {x: number; y: number}) {
    this.setState({
      ...this.state,
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
      ...this.state,
      joystickData: {
        ...this.state.joystickData,
        value: value,
      },
    });
  }

  reset() {
    this.setState({
      componentData: {
        ...this.state.componentData,
        touch: undefined,
      },
      joystickData: {
        ...this.state.joystickData,
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
    return (
      <View>
        <View
          style={[
            styles.touchArea,
            {
              left: this.globalPosition.x,
              top: this.globalPosition.y,
            },
          ]}
          onTouchStart={event => this.handleTouch(event, this)}
          onTouchMove={event => this.handleTouch(event, this)}
          onTouchEnd={event => this.handleRelease(event, this)}
          onTouchCancel={event => this.handleRelease(event, this)}>
          <View style={styles.textContainer}>
            <Text>X: {this.value.x.toFixed(2)}</Text>
            <Text>Y: {this.value.y.toFixed(2)}</Text>
          </View>
          <View style={[styles.line, styles.horizontal]} />
          <View style={[styles.line, styles.vertical]} />
          <View
            style={[
              styles.stick,
              {
                left: this.stickPosition.x,
                top: this.stickPosition.y,
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
