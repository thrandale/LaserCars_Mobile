import React from 'react';
import {GestureResponderEvent, StyleSheet, View, ViewStyle} from 'react-native';
import MultiTouchComponent, {
  MultiTouchComponentData,
} from './MultiTouchComponent';

export interface MultiButtonData
  extends MultiTouchComponentData<MultiButtonData, MultiButtonData> {
  width: number;
  height: number;
  onPress: (event: GestureResponderEvent) => void;
  onPressStyle?: ViewStyle;
}

class Button extends MultiTouchComponent<MultiButtonData, MultiButtonData> {
  constructor(props: MultiButtonData) {
    super(props);
    this.state = {
      ...this.state,
      width: props.width,
      height: props.height,
      onPress: props.onPress,
      onPressStyle: props.onPressStyle,
    };
  }

  private get width() {
    return this.state.width;
  }

  private get height() {
    return this.state.height;
  }

  private get onPressStyle() {
    return this.state.onPressStyle;
  }

  private handlePress = (event: GestureResponderEvent) => {
    super.handleTouch(event);
    this.state.onPress(event);

    this.setState({
      ...this.state,
      onPressStyle: {opacity: 0.5},
    });
  };

  protected handleRelease = (event: GestureResponderEvent) => {
    super.handleRelease(event);
    this.setState({
      ...this.state,
      onPressStyle: {opacity: 1},
    });
  };

  render() {
    const containerStyle = {
      width: this.width,
      height: this.height,
      borderRadius: this.width / 2,
      left: this.globalPosition.x,
      top: this.globalPosition.y,
    };

    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {left: this.globalPosition.x, top: this.globalPosition.y},
        ]}
        onTouchStart={this.handlePress}
        onTouchEnd={this.handleRelease}>
        <View style={[styles.background, this.onPressStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: Button.outerColor,
  },
  background: {
    backgroundColor: Button.innerColor,
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
});

export default Button;
