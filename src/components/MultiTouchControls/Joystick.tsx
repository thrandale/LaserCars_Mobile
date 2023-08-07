import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import MultiTouchComponent, {
  MultiTouchComponentProps,
} from './MultiTouchComponent';

export interface JoystickProps extends MultiTouchComponentProps {
  onChange: (angle: number, magnitude: number) => void;
  lockX?: boolean;
  lockY?: boolean;
}

class Joystick extends MultiTouchComponent<JoystickProps> {
  static readonly outerLineWidth = 6;
  static readonly innerLineWidth = Joystick.outerLineWidth / 2;
  static readonly size = {
    outerRadius: 75,
    innerRadius: 75 / 2,
  };
  static readonly initialStickPos = {
    x:
      Joystick.size.outerRadius -
      Joystick.size.innerRadius -
      Joystick.outerLineWidth,
    y:
      Joystick.size.outerRadius -
      Joystick.size.innerRadius -
      Joystick.outerLineWidth,
  };
  static readonly joystickOffset =
    Joystick.size.innerRadius + Joystick.outerLineWidth / 2;
  static readonly maxDragOffset =
    Joystick.size.outerRadius - Joystick.size.innerRadius / 2;

  private stickPosition: Animated.ValueXY;
  private angle: number;
  private magnitude: number;
  private lockX: boolean;
  private lockY: boolean;

  constructor(props: JoystickProps) {
    super(props);
    this.stickPosition = new Animated.ValueXY();
    this.stickPosition.setOffset(Joystick.initialStickPos);
    this.angle = 0;
    this.magnitude = 0;
    this.lockX = props.lockX ?? false;
    this.lockY = props.lockY ?? false;
    this.width = Joystick.size.outerRadius * 2;
    this.height = Joystick.size.outerRadius * 2;
  }

  protected onTouchStart(event: PanGestureHandlerStateChangeEvent): void {
    // offset the stick to the touch position
    this.stickPosition.setOffset({
      x: this.lockX
        ? Joystick.initialStickPos.x
        : event.nativeEvent.x - Joystick.joystickOffset,
      y: this.lockY
        ? Joystick.initialStickPos.y
        : event.nativeEvent.y - Joystick.joystickOffset,
    });
    this.stickPosition.setValue({x: 0, y: 0});
  }

  protected onTouchMove = (event: PanGestureHandlerGestureEvent) => {
    // constrain the stick to the outer circle
    const delta = {
      x: this.lockX ? 0 : event.nativeEvent.x - Joystick.size.outerRadius,
      y: this.lockY ? 0 : event.nativeEvent.y - Joystick.size.outerRadius,
    };
    const radius = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    let angle = Math.atan2(delta.y, delta.x);
    let newPosition: {x: number; y: number};
    if (radius > Joystick.maxDragOffset) {
      // touch is outside the joystick
      newPosition = {
        x: Math.cos(angle) * Joystick.maxDragOffset,
        y: Math.sin(angle) * Joystick.maxDragOffset,
      };
    } else {
      // touch is inside the joystick
      newPosition = {
        x: delta.x,
        y: delta.y,
      };
    }

    // angle is between 0 and 2pi with 0 at the top
    angle += Math.PI / 2;
    if (angle < 0) {
      angle += Math.PI * 2;
    }
    this.angle = angle;

    // magnitude is between 0 and 1
    this.magnitude =
      Math.sqrt(Math.pow(newPosition.x, 2) + Math.pow(newPosition.y, 2)) /
      Joystick.maxDragOffset;

    // update the stick position
    this.stickPosition.setValue(newPosition);
    this.stickPosition.setOffset({
      x: Joystick.initialStickPos.x,
      y: Joystick.initialStickPos.y,
    });

    this.props.onChange(this.angle, this.magnitude);
  };

  protected onTouchEnd(): void {
    // reset stick position
    this.stickPosition.setValue({x: 0, y: 0});
    this.stickPosition.setOffset({
      x: Joystick.initialStickPos.x,
      y: Joystick.initialStickPos.y,
    });

    // reset values
    this.angle = 0;
    this.magnitude = 0;

    this.props.onChange(0, 0);
  }

  protected renderChild(): React.ReactNode {
    return (
      <Animated.View
        style={[
          styles.touchArea,
          {
            transform: [
              {translateX: this.globalPosition.x},
              {translateY: this.globalPosition.y},
            ],
          },
        ]}>
        <View style={styles.background} />
        <View style={[styles.line, styles.horizontal]} />
        <View style={[styles.line, styles.vertical]} />
        <Animated.View
          style={[
            styles.stick,
            {
              transform: [
                {translateX: this.stickPosition.x},
                {translateY: this.stickPosition.y},
              ],
            },
          ]}>
          {this.renderLabel()}
        </Animated.View>
      </Animated.View>
    );
  }
}

// styles
const {outerLineWidth, innerLineWidth, outerColor, innerColor} = Joystick;
const {outerRadius, innerRadius} = Joystick.size;

const styles = StyleSheet.create({
  box: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    backgroundColor: 'plum',
    margin: 10,
    zIndex: 200,
  },
  textContainer: {
    position: 'absolute',
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
    alignItems: 'center',
    justifyContent: 'center',
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
