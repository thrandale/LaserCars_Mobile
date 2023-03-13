/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, View} from 'react-native';

import BTController from './components/BTController';
import MultiTouch from './components/Controller/Controller';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <View>
        <MultiTouch />
      </View>
    </SafeAreaView>
  );
}

export default App;
