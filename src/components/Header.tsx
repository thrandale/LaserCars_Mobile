import React, {ReactElement} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {rgbToRgba} from '../Utils';
import {ShadowedView} from 'react-native-fast-shadow';
import {RadialGradient} from 'react-native-gradients';

function Header(props: {children: React.ReactNode}) {
  const theme = useTheme();

  if (Platform.OS === 'android') {
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
      shadow: {
        marginTop: 10,
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 0},
        borderRadius: 25,
        shadowColor: rgbToRgba(theme.colors.background, 0.9),
      },
    });

    return (
      <ShadowedView style={styles.shadow}>
        <Text style={styles.title}>{props.children}</Text>
      </ShadowedView>
    );
  } else {
    const styles = StyleSheet.create({
      container: {
        display: 'flex',
        flexDirection: 'row',
      },
      hiddenTitle: {
        width: 0,
        color: 'transparent',
        padding: 5,
        paddingHorizontal: 0,
        fontSize: 50,
      },
      title: {
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        color: theme.colors.primary,
        fontSize: 50,
        padding: 5,
        paddingHorizontal: 20,
        textShadowColor: theme.colors.primary,
        textShadowRadius: 8,
        textShadowOffset: {width: 0, height: 0},
      },
    });

    const shadowColor = theme.colors.background;
    const colorList = [
      {offset: '0%', color: shadowColor, opacity: '1'},
      {offset: '50%', color: shadowColor, opacity: '.9'},
      {offset: '75%', color: shadowColor, opacity: '.8'},
      {offset: '99%', color: shadowColor, opacity: '.1'},
      {offset: '100%', color: shadowColor, opacity: '0'},
    ];

    return (
      <View style={styles.container}>
        <RadialGradient
          x="50%"
          y="50%"
          rx={`${(props.children as ReactElement[]).length * 17}`}
          ry="50%"
          colorList={colorList}
        />
        {/* this first text is just to make sure the radial gradient is the correct size */}
        <Text style={styles.hiddenTitle}>{props.children}</Text>
        {/* this second text is the actual title */}
        <Text style={styles.title}>{props.children}</Text>
      </View>
    );
  }
}

export default Header;
