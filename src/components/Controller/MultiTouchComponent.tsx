import React from 'react';
import {GestureResponderEvent, NativeTouchEvent} from 'react-native';

export interface MultiTouchComponentData<
  P extends MultiTouchComponentData<P, S>,
  S extends MultiTouchComponentData<P, S>,
> {
  touchId?: string | undefined;
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

  static readonly outerColor = 'darkgray';
  static readonly innerColor = 'gray';

  protected get touchId() {
    return this.state.touchId;
  }

  protected set touchId(touch: string | undefined) {
    this.setState(state => ({
      ...state,
      touchId: touch,
    }));
  }

  protected get globalPosition() {
    return this.state.globalPosition;
  }

  protected get windowDimensions() {
    return this.state.windowDimensions;
  }

  protected set shouldHandleTouch(shouldHandleTouch: boolean) {
    this.setState(state => ({
      ...state,
      shouldHandleTouch: shouldHandleTouch,
    }));
  }

  protected handleTouch(event: GestureResponderEvent) {
    if (!this.touchId) {
      this.touchId = event.nativeEvent.identifier;
      this.shouldHandleTouch = true;
    } else {
      if (this.touchId !== event.nativeEvent.identifier) {
        this.shouldHandleTouch = false;
      }
    }
  }

  protected handleRelease(event: GestureResponderEvent) {
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
