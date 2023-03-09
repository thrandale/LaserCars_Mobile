import React from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import MultiTouchComponent, {
  MultiTouchComponentData,
} from './MultiTouchComponent';

export interface JoystickData
  extends MultiTouchComponentData<JoystickData, JoystickData> {
  stickPosition?: {x: number; y: number};
  value?: {x: number; y: number};
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
      value: props.value || {x: 0, y: 0},
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

    if (radius > outerRadius) {
      // touch is outside the joystick
      const angle = Math.atan2(delta.y, delta.x);
      const newPosition = {
        x: Math.cos(angle) * outerRadius + Joystick.initialStickPos.x,
        y: Math.sin(angle) * outerRadius + Joystick.initialStickPos.y,
      };
      this.stickPosition = newPosition;
    } else {
      // touch is inside the joystick
      const newPosition = {
        x: delta.x + Joystick.initialStickPos.x,
        y: delta.y + Joystick.initialStickPos.y,
      };
      this.stickPosition = newPosition;
    }
  }

  protected handleRelease(event: GestureResponderEvent): void {
    super.handleRelease(event);
    this.setState({
      ...this.state,
      stickPosition: Joystick.initialStickPos,
      value: {x: 0, y: 0},
    });
  }

  // update the joystick value
  componentDidUpdate(prevProps: JoystickData, prevState: JoystickData) {
    const {initialStickPos, joystickSize} = Joystick;

    if (this.stickPosition !== prevState.stickPosition) {
      // normalize the stick position to a value between -1 and 1
      this.value = {
        x:
          (this.stickPosition.x - initialStickPos.x) / joystickSize.outerRadius,
        y:
          (this.stickPosition.y - initialStickPos.y) / joystickSize.outerRadius,
      };
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
    top: -50,
    left: -outerLineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
