import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import {SettingsContext} from '../../contexts/SettingsContext';

export interface MultiTouchComponentProps {
  globalPosition: {x: number; y: number};
  editMode?: boolean;
  width?: number;
  height?: number;
}

abstract class MultiTouchComponent<
  P extends MultiTouchComponentProps,
  S = {},
> extends React.Component<P, S> {
  static contextType = SettingsContext;
  declare context: React.ContextType<typeof SettingsContext>;

  static readonly outerColor = 'darkgray';
  static readonly innerColor = 'gray';
  protected globalPosition: Animated.ValueXY;
  protected width: number;
  protected height: number;

  constructor(props: P) {
    super(props);

    this.globalPosition = new Animated.ValueXY(props.globalPosition);
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
  }

  componentDidMount(): void {
    this.forceUpdate();
  }

  protected abstract onTouchStart(
    event: PanGestureHandlerStateChangeEvent,
  ): void;
  protected onTouchMove(_event: PanGestureHandlerGestureEvent): void {}
  protected onTouchEnd(_event: PanGestureHandlerStateChangeEvent): void {}
  protected abstract renderChild(): React.ReactNode;

  private privateMoveEvent = (event: PanGestureHandlerGestureEvent) => {
    this.onTouchMove(event);
  };

  private onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      this.onTouchStart(event);
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      this.onTouchEnd(event);

      // NOTE: This is a hack because react wasn't rerendering
      setTimeout(() => {
        this.onTouchEnd(event);
      }, 0);
    }
  };

  protected abstract renderIcon(): React.ReactNode;

  public render() {
    return (
      <PanGestureHandler
        onHandlerStateChange={this.onHandlerStateChange}
        onGestureEvent={this.privateMoveEvent}
        minDist={0}>
        {this.renderChild()}
      </PanGestureHandler>
    );
  }
}

export default MultiTouchComponent;
