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
    let {angle, radius} = cartesianToPolar(
      this.props.globalPosition.x,
      this.props.globalPosition.y,
      event.nativeEvent.x,
      event.nativeEvent.y,
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
        this.props.onPress[i]();
        return;
      }
    }
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
              key={index}
              color={this.GetColor()}
            />
          );
        })}
      </View>
    );
  }
}

export default MultiTouchArcButtons;
