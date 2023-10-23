import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

function Header(props: {children: React.ReactNode}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    title: {
      width: '100%',
      textAlign: 'center',
      color: theme.colors.primary,
      fontSize: 50,
      textShadowColor: theme.colors.shadow,
      textShadowRadius: 30,
      textShadowOffset: {width: 0, height: 0},
      marginTop: 10,
    },
  });

  return <Text style={styles.title}>{props.children}</Text>;
}

export default Header;
