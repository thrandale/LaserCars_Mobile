import React from 'react';
import {View} from 'react-native';
import MultiTouchComponent, {
  MultiTouchComponentProps,
} from './MultiTouchComponent';
import {PanGestureHandlerStateChangeEvent} from 'react-native-gesture-handler';
import Joystick from './Joystick';
import ArcButton from '../ArcButton';
import {cartesianToPolar} from '../../Utils';

export interface MultiTouchArcButtonsProps extends MultiTouchComponentProps {
  globalPosition: {x: number; y: number};
  startAngle: number;
  endAngle: number;
  numButtons: number;
  onPress: (() => void)[];
}

export interface MultiTouchArcButtonsState {
  buttonAngles: {start: number; end: number}[];
  pressed: boolean[];
}

class MultiTouchArcButtons extends MultiTouchComponent<
  MultiTouchArcButtonsProps,
  MultiTouchArcButtonsState
> {
  private static readonly innerRadius = Joystick.size.outerRadius + 10;
  private static readonly thickness = 55;
  private static readonly padding = 5;

  constructor(props: MultiTouchArcButtonsProps) {
    super(props);

    // Divide the arc into equal sections
    const degreesPerButton =
      Math.abs(
        props.endAngle -
          props.startAngle -
          MultiTouchArcButtons.padding * (props.numButtons - 1),
      ) / props.numButtons;

    // Calculate the start and end angles for each button
    const angles = [];
    for (let i = 0; i < props.numButtons; i++) {
      const startAngle =
        props.startAngle +
        i * (degreesPerButton + MultiTouchArcButtons.padding);
      const endAngle = startAngle + degreesPerButton;
      angles.push({start: startAngle, end: endAngle});
    }

    this.state = {
      buttonAngles: angles,
      pressed: new Array(props.numButtons).fill(false),
    };
  }

  public componentDidUpdate(
    prevProps: Readonly<MultiTouchArcButtonsProps>,
  ): void {
    if (prevProps.numButtons === this.props.numButtons) {
      return;
    }

    // Divide the arc into equal sections
    const degreesPerButton =
      Math.abs(
        this.props.endAngle -
          this.props.startAngle -
          MultiTouchArcButtons.padding * (this.props.numButtons - 1),
      ) / this.props.numButtons;

    //   // Calculate the start and end angles for each button
    const angles = [];
    for (let i = 0; i < this.props.numButtons; i++) {
      const startAngle =
        this.props.startAngle +
        i * (degreesPerButton + MultiTouchArcButtons.padding);
      const endAngle = startAngle + degreesPerButton;
      angles.push({start: startAngle, end: endAngle});
    }

    this.setState({buttonAngles: angles});
  }

  protected onTouchStart(event: PanGestureHandlerStateChangeEvent): void {
    const buttonIndex = this.getButtonIndex(
      event.nativeEvent.x,
      event.nativeEvent.y,
    );

    if (buttonIndex === -1) {
      return;
    }

    this.setState(state => {
      const pressed = state.pressed;
      pressed[buttonIndex] = true;
      return {pressed: pressed};
    }, this.props.onPress[buttonIndex]);

    this.props.onPress[buttonIndex]();
  }

  protected onTouchEnd(_event: PanGestureHandlerStateChangeEvent): void {
    this.setState({pressed: new Array(this.props.numButtons).fill(false)});
  }

  private getButtonIndex(x: number, y: number): number {
    let {angle, radius} = cartesianToPolar(
      this.props.globalPosition.x,
      this.props.globalPosition.y,
      x,
      y,
    );

    // Convert to degrees
    angle = -angle * (180 / Math.PI);
    angle = angle < 0 ? angle + 360 : angle;

    // If the button arc angle is negative, we will need to check against the inverse angle
    const inverseAngle = angle - 360;

    for (let i = 0; i < this.state.buttonAngles.length; i++) {
      const buttonAngle = this.state.buttonAngles[i];
      if (
        ((buttonAngle.start < 0 &&
          inverseAngle >= buttonAngle.start &&
          inverseAngle <= buttonAngle.end) ||
          (angle >= buttonAngle.start && angle <= buttonAngle.end)) &&
        radius >= MultiTouchArcButtons.innerRadius &&
        radius <=
          MultiTouchArcButtons.innerRadius + MultiTouchArcButtons.thickness
      ) {
        return i;
      }
    }

    return -1;
  }

  protected renderIcon(): React.ReactNode {
    throw new Error('Method not implemented.');
  }

  protected renderChild(): React.ReactNode {
    return (
      <View>
        {this.state.buttonAngles.map((angle, index) => {
          return (
            <ArcButton
              x={this.props.globalPosition.x}
              y={this.props.globalPosition.y}
              innerRadius={MultiTouchArcButtons.innerRadius}
              thickness={MultiTouchArcButtons.thickness}
              startAngle={angle.start}
              endAngle={angle.end}
              pressed={this.state.pressed[index]}
              key={index}
              color={this.GetColor(this.state.pressed[index])}
            />
          );
        })}
      </View>
    );
  }
}

export default MultiTouchArcButtons;
