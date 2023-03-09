import React from 'react';
import {GestureResponderEvent, NativeTouchEvent} from 'react-native';

export interface MultiTouchComponentData {
  touch: NativeTouchEvent | undefined;
  globalPosition: {x: number; y: number};
  handleTouch: (
    event: GestureResponderEvent,
    component: MultiTouchComponent,
  ) => void;
  handleRelease: (
    event: GestureResponderEvent,
    component: MultiTouchComponent,
  ) => void;
  key: number;
}

export interface MultiTouchComponentProps {
  componentData: MultiTouchComponentData;
  [key: string]: any;
}

export interface MultiTouchComponentState {
  componentData: MultiTouchComponentData;
  [key: string]: any;
}

class MultiTouchComponent extends React.Component<
  MultiTouchComponentProps,
  MultiTouchComponentState
> {
  constructor(props: MultiTouchComponentProps) {
    super(props);
    this.state = {
      componentData: this.props.componentData,
    };
  }

  get touch() {
    return this.state.componentData.touch;
  }

  set touch(touch: NativeTouchEvent | undefined) {
    this.setState({
      componentData: {
        ...this.state.componentData,
        touch: touch,
      },
    });
  }

  get globalPosition() {
    return this.state.componentData.globalPosition;
  }

  get handleTouch() {
    return this.state.componentData.handleTouch;
  }

  get handleRelease() {
    return this.state.componentData.handleRelease;
  }

  get key() {
    return this.state.componentData.key;
  }

  render() {
    return <></>;
  }
}

export default MultiTouchComponent;
