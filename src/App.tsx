/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, View} from 'react-native';

import BLE from './components/BLE';
import MultiTouch from './components/MultiTouch/MultiTouchController';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <View>
        {/* <BLE /> */}
        <MultiTouch />
      </View>
    </SafeAreaView>
  );
}

export default App;
