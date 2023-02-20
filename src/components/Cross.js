import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

const Cross = props => {
  return (
    <View style={styles.cross}>
      <View style={styles.crossLine}></View>
      <View style={[styles.crossLine, styles.reverseCrossLine]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  cross: {
    // width: '100%',
    // height: '100%',
    flex: 1,
  },

  crossLine: {
    position: 'absolute',
    backgroundColor: '#fff',
    left: '45%',
    width: 10,
    height: '100%',
    borderRadius: 20,
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
  reverseCrossLine: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
});

export default Cross;
