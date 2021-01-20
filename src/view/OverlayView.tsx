import React, { useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import type { OverlayProps } from '../types';

export interface OverlayViewHandle {
  setOpacity: (value: number) => void
}

const OverlayView: React.ForwardRefRenderFunction<OverlayViewHandle, OverlayProps> = (props: OverlayProps, self: any) => {
  const {
    visible = false,
    backgroundColor = '#000',
    onPress = () => {},
    opacity = 0.5,
    animationDuration: duration = 80,
    useNativeDriver = true,
    pointerEvents
  } = props;

  const [opaque] = useState(new Animated.Value(0));
  useImperativeHandle(self, () => ({
    setOpacity(value: number) {
      opaque.setValue(value);
    }
  }));

  useEffect(() => {
    const toValue = visible ? opacity : 0;
      Animated.timing(opaque, {
        toValue,
        duration,
        useNativeDriver,
      }).start();
  });

  return (
    <Animated.View
        pointerEvents={pointerEvents}
        style={[StyleSheet.absoluteFill, {
          backgroundColor,
          opacity: opaque,
        }]}
      >
        <TouchableOpacity
          onPress={onPress}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
  );
};

export default React.forwardRef(OverlayView);
