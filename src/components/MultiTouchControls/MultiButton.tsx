import React from 'react';
import {Animated, StyleSheet} from 'react-native';

import MultiTouchComponent, {
  MultiTouchComponentProps,
} from './MultiTouchComponent';

export interface MultiButtonProps extends MultiTouchComponentProps {
  width: number;
  height: number;
  onPress: () => void;
}

interface MultiButtonState {
  isPressed: boolean;
}

class MultiButton extends MultiTouchComponent<
  MultiButtonProps,
  MultiButtonState
> {
  public static readonly onPressColor = 'dimgray';
  public static readonly offPressColor = 'gray';

  constructor(props: MultiButtonProps) {
    super(props);
    this.width = props.width;
    this.height = props.height;

    this.state = {
      isPressed: false,
    };
  }

  protected onTouchStart(): void {
    this.setState({isPressed: true});
    this.props.onPress();
  }

  protected onTouchEnd(): void {
    this.setState({isPressed: false});
    return;
  }

  protected renderChild(): React.ReactNode {
    const styles = StyleSheet.create({
      button: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: MultiTouchComponent.outerColor,
        width: this.width,
        height: this.height,
        borderRadius: this.width / 2,
        backgroundColor: this.state.isPressed
          ? MultiButton.onPressColor
          : MultiButton.offPressColor,
      },
    });

    return (
      <Animated.View
        style={[
          styles.button,
          {
            transform: [
              {
                translateX: this.globalPosition.x,
              },
              {
                translateY: this.globalPosition.y,
              },
            ],
          },
        ]}>
        {this.renderLabel()}
      </Animated.View>
    );
  }
}

export default MultiButton;
