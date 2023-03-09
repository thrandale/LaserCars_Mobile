import React from 'react';
import {
  GestureResponderEvent,
  NativeTouchEvent,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';

export interface ButtonData {
  touch: NativeTouchEvent | undefined;
  globalPosition: {x: number; y: number};
  onPress: (event: GestureResponderEvent, button: Button) => void;
  key: number;
}

export interface ButtonProps {
  buttonData: ButtonData;
  handleTouch: (event: GestureResponderEvent, button: Button) => void;
  handleRelease: (event: GestureResponderEvent, button: Button) => void;
  key: number;
}

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Button</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});

export default Button;
