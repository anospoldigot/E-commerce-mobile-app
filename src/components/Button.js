import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PrimaryColor } from '../styles/theme';

const MaterialButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={{...styles.button, ...style}} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: PrimaryColor,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 10,
    shadowColor: PrimaryColor,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 999
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MaterialButton;
