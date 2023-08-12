import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {NavigationHelpers} from '@react-navigation/native';
import HeaderButtons from '../components/HeaderButtons';

function Connect(props: {navigation: NavigationHelpers<any, any>}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <HeaderButtons hideBluetooth navigation={props.navigation} />
      <Text>Connect</Text>
    </View>
  );
}

export default Connect;
