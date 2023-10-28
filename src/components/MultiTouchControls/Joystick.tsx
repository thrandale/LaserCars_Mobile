import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import MultiTouchComponent, {
  MultiTouchComponentProps,
} from './MultiTouchComponent';
import GlowingComponent from '../GlowingComponents/GlowingComponent';
import {DrivingMode} from '../../settings/DrivingModes';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {JoystickIcon} from './JoystickIcons';

export interface JoystickProps extends MultiTouchComponentProps {
  onChange: (
    angle: number,
    magnitude: number,
    lockX: boolean,
    lockY: boolean,
  ) => void;
  lockX: boolean;
  lockY: boolean;
}

interface JoystickState {
  lockX: boolean;
  lockY: boolean;
  hidden: boolean;
}

class Joystick extends MultiTouchComponent<JoystickProps, JoystickState> {
  static readonly outerLineWidth = 6;
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

  constructor(props: JoystickProps) {
    super(props);
    this.stickPosition = new Animated.ValueXY();
    this.stickPosition.setOffset(Joystick.initialStickPos);
    this.angle = 0;
    this.magnitude = 0;
    this.width = Joystick.size.outerRadius * 2;
    this.height = Joystick.size.outerRadius * 2;

    this.state = {
      lockX: props.lockX,
      lockY: props.lockY,
      hidden: props.lockX && props.lockY,
    };
  }

  private GetMaxOffset() {
    const window = this.context.window;
    const controlEditor = this.context.controlEditor;

    return (
      window.width / 2 -
      window.horizontalOffset -
      controlEditor.minimumJoystickGap / 2
    );
  }

  public componentDidUpdate(prevProps: Readonly<JoystickProps>): void {
    const lockXChanged = prevProps.lockX !== this.props.lockX;
    const lockYChanged = prevProps.lockY !== this.props.lockY;

    if (lockXChanged) {
      this.setState({lockX: this.props.lockX});
    }
    if (lockYChanged) {
      this.setState({lockY: this.props.lockY});
    }

    if (lockXChanged || lockYChanged) {
      this.setState({hidden: this.props.lockX && this.props.lockY});
    }

    if (prevProps.globalPosition !== this.props.globalPosition) {
      this.globalPosition.setValue(this.props.globalPosition);
    }
  }

  protected onTouchStart(event: PanGestureHandlerStateChangeEvent): void {
    if (this.props.editMode) {
      if (this.context.controlEditor.currentHandler.value === null) {
        this.context.controlEditor.currentHandler.setValue(
          event.nativeEvent.handlerTag,
        );
      }

      return;
    }

    // offset the stick to the touch position
    this.stickPosition.setOffset({
      x: this.state.lockX
        ? Joystick.initialStickPos.x
        : event.nativeEvent.x - Joystick.joystickOffset,
      y: this.state.lockY
        ? Joystick.initialStickPos.y
        : event.nativeEvent.y - Joystick.joystickOffset,
    });
    this.stickPosition.setValue({x: 0, y: 0});
  }

  protected onTouchMove = (event: PanGestureHandlerGestureEvent) => {
    const window = this.context.window;
    const controlEditor = this.context.controlEditor;
    if (this.props.editMode) {
      // If we are in edit mode, move the component
      if (controlEditor.currentHandler.value !== event.nativeEvent.handlerTag) {
        return;
      }

      let x = event.nativeEvent.absoluteX;
      let offset;

      if (x - event.nativeEvent.translationX > window.width / 2) {
        offset = window.width - x - window.horizontalOffset;
      } else {
        offset = x - window.horizontalOffset;
      }

      offset -= this.width / 2;

      // Constrain the component to the window
      if (offset < controlEditor.minimumJoystickDistance) {
        offset = controlEditor.minimumJoystickDistance;
      } else if (offset > this.GetMaxOffset()) {
        offset = this.GetMaxOffset();
      }

      controlEditor.joystickDistance.setValue(offset);
      return;
    }

    // constrain the stick to the outer circle
    const delta = {
      x: this.state.lockX ? 0 : event.nativeEvent.x - Joystick.size.outerRadius,
      y: this.state.lockY ? 0 : event.nativeEvent.y - Joystick.size.outerRadius,
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

    this.props.onChange(
      this.angle,
      this.magnitude,
      this.state.lockX,
      this.state.lockY,
    );
  };

  protected onTouchEnd(event: PanGestureHandlerStateChangeEvent): void {
    // @ts-ignore
    event.persist();
    if (this.props.editMode) {
      if (
        this.context.controlEditor.currentHandler.value ===
        event.nativeEvent.handlerTag
      ) {
        this.context.controlEditor.currentHandler.setValue(null);
      }

      return;
    }

    // reset stick position
    this.stickPosition.setValue({x: 0, y: 0});
    this.stickPosition.setOffset({
      x: Joystick.initialStickPos.x,
      y: Joystick.initialStickPos.y,
    });

    // reset values
    this.angle = 0;
    this.magnitude = 0;

    this.props.onChange(0, 0, this.state.lockX, this.state.lockY);
  }

  protected renderIcon(): React.ReactNode {
    const iconSize = 40;
    let icon;

    if (!this.state.lockX && !this.state.lockY) {
      if (
        this.context.controlEditor.drivingMode.value === DrivingMode.Mecanum
      ) {
        icon = JoystickIcon.Translate;
      } else {
        icon = JoystickIcon.All;
      }
    } else if (this.state.lockX && !this.state.lockY) {
      icon = JoystickIcon.UpDown;
    } else if (!this.state.lockX && this.state.lockY) {
      icon = JoystickIcon.Turn;
    } else {
      icon = JoystickIcon.Turn;
    }

    if (this.props.editMode) {
      return (
        <Icon
          name={icon}
          size={iconSize}
          color={this.context.theme.colors.onBackground}
        />
      );
    } else {
      return null;
    }
  }

  private styles = StyleSheet.create({
    touchArea: {
      position: 'absolute',
      width: Joystick.size.outerRadius * 2,
      aspectRatio: 1,
      borderRadius: Joystick.size.outerRadius,
      borderWidth: Joystick.outerLineWidth,
    },
    stick: {
      width: Joystick.size.innerRadius * 2,
      height: Joystick.size.innerRadius * 2,
      borderRadius: Joystick.size.innerRadius,
      opacity: 0.8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  protected renderChild(): React.ReactNode {
    if (this.state.hidden) {
      return <View />;
    }

    return (
      <Animated.View
        style={[
          this.styles.touchArea,
          {
            transform: [
              {translateX: this.globalPosition.x},
              {translateY: this.globalPosition.y},
            ],
            borderColor: this.context.theme.colors.primary,
          },
        ]}>
        <Animated.View
          style={{
            transform: [
              {translateX: this.stickPosition.x},
              {translateY: this.stickPosition.y},
            ],
          }}>
          <GlowingComponent
            width={Joystick.size.innerRadius * 2}
            height={Joystick.size.innerRadius * 2}
            borderRadius={Joystick.size.innerRadius}>
            <View
              style={[
                this.styles.stick,
                {
                  backgroundColor: this.context.theme.colors.primary,
                },
              ]}>
              {this.renderIcon()}
            </View>
          </GlowingComponent>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default Joystick;
