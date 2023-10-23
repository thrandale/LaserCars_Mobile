/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useTheme} from 'react-native-paper';
import {View} from 'react-native';
import {NavigationHelpers} from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';
import MultiTouchController from '../components/MultiTouchControls/MultiTouchController';

function Drive(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <HeaderButtons navigation={props.navigation} />
      <MultiTouchController editMode={false} />
    </View>
  );
}

export default Drive;
