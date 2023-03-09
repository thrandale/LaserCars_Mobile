import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import MultiTouchComponent, {
  MultiTouchComponentData,
} from './MultiTouchComponent';

export interface JoystickData
  extends MultiTouchComponentData<JoystickData, JoystickData> {
  stickPosition?: {x: number; y: number};
  value?: {x: number; y: number};
  angle?: number;
  magnitude?: number;
}

class Joystick extends MultiTouchComponent<JoystickData, JoystickData> {
  constructor(props: JoystickData) {
    super(props);
    this.state = {
      ...this.state,
      stickPosition: props.stickPosition || {
        x: Joystick.initialStickPos.x,
        y: Joystick.initialStickPos.y,
      },
      value: {x: 0, y: 0},
      angle: 0,
      magnitude: 0,
    };
  }

  // static class variables
  static readonly outerLineWidth = 6;
  static readonly innerLineWidth = Joystick.outerLineWidth / 2;
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

  get stickPosition() {
    return this.state.stickPosition!;
  }

  set stickPosition(stickPosition: {x: number; y: number}) {
    this.setState({
      ...this.state,
      stickPosition: stickPosition,
    });
  }

  get value() {
    return this.state.value!;
  }

  private set value(value: {x: number; y: number}) {
    this.setState({
      ...this.state,
      value: value,
    });
  }

  get angle() {
    return this.state.angle!;
  }

  private set angle(angle: number) {
    this.setState({
      ...this.state,
      angle: angle,
    });
  }

  get magnitude() {
    return this.state.magnitude!;
  }

  private set magnitude(magnitude: number) {
    this.setState({
      ...this.state,
      magnitude: magnitude,
    });
  }

  protected handleTouch(event: GestureResponderEvent) {
    super.handleTouch(event);
    const {nativeEvent} = event;
    const delta = {
      x:
        nativeEvent.pageX -
        this.windowDimensions.left -
        Joystick.joystickSize.outerRadius -
        this.globalPosition.x,
      y:
        nativeEvent.pageY -
        this.windowDimensions.top -
        Joystick.joystickSize.outerRadius -
        this.globalPosition.y,
    };
    const radius = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    let newPosition: {x: number; y: number};
    if (radius > outerRadius) {
      // touch is outside the joystick
      const angle = Math.atan2(delta.y, delta.x);
      newPosition = {
        x: Math.cos(angle) * outerRadius + Joystick.initialStickPos.x,
        y: Math.sin(angle) * outerRadius + Joystick.initialStickPos.y,
      };
    } else {
      // touch is inside the joystick
      newPosition = {
        x: delta.x + Joystick.initialStickPos.x,
        y: delta.y + Joystick.initialStickPos.y,
      };
    }
    this.stickPosition = newPosition;
  }

  protected handleRelease(event: GestureResponderEvent): void {
    super.handleRelease(event);
    this.setState({
      ...this.state,
      stickPosition: Joystick.initialStickPos,
      value: {x: 0, y: 0},
      angle: 0,
      magnitude: 0,
    });
  }

  // update the joystick value, angle, and magnitude
  componentDidUpdate(prevProps: JoystickData, prevState: JoystickData) {
    const {initialStickPos, joystickSize} = Joystick;

    if (this.stickPosition !== prevState.stickPosition) {
      this.setState({
        ...this.state,
        value: {
          x:
            (this.stickPosition.x - initialStickPos.x) /
            joystickSize.outerRadius,
          y:
            (this.stickPosition.y - initialStickPos.y) /
            joystickSize.outerRadius,
        },
        angle: Math.atan2(this.value.y, this.value.x) * (180 / Math.PI) + 180,
        magnitude: Math.sqrt(
          Math.pow(this.value.x, 2) + Math.pow(this.value.y, 2),
        ),
      });
    }
  }

  render() {
    return (
      <View
        style={[
          styles.touchArea,
          {
            left: this.globalPosition.x,
            top: this.globalPosition.y,
          },
        ]}
        onTouchStart={event => this.handleTouch(event)}
        onTouchMove={event => this.handleTouch(event)}
        onTouchEnd={event => this.handleRelease(event)}
        onTouchCancel={event => this.handleRelease(event)}>
        {/* <View style={styles.textContainer}>
          <Text>A: {this.state.angle!.toFixed(2)}</Text>
          <Text>M: {this.state.magnitude!.toFixed(2)}</Text>
          <Text>X: {this.state.value!.x.toFixed(2)}</Text>
          <Text>Y: {this.state.value!.y.toFixed(2)}</Text>
        </View> */}
        <View style={styles.background} />
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
    );
  }
}

const {outerLineWidth, innerLineWidth, outerColor, innerColor} = Joystick;
const {outerRadius, innerRadius} = Joystick.joystickSize;

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    gridTemplateColumns: '1fr 1fr',
    top: -100,
    left: -outerLineWidth,
    width: outerRadius * 2,
  },
  touchArea: {
    position: 'absolute',
    width: outerRadius * 2,
    aspectRatio: 1,
    borderRadius: outerRadius,
    borderWidth: outerLineWidth,
    borderColor: outerColor,
  },
  background: {
    position: 'absolute',
    width: outerRadius * 2 - outerLineWidth * 2,
    aspectRatio: 1,
    borderRadius: outerRadius,
    backgroundColor: outerColor,
    opacity: 0.3,
  },
  stick: {
    width: innerRadius * 2,
    aspectRatio: 1,
    borderRadius: innerRadius,
    backgroundColor: innerColor,
    opacity: 0.8,
  },
  line: {
    position: 'absolute',
    backgroundColor: outerColor,
    opacity: 0.8,
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
