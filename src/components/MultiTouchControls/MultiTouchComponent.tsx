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
  label: string;
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
  protected label: string;
  protected width: number;
  protected height: number;
  private id: string;

  constructor(props: P) {
    super(props);

    this.id = props.label.replace(/\s/g, '');
    this.globalPosition = new Animated.ValueXY(props.globalPosition);
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
    this.label = props.label;
  }

  componentDidMount(): void {
    // check if the component exists in the settings
    if (!this.context.layout.components.values.get(this.id)) {
      this.context.layout.components.setComponent(
        this.id,
        new Animated.ValueXY(this.globalPosition),
      );
    }
    this.globalPosition = this.context.layout.components.values.get(this.id)!;
    this.forceUpdate();
  }

  protected abstract onTouchStart(
    event: PanGestureHandlerStateChangeEvent,
  ): void;
  protected onTouchMove(_event: PanGestureHandlerGestureEvent): void {}
  protected onTouchEnd(_event: PanGestureHandlerStateChangeEvent): void {}
  protected abstract renderChild(): React.ReactNode;

  private privateMoveEvent = (event: PanGestureHandlerGestureEvent) => {
    const {window} = this.context;
    if (this.props.editMode) {
      // If we are in edit mode, move the component
      const gridSize = this.context.layout.gridSize;

      let x =
        Math.round(
          (event.nativeEvent.absoluteX - window.leftSA - this.width / 2) /
            gridSize,
        ) * gridSize;
      let y =
        Math.round((event.nativeEvent.absoluteY - this.height / 2) / gridSize) *
        gridSize;

      // constrain within the screen
      if (x < 0) {
        x = 0;
      } else if (x > window.width - this.width) {
        x = window.width - this.width;
      }
      if (y < 0) {
        y = 0;
      } else if (y > window.height - this.height) {
        y = window.height - this.height;
      }

      this.globalPosition.setValue({x, y});
    } else {
      this.onTouchMove(event);
    }
  };

  private onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      if (!this.props.editMode) {
        this.onTouchStart(event);
      }
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      if (this.props.editMode) {
        // If we are in edit mode, save the position
        this.context.layout.components.setComponent(
          this.id,
          this.globalPosition,
        );
      } else {
        this.onTouchEnd(event);

        // NOTE: This is a hack because react wasn't rerendering
        setTimeout(() => {
          this.onTouchEnd(event);
        }, 0);
      }
    }
  };

  protected renderLabel() {
    const styles = StyleSheet.create({
      label: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: this.context.theme.colors.onBackground,
      },
    });

    if (this.props.editMode) {
      return <Text style={styles.label}>{this.label}</Text>;
    } else {
      return null;
    }
  }

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
