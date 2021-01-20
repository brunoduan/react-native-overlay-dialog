import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DialogFooterProps } from '../types';

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
});

const DialogActionList = ({
  style,
  children,
}: DialogFooterProps) => {
  return (
    <View style={[styles.horizontal, style]}>
      {children}
    </View>
  );
};

export default DialogActionList;
