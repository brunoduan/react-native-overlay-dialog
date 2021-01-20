import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { DialogBodyProps } from '../types';

const styles = StyleSheet.create({
  body: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  }
});

const DialogBody = ({
  style,
  children,
}: DialogBodyProps) => {
    return (
      <View style={[styles.body, style]}>
        {children}
      </View>
    );
  };

export default DialogBody;