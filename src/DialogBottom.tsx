import React from 'react';
import { StyleSheet } from 'react-native';
import Dialog from './Dialog';
import Slide from './anim/AnimationSlide';
import type { DialogProps } from './types';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  dialog: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

const DialogBottom = ({
  style,
  dialogStyle,
  ...restProps
}: DialogProps) => (
  <Dialog
    dialogAnimation={new Slide({
      slideFrom: 'bottom',
    })}
    {...restProps}
    style={StyleSheet.flatten([styles.container, style])}
    dialogStyle={StyleSheet.flatten([styles.dialog, dialogStyle])}
    width={1}
    swipeDirection='down'
  />
);

export default DialogBottom;
