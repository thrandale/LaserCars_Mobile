import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {rgbToRgba} from '../Utils';
import {ShadowedView} from 'react-native-fast-shadow';

function Header(props: {children: React.ReactNode}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    title: {
      textAlign: 'center',
      color: theme.colors.primary,
      padding: 5,
      fontSize: 50,
      paddingHorizontal: 20,
      textShadowColor: theme.colors.primary,
      textShadowRadius: 20,
      textShadowOffset: {width: 0, height: 0},
    },
    view: {},
    shadow: {
      marginTop: 10,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 0},
      borderRadius: 25,
      shadowColor: rgbToRgba(theme.colors.background, 0.9),
    },
  });

  if (Platform.OS === 'ios') {
    styles.view = {
      backgroundColor: rgbToRgba(theme.colors.background, 0.9),
      borderRadius: 25,
    };
    styles.shadow = {
      marginTop: 10,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 0},
      borderRadius: 25,
      shadowColor: rgbToRgba(theme.colors.background, 0.8),
    };
  }

  return (
    <ShadowedView style={styles.shadow}>
      <View style={styles.view}>
        <Text style={styles.title}>{props.children}</Text>
      </View>
    </ShadowedView>
  );
}

export default Header;
