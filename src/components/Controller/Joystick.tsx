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
  lockX?: boolean;
  lockY?: boolean;
  onChange: (angle: number, magnitude: number) => void;
}

class Joystick extends MultiTouchComponent<JoystickData, JoystickData> {
  constructor(props: JoystickData) {
    super(props);
    this.state = {
      ...this.state,
      stickPosition: {
        x: Joystick.initialStickPos.x,
        y: Joystick.initialStickPos.y,
      },
      value: {x: 0, y: 0},
      angle: 0,
      magnitude: 0,
      lockX: props.lockX || false,
      lockY: props.lockY || false,
      onChange: props.onChange,
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
    this.setState(state => ({
      ...state,
      stickPosition: stickPosition,
    }));
  }

  get value() {
    return this.state.value!;
  }

  private set value(value: {x: number; y: number}) {
    this.setState(state => ({
      ...state,
      value: value,
    }));
  }

  get angle() {
    return this.state.angle!;
  }

  private set angle(angle: number) {
    this.setState(state => ({
      ...state,
      angle: angle,
    }));
  }

  get magnitude() {
    return this.state.magnitude!;
  }

  private set magnitude(magnitude: number) {
    this.setState(state => ({
      ...state,
      magnitude: magnitude,
    }));
  }

  get lockX() {
    return this.state.lockX!;
  }

  get lockY() {
    return this.state.lockY!;
  }

  private get onChange() {
    return this.state.onChange!;
  }

  protected handleTouch(event: GestureResponderEvent) {
    const {nativeEvent} = event;
    const delta = {
      x: this.lockX
        ? 0
        : nativeEvent.pageX -
          this.windowDimensions.left -
          Joystick.joystickSize.outerRadius -
          this.globalPosition.x,
      y: this.lockY
        ? 0
        : nativeEvent.pageY -
          this.windowDimensions.top -
          Joystick.joystickSize.outerRadius -
          this.globalPosition.y,
    };
    const radius = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    let angle = Math.atan2(delta.y, delta.x);
    let newPosition: {x: number; y: number};
    if (radius > outerRadius) {
      // touch is outside the joystick
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

    angle += Math.PI / 2;
    if (angle < 0) {
      angle += Math.PI * 2;
    }
    this.value = {
      x:
        (this.stickPosition.x - Joystick.initialStickPos.x) /
        Joystick.joystickSize.outerRadius,
      y:
        (this.stickPosition.y - Joystick.initialStickPos.y) /
        Joystick.joystickSize.outerRadius,
    };
    this.angle = angle;
    this.magnitude = Math.sqrt(
      Math.pow(this.value.x, 2) + Math.pow(this.value.y, 2),
    );
    this.stickPosition = newPosition;

    this.onChange(this.angle, this.magnitude);
  }

  protected handleRelease(event: GestureResponderEvent): void {
    super.handleRelease(event);
    this.stickPosition = Joystick.initialStickPos;
    this.value = {x: 0, y: 0};
    this.angle = 0;
    this.magnitude = 0;
    this.onChange(0, 0);
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
        <View style={styles.textContainer}>
          <Text>A: {this.angle!.toFixed(2)}</Text>
          <Text>M: {this.magnitude!.toFixed(2)}</Text>
          <Text>X: {this.value!.x.toFixed(2)}</Text>
          <Text>Y: {this.value!.y.toFixed(2)}</Text>
        </View>
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
