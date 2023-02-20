import React from 'react';
import {View, StyleSheet} from 'react-native';

const Circle = props => {
  return <View style={styles.circle}></View>;
};

const styles = StyleSheet.create({
  circle: {
    flex: 1,
    borderRadius: 50,
    margin: 10,
    borderWidth: 10,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Circle;
