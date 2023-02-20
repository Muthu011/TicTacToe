import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Circle from './Circle';
import Cross from './Cross';

const Cell = props => {
  const {cell, onPress} = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell === 'o' && <Circle />}
      {cell === 'x' && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 90,
    height: 90,
    flex: 1,
  },
});

export default Cell;
