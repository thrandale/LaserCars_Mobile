import React from 'react';
import {GestureResponderEvent, NativeTouchEvent} from 'react-native';

export interface MultiTouchComponentData<
  P extends MultiTouchComponentData<P, S>,
  S extends MultiTouchComponentData<P, S>,
> {
  touchId: string | undefined;
  globalPosition: {x: number; y: number};
  shouldHandleTouch?: boolean;
  windowDimensions: {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

abstract class MultiTouchComponent<
  P extends MultiTouchComponentData<P, S>,
  S extends MultiTouchComponentData<P, S>,
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    this.state = {
      touchId: props.touchId,
      globalPosition: props.globalPosition,
      shouldHandleTouch: props.shouldHandleTouch,
      windowDimensions: props.windowDimensions,
    } as S;
  }

  get touchId() {
    return this.state.touchId;
  }

  set touchId(touch: string | undefined) {
    this.setState({
      ...this.state,
      touchId: touch,
    });
  }

  get globalPosition() {
    return this.state.globalPosition;
  }

  get windowDimensions() {
    return this.state.windowDimensions;
  }

  private set shouldHandleTouch(shouldHandleTouch: boolean) {
    this.setState({
      ...this.state,
      shouldHandleTouch: shouldHandleTouch,
    });
  }

  public handleTouch(event: GestureResponderEvent) {
    if (!this.touchId) {
      this.touchId = event.nativeEvent.identifier;
      this.shouldHandleTouch = true;
    } else {
      if (this.touchId !== event.nativeEvent.identifier) {
        this.shouldHandleTouch = false;
      }
    }
  }

  public handleRelease(event: GestureResponderEvent) {
    const {nativeEvent} = event;
    if (
      this.touchId &&
      !nativeEvent.changedTouches.find(
        (touch: NativeTouchEvent) => touch.identifier === this.touchId,
      )
    ) {
      this.touchId = undefined;
    }
  }
}

export default MultiTouchComponent;
